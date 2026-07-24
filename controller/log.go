package controller

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
)

func GetAllLogs(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	username := c.Query("username")
	tokenName := c.Query("token_name")
	modelName := c.Query("model_name")
	channel, _ := strconv.Atoi(c.Query("channel"))
	group := c.Query("group")
	requestId := c.Query("request_id")
	upstreamRequestId := c.Query("upstream_request_id")
	logs, total, err := model.GetAllLogs(logType, startTimestamp, endTimestamp, modelName, username, tokenName, pageInfo.GetStartIdx(), pageInfo.GetPageSize(), channel, group, requestId, upstreamRequestId)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(logs)
	common.ApiSuccess(c, pageInfo)
	return
}

func GetUserLogs(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	userId := c.GetInt("id")
	role := c.GetInt("role")
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)

	// 非管理员用户只能查询6个月内的日志
	if role < common.RoleAdminUser {
		sixMonthsAgo := time.Now().AddDate(0, -6, 0).Unix()
		if startTimestamp == 0 || startTimestamp < sixMonthsAgo {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "普通用户只能查询最近6个月内的日志",
			})
			return
		}
	}

	tokenName := c.Query("token_name")
	modelName := c.Query("model_name")
	group := c.Query("group")
	requestId := c.Query("request_id")
	upstreamRequestId := c.Query("upstream_request_id")
	logs, total, err := model.GetUserLogs(userId, logType, startTimestamp, endTimestamp, modelName, tokenName, pageInfo.GetStartIdx(), pageInfo.GetPageSize(), group, requestId, upstreamRequestId)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(logs)
	common.ApiSuccess(c, pageInfo)
	return
}

// Deprecated: SearchAllLogs 已废弃，前端未使用该接口。
func SearchAllLogs(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": false,
		"message": "该接口已废弃",
	})
}

// Deprecated: SearchUserLogs 已废弃，前端未使用该接口。
func SearchUserLogs(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": false,
		"message": "该接口已废弃",
	})
}

func GetLogByKey(c *gin.Context) {
	tokenId := c.GetInt("token_id")
	if tokenId == 0 {
		c.JSON(200, gin.H{
			"success": false,
			"message": "无效的令牌",
		})
		return
	}
	logs, err := model.GetLogByTokenId(tokenId)
	if err != nil {
		c.JSON(200, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
		"message": "",
		"data":    logs,
	})
}

// DownloadLogs 导出日志为 CSV 文件（管理员导出全部日志，普通用户导出自己的日志）
func DownloadLogs(c *gin.Context) {
	role := c.GetInt("role")
	isAdmin := role >= common.RoleAdminUser

	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	tokenName := c.Query("token_name")
	modelName := c.Query("model_name")
	group := c.Query("group")
	requestId := c.Query("request_id")
	upstreamRequestId := c.Query("upstream_request_id")

	// 非管理员用户只能下载6个月内的日志
	if !isAdmin {
		sixMonthsAgo := time.Now().AddDate(0, -6, 0).Unix()
		if startTimestamp == 0 || startTimestamp < sixMonthsAgo {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "普通用户只能下载最近6个月内的日志",
			})
			return
		}
	}

	// 最大导出数量限制
	downloadLimit := 10000

	var logs []*model.Log
	var err error
	if isAdmin {
		username := c.Query("username")
		channel, _ := strconv.Atoi(c.Query("channel"))
		logs, _, err = model.GetAllLogs(logType, startTimestamp, endTimestamp, modelName, username, tokenName, 0, downloadLimit, channel, group, requestId, upstreamRequestId)
	} else {
		userId := c.GetInt("id")
		logs, _, err = model.GetUserLogs(userId, logType, startTimestamp, endTimestamp, modelName, tokenName, 0, downloadLimit, group, requestId, upstreamRequestId)
	}

	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 生成 CSV
	buf := &bytes.Buffer{}
	// 写入 UTF-8 BOM 以确保 Excel 正确识别中文
	buf.Write([]byte{0xEF, 0xBB, 0xBF})
	writer := csv.NewWriter(buf)

	// 写入表头
	header := []string{"ID", "用户ID", "用户名", "时间", "类型", "模型名称", "Token名称", "配额", "输入Tokens", "输出Tokens", "耗时(ms)", "是否流式", "分组", "IP", "请求ID"}
	if isAdmin {
		header = append(header, "渠道ID", "渠道名称", "其他信息")
	}
	writer.Write(header)

	// 写入数据
	for _, log := range logs {
		timeStr := time.Unix(log.CreatedAt, 0).Format("2006-01-02 15:04:05")
		logTypeStr := fmt.Sprintf("%d", log.Type)
		isStream := "否"
		if log.IsStream {
			isStream = "是"
		}

		row := []string{
			fmt.Sprintf("%d", log.Id),
			fmt.Sprintf("%d", log.UserId),
			log.Username,
			timeStr,
			logTypeStr,
			log.ModelName,
			log.TokenName,
			fmt.Sprintf("%d", log.Quota),
			fmt.Sprintf("%d", log.PromptTokens),
			fmt.Sprintf("%d", log.CompletionTokens),
			fmt.Sprintf("%d", log.UseTime),
			isStream,
			log.Group,
			log.Ip,
			log.RequestId,
		}
		if isAdmin {
			row = append(row,
				fmt.Sprintf("%d", log.ChannelId),
				log.ChannelName,
				log.Other,
			)
		}
		writer.Write(row)
	}

	writer.Flush()

	filename := fmt.Sprintf("logs_%s.csv", time.Now().Format("20060102_150405"))
	c.Header("Content-Type", "text/csv; charset=utf-8")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Data(http.StatusOK, "text/csv; charset=utf-8", buf.Bytes())
}

func GetLogsStat(c *gin.Context) {
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	tokenName := c.Query("token_name")
	username := c.Query("username")
	modelName := c.Query("model_name")
	channel, _ := strconv.Atoi(c.Query("channel"))
	group := c.Query("group")
	stat, err := model.SumUsedQuota(logType, startTimestamp, endTimestamp, modelName, username, tokenName, channel, group)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	//tokenNum := model.SumUsedToken(logType, startTimestamp, endTimestamp, modelName, username, "")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data": gin.H{
			"quota": stat.Quota,
			"rpm":   stat.Rpm,
			"tpm":   stat.Tpm,
		},
	})
	return
}

func GetLogsSelfStat(c *gin.Context) {
	username := c.GetString("username")
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	tokenName := c.Query("token_name")
	modelName := c.Query("model_name")
	channel, _ := strconv.Atoi(c.Query("channel"))
	group := c.Query("group")
	quotaNum, err := model.SumUsedQuota(logType, startTimestamp, endTimestamp, modelName, username, tokenName, channel, group)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	//tokenNum := model.SumUsedToken(logType, startTimestamp, endTimestamp, modelName, username, tokenName)
	c.JSON(200, gin.H{
		"success": true,
		"message": "",
		"data": gin.H{
			"quota": quotaNum.Quota,
			"rpm":   quotaNum.Rpm,
			"tpm":   quotaNum.Tpm,
			//"token": tokenNum,
		},
	})
	return
}
