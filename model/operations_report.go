package model

import (
	"sort"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"gorm.io/gorm"
)

type OperationsDimensionItem struct {
	Key                 string  `json:"key"`
	Label               string  `json:"label"`
	PaymentAmount       float64 `json:"payment_amount"`
	Quota               int64   `json:"quota"`
	Requests            int64   `json:"requests"`
	Tokens              int64   `json:"tokens"`
	OnlineTransactions  int64   `json:"online_transactions"`
	VoucherTransactions int64   `json:"voucher_transactions"`
}

type OperationsRechargeReport struct {
	TotalPaymentAmount  float64                   `json:"total_payment_amount"`
	TotalQuota          int64                     `json:"total_quota"`
	TotalTransactions   int64                     `json:"total_transactions"`
	OnlineTransactions  int64                     `json:"online_transactions"`
	VoucherTransactions int64                     `json:"voucher_transactions"`
	ByDate              []OperationsDimensionItem `json:"by_date"`
	ByUser              []OperationsDimensionItem `json:"by_user"`
}

type OperationsConsumptionReport struct {
	TotalRequests int64                     `json:"total_requests"`
	TotalQuota    int64                     `json:"total_quota"`
	TotalTokens   int64                     `json:"total_tokens"`
	ByDate        []OperationsDimensionItem `json:"by_date"`
	ByUser        []OperationsDimensionItem `json:"by_user"`
	ByModel       []OperationsDimensionItem `json:"by_model"`
	ByChannel     []OperationsDimensionItem `json:"by_channel"`
}

type OperationsReport struct {
	Recharge    OperationsRechargeReport    `json:"recharge"`
	Consumption OperationsConsumptionReport `json:"consumption"`
}

type operationsAggregate struct {
	Dimension     string  `gorm:"column:dimension"`
	UserID        int     `gorm:"column:user_id"`
	ChannelID     int     `gorm:"column:channel_id"`
	PaymentAmount float64 `gorm:"column:payment_amount"`
	Quota         int64   `gorm:"column:quota"`
	Transactions  int64   `gorm:"column:transactions"`
	Requests      int64   `gorm:"column:requests"`
	Tokens        int64   `gorm:"column:tokens"`
}

func GetOperationsReport(startTimestamp int64, endTimestamp int64) (OperationsReport, error) {
	report := OperationsReport{}

	rechargeByDate, rechargeByUser, err := getOperationsRechargeReport(startTimestamp, endTimestamp)
	if err != nil {
		return report, err
	}
	report.Recharge.ByDate = rechargeByDate
	report.Recharge.ByUser = rechargeByUser
	for _, item := range rechargeByDate {
		report.Recharge.TotalPaymentAmount += item.PaymentAmount
		report.Recharge.TotalQuota += item.Quota
		report.Recharge.OnlineTransactions += item.OnlineTransactions
		report.Recharge.VoucherTransactions += item.VoucherTransactions
	}
	report.Recharge.TotalTransactions = report.Recharge.OnlineTransactions + report.Recharge.VoucherTransactions

	consumption, err := getOperationsConsumptionReport(startTimestamp, endTimestamp)
	if err != nil {
		return report, err
	}
	report.Consumption = consumption
	return report, nil
}

func getOperationsRechargeReport(startTimestamp int64, endTimestamp int64) ([]OperationsDimensionItem, []OperationsDimensionItem, error) {
	byDate := map[string]*OperationsDimensionItem{}
	byUser := map[string]*OperationsDimensionItem{}
	userIDs := map[int]struct{}{}

	onlineByDate, err := queryOperationsTopUpsByDate(startTimestamp, endTimestamp)
	if err != nil {
		return nil, nil, err
	}
	for _, row := range onlineByDate {
		mergeOperationsRechargeItem(byDate, row.Dimension, row.Dimension, row, true)
	}

	voucherByDate, err := queryOperationsRedemptionsByDate(startTimestamp, endTimestamp)
	if err != nil {
		return nil, nil, err
	}
	for _, row := range voucherByDate {
		mergeOperationsRechargeItem(byDate, row.Dimension, row.Dimension, row, false)
	}

	onlineByUser, err := queryOperationsTopUpsByUser(startTimestamp, endTimestamp)
	if err != nil {
		return nil, nil, err
	}
	for _, row := range onlineByUser {
		userIDs[row.UserID] = struct{}{}
		mergeOperationsRechargeItem(byUser, strconv.Itoa(row.UserID), "", row, true)
	}

	voucherByUser, err := queryOperationsRedemptionsByUser(startTimestamp, endTimestamp)
	if err != nil {
		return nil, nil, err
	}
	for _, row := range voucherByUser {
		userIDs[row.UserID] = struct{}{}
		mergeOperationsRechargeItem(byUser, strconv.Itoa(row.UserID), "", row, false)
	}

	userLabels, err := getOperationsUserLabels(userIDs)
	if err != nil {
		return nil, nil, err
	}
	for key, item := range byUser {
		item.Label = userLabels[key]
		if item.Label == "" {
			item.Label = key
		}
	}

	return operationsDimensionItems(byDate), operationsDimensionItems(byUser), nil
}

