package model

import (
	"fmt"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func setupOperationsReportTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	previousDB, previousLogDB := DB, LOG_DB
	previousMainDatabaseType := common.MainDatabaseType()
	previousLogDatabaseType := common.LogDatabaseType()
	common.SetDatabaseTypes(common.DatabaseTypeSQLite, common.DatabaseTypeSQLite)
	initCol()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	require.NoError(t, err)
	DB, LOG_DB = db, db
	require.NoError(t, db.AutoMigrate(&User{}, &Channel{}, &TopUp{}, &Redemption{}, &Log{}))

	t.Cleanup(func() {
		DB, LOG_DB = previousDB, previousLogDB
		common.SetDatabaseTypes(previousMainDatabaseType, previousLogDatabaseType)
		initCol()
		sqlDB, sqlErr := db.DB()
		if sqlErr == nil {
			_ = sqlDB.Close()
		}
	})

	return db
}

func findOperationsDimensionItem(items []OperationsDimensionItem, key string) OperationsDimensionItem {
	for _, item := range items {
		if item.Key == key {
			return item
		}
	}
	return OperationsDimensionItem{}
}

func TestGetOperationsReportAggregatesRechargeAndConsumptionDimensions(t *testing.T) {
	db := setupOperationsReportTestDB(t)
	const dayOne int64 = 1_704_067_200
	const dayTwo int64 = dayOne + 86_400

	users := []User{
		{Id: 1, Username: "alice", Password: "password", Status: common.UserStatusEnabled, AffCode: "alice-code"},
		{Id: 2, Username: "bob", Password: "password", Status: common.UserStatusEnabled, AffCode: "bob-code"},
	}
	require.NoError(t, db.Create(&users).Error)
	require.NoError(t, db.Create(&[]Channel{
		{Id: 1, Name: "east"},
		{Id: 2, Name: "west"},
	}).Error)

	require.NoError(t, db.Create(&[]TopUp{
		{UserId: 1, Amount: 100, Money: 2.5, TradeNo: "topup-alice", Status: common.TopUpStatusSuccess, CompleteTime: dayOne},
		{UserId: 2, Amount: 200, Money: 5, TradeNo: "topup-bob", Status: common.TopUpStatusSuccess, CompleteTime: dayTwo},
		{UserId: 2, Amount: 900, Money: 9, TradeNo: "topup-pending", Status: common.TopUpStatusPending, CompleteTime: dayTwo},
	}).Error)
	require.NoError(t, db.Create(&[]Redemption{
		{UserId: 1, UsedUserId: 1, Key: "00000000000000000000000000000001", Quota: 50, Status: common.RedemptionCodeStatusUsed, RedeemedTime: dayOne},
		{UserId: 2, UsedUserId: 2, Key: "00000000000000000000000000000002", Quota: 300, Status: common.RedemptionCodeStatusEnabled, RedeemedTime: dayTwo},
	}).Error)
	require.NoError(t, db.Create(&[]Log{
		{UserId: 1, Username: "alice", Type: LogTypeConsume, CreatedAt: dayOne, ModelName: "gpt-4.1", ChannelId: 1, Quota: 30, PromptTokens: 10, CompletionTokens: 20},
		{UserId: 2, Username: "bob", Type: LogTypeConsume, CreatedAt: dayOne + 1, ModelName: "gpt-4.1", ChannelId: 1, Quota: 70, PromptTokens: 1, CompletionTokens: 2},
		{UserId: 1, Username: "alice", Type: LogTypeConsume, CreatedAt: dayTwo, ModelName: "claude-sonnet", ChannelId: 2, Quota: 60, PromptTokens: 3, CompletionTokens: 4},
		{UserId: 1, Username: "alice", Type: LogTypeError, CreatedAt: dayTwo, ModelName: "gpt-4.1", ChannelId: 1, Quota: 999},
	}).Error)

	report, err := GetOperationsReport(dayOne, dayTwo+86_399)
	require.NoError(t, err)

	assert.EqualValues(t, 7.5, report.Recharge.TotalPaymentAmount)
	assert.EqualValues(t, 350, report.Recharge.TotalQuota)
	assert.EqualValues(t, 2, report.Recharge.OnlineTransactions)
	assert.EqualValues(t, 1, report.Recharge.VoucherTransactions)

	aliceRecharge := findOperationsDimensionItem(report.Recharge.ByUser, "1")
	assert.Equal(t, "alice", aliceRecharge.Label)
	assert.EqualValues(t, 2.5, aliceRecharge.PaymentAmount)
	assert.EqualValues(t, 150, aliceRecharge.Quota)
	assert.EqualValues(t, 1, aliceRecharge.OnlineTransactions)
	assert.EqualValues(t, 1, aliceRecharge.VoucherTransactions)

	assert.EqualValues(t, 3, report.Consumption.TotalRequests)
	assert.EqualValues(t, 160, report.Consumption.TotalQuota)
	assert.EqualValues(t, 40, report.Consumption.TotalTokens)

	dayOneConsumption := findOperationsDimensionItem(report.Consumption.ByDate, "2024-01-01")
	assert.EqualValues(t, 2, dayOneConsumption.Requests)
	assert.EqualValues(t, 100, dayOneConsumption.Quota)
	assert.EqualValues(t, 33, dayOneConsumption.Tokens)

	gptConsumption := findOperationsDimensionItem(report.Consumption.ByModel, "gpt-4.1")
	assert.EqualValues(t, 2, gptConsumption.Requests)
	assert.EqualValues(t, 100, gptConsumption.Quota)
	assert.EqualValues(t, 33, gptConsumption.Tokens)

	eastConsumption := findOperationsDimensionItem(report.Consumption.ByChannel, "1")
	assert.Equal(t, "east", eastConsumption.Label)
	assert.EqualValues(t, 2, eastConsumption.Requests)
	assert.EqualValues(t, 100, eastConsumption.Quota)
}
