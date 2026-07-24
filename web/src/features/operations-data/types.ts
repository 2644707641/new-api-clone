/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
export type OperationsReportRange = {
  startTimestamp: number
  endTimestamp: number
}

export type OperationsDimensionItem = {
  key: string
  label: string
  payment_amount: number
  quota: number
  requests: number
  tokens: number
  online_transactions: number
  voucher_transactions: number
}

export type OperationsRechargeReport = {
  total_payment_amount: number
  total_quota: number
  total_transactions: number
  online_transactions: number
  voucher_transactions: number
  by_date: OperationsDimensionItem[]
  by_user: OperationsDimensionItem[]
}

export type OperationsConsumptionReport = {
  total_requests: number
  total_quota: number
  total_tokens: number
  by_date: OperationsDimensionItem[]
  by_user: OperationsDimensionItem[]
  by_model: OperationsDimensionItem[]
  by_channel: OperationsDimensionItem[]
}

export type OperationsReport = {
  recharge: OperationsRechargeReport
  consumption: OperationsConsumptionReport
}

export type GetOperationsReportResponse = {
  success: boolean
  message?: string
  data?: OperationsReport
}