func getOperationsConsumptionReport(startTimestamp int64, endTimestamp int64) (OperationsConsumptionReport, error) {
	report := OperationsConsumptionReport{}
	dateExpression := operationsDateExpression(common.LogDatabaseType(), "created_at")

	byDate, err := queryOperationsConsumption(startTimestamp, endTimestamp, dateExpression, dateExpression)
	if err != nil {
		return report, err
	}
	report.ByDate = byDate
	for _, item := range byDate {
		report.TotalRequests += item.Requests
		report.TotalQuota += item.Quota
		report.TotalTokens += item.Tokens
	}

	report.ByUser, err = queryOperationsConsumption(startTimestamp, endTimestamp, "username", "username")
	if err != nil {
		return report, err
	}
	report.ByModel, err = queryOperationsConsumption(startTimestamp, endTimestamp, "model_name", "model_name")
	if err != nil {
		return report, err
	}

	channelRows, err := queryOperationsConsumptionByChannel(startTimestamp, endTimestamp)
	if err != nil {
		return report, err
	}
	channelLabels, err := getOperationsChannelLabels(channelRows)
	if err != nil {
		return report, err
	}
	report.ByChannel = make([]OperationsDimensionItem, 0, len(channelRows))
	for _, row := range channelRows {
		key := strconv.Itoa(row.ChannelID)
		label := channelLabels[key]
		if label == "" {
			label = key
		}
		report.ByChannel = append(report.ByChannel, OperationsDimensionItem{
			Key:      key,
			Label:    label,
			Requests: row.Requests,
			Quota:    row.Quota,
			Tokens:   row.Tokens,
		})
	}
	sortOperationsDimensionItems(report.ByChannel)

	return report, nil
}

