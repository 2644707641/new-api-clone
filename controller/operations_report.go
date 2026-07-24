package controller

import (
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

const operationsReportMaxRangeSeconds int64 = 366 * 24 * 60 * 60

func GetOperationsReport(c *gin.Context) {
	startTimestamp, err := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	if err != nil || startTimestamp <= 0 {
		common.ApiErrorMsg(c, "invalid start_timestamp")
		return
	}
	endTimestamp, err := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	if err != nil || endTimestamp <= 0 {
		common.ApiErrorMsg(c, "invalid end_timestamp")
		return
	}
	if endTimestamp < startTimestamp || endTimestamp-startTimestamp > operationsReportMaxRangeSeconds {
		common.ApiErrorMsg(c, "invalid time range")
		return
	}

	report, err := model.GetOperationsReport(startTimestamp, endTimestamp)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, report)
}