func queryOperationsTopUpsByDate(startTimestamp int64, endTimestamp int64) ([]operationsAggregate, error) {
	dateExpression := operationsDateExpression(common.MainDatabaseType(), "complete_time")
	rows := []operationsAggregate{}
	query := operationsTimeRange(DB.Model(&TopUp{}), "complete_time", startTimestamp, endTimestamp).
		Where("status = ?", common.TopUpStatusSuccess).
		Select(dateExpression + " AS dimension, COALESCE(SUM(money), 0) AS payment_amount, COALESCE(SUM(amount), 0) AS quota, COUNT(*) AS transactions").
		Group(dateExpression)
	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func queryOperationsRedemptionsByDate(startTimestamp int64, endTimestamp int64) ([]operationsAggregate, error) {
	dateExpression := operationsDateExpression(common.MainDatabaseType(), "redeemed_time")
	rows := []operationsAggregate{}
	query := operationsTimeRange(DB.Model(&Redemption{}), "redeemed_time", startTimestamp, endTimestamp).
		Where("status = ?", common.RedemptionCodeStatusUsed).
		Select(dateExpression + " AS dimension, COALESCE(SUM(quota), 0) AS quota, COUNT(*) AS transactions").
		Group(dateExpression)
	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func queryOperationsTopUpsByUser(startTimestamp int64, endTimestamp int64) ([]operationsAggregate, error) {
	rows := []operationsAggregate{}
	query := operationsTimeRange(DB.Model(&TopUp{}), "complete_time", startTimestamp, endTimestamp).
		Where("status = ?", common.TopUpStatusSuccess).
		Select("user_id, COALESCE(SUM(money), 0) AS payment_amount, COALESCE(SUM(amount), 0) AS quota, COUNT(*) AS transactions").
		Group("user_id")
	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func queryOperationsRedemptionsByUser(startTimestamp int64, endTimestamp int64) ([]operationsAggregate, error) {
	rows := []operationsAggregate{}
	query := operationsTimeRange(DB.Model(&Redemption{}), "redeemed_time", startTimestamp, endTimestamp).
		Where("status = ?", common.RedemptionCodeStatusUsed).
		Select("used_user_id AS user_id, COALESCE(SUM(quota), 0) AS quota, COUNT(*) AS transactions").
		Group("used_user_id")
	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func queryOperationsConsumption(startTimestamp int64, endTimestamp int64, dimensionExpression string, groupExpression string) ([]OperationsDimensionItem, error) {
	rows := []operationsAggregate{}
	query := operationsTimeRange(LOG_DB.Model(&Log{}), "created_at", startTimestamp, endTimestamp).
		Where("type = ?", LogTypeConsume).
		Select(dimensionExpression + " AS dimension, COUNT(*) AS requests, COALESCE(SUM(quota), 0) AS quota, COALESCE(SUM(prompt_tokens), 0) + COALESCE(SUM(completion_tokens), 0) AS tokens").
		Group(groupExpression)
	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}

	items := make([]OperationsDimensionItem, 0, len(rows))
	for _, row := range rows {
		items = append(items, OperationsDimensionItem{
			Key:      row.Dimension,
			Label:    row.Dimension,
			Requests: row.Requests,
			Quota:    row.Quota,
			Tokens:   row.Tokens,
		})
	}
	sortOperationsDimensionItems(items)
	return items, nil
}

func queryOperationsConsumptionByChannel(startTimestamp int64, endTimestamp int64) ([]operationsAggregate, error) {
	rows := []operationsAggregate{}
	query := operationsTimeRange(LOG_DB.Model(&Log{}), "created_at", startTimestamp, endTimestamp).
		Where("type = ?", LogTypeConsume).
		Select("channel_id, COUNT(*) AS requests, COALESCE(SUM(quota), 0) AS quota, COALESCE(SUM(prompt_tokens), 0) + COALESCE(SUM(completion_tokens), 0) AS tokens").
		Group("channel_id")
	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func operationsTimeRange(query *gorm.DB, column string, startTimestamp int64, endTimestamp int64) *gorm.DB {
	if startTimestamp != 0 {
		query = query.Where(column+" >= ?", startTimestamp)
	}
	if endTimestamp != 0 {
		query = query.Where(column+" <= ?", endTimestamp)
	}
	return query
}

func operationsDateExpression(databaseType common.DatabaseType, column string) string {
	switch databaseType {
	case common.DatabaseTypeMySQL:
		return "DATE_FORMAT(FROM_UNIXTIME(" + column + "), '%Y-%m-%d')"
	case common.DatabaseTypePostgreSQL:
		return "TO_CHAR(TO_TIMESTAMP(" + column + "), 'YYYY-MM-DD')"
	case common.DatabaseTypeClickHouse:
		return "formatDateTime(toDateTime(" + column + "), '%Y-%m-%d')"
	default:
		return "strftime('%Y-%m-%d', " + column + ", 'unixepoch')"
	}
}

func mergeOperationsRechargeItem(items map[string]*OperationsDimensionItem, key string, label string, row operationsAggregate, online bool) {
	item, ok := items[key]
	if !ok {
		item = &OperationsDimensionItem{Key: key, Label: label}
		items[key] = item
	}
	item.PaymentAmount += row.PaymentAmount
	item.Quota += row.Quota
	if online {
		item.OnlineTransactions += row.Transactions
		return
	}
	item.VoucherTransactions += row.Transactions
}

func getOperationsUserLabels(userIDs map[int]struct{}) (map[string]string, error) {
	ids := make([]int, 0, len(userIDs))
	for id := range userIDs {
		ids = append(ids, id)
	}
	if len(ids) == 0 {
		return map[string]string{}, nil
	}

	users := []struct {
		Id       int    `gorm:"column:id"`
		Username string `gorm:"column:username"`
	}{}
	if err := DB.Model(&User{}).Select("id, username").Where("id IN ?", ids).Find(&users).Error; err != nil {
		return nil, err
	}

	labels := make(map[string]string, len(users))
	for _, user := range users {
		labels[strconv.Itoa(user.Id)] = user.Username
	}
	return labels, nil
}

func getOperationsChannelLabels(rows []operationsAggregate) (map[string]string, error) {
	ids := make([]int, 0, len(rows))
	for _, row := range rows {
		if row.ChannelID != 0 {
			ids = append(ids, row.ChannelID)
		}
	}
	if len(ids) == 0 {
		return map[string]string{}, nil
	}

	channels := []struct {
		Id   int    `gorm:"column:id"`
		Name string `gorm:"column:name"`
	}{}
	if err := DB.Model(&Channel{}).Select("id, name").Where("id IN ?", ids).Find(&channels).Error; err != nil {
		return nil, err
	}

	labels := make(map[string]string, len(channels))
	for _, channel := range channels {
		labels[strconv.Itoa(channel.Id)] = channel.Name
	}
	return labels, nil
}

func operationsDimensionItems(items map[string]*OperationsDimensionItem) []OperationsDimensionItem {
	result := make([]OperationsDimensionItem, 0, len(items))
	for _, item := range items {
		result = append(result, *item)
	}
	sortOperationsDimensionItems(result)
	return result
}

func sortOperationsDimensionItems(items []OperationsDimensionItem) {
	sort.Slice(items, func(i int, j int) bool {
		return items[i].Label < items[j].Label
	})
}
