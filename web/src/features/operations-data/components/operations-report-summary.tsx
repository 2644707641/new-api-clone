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
import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { formatQuota } from '@/lib/format'

import type { OperationsReport } from '../types'

type OperationsReportSummaryProps = {
  report: OperationsReport
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

function SummaryCard(props: { label: string; value: string }) {
  return (
    <Card size='sm'>
      <CardContent className='space-y-1'>
        <p className='text-muted-foreground text-xs'>{props.label}</p>
        <p className='text-lg font-semibold tabular-nums'>{props.value}</p>
      </CardContent>
    </Card>
  )
}

export function OperationsReportSummary(props: OperationsReportSummaryProps) {
  const { t } = useTranslation()
  const rechargeCards = [
    {
      label: t('Payment amount'),
      value: formatNumber(props.report.recharge.total_payment_amount),
    },
    {
      label: t('Recharge quota'),
      value: formatQuota(props.report.recharge.total_quota),
    },
    {
      label: t('Online recharges'),
      value: formatNumber(props.report.recharge.online_transactions),
    },
    {
      label: t('Voucher redemptions'),
      value: formatNumber(props.report.recharge.voucher_transactions),
    },
  ]
  const consumptionCards = [
    {
      label: t('Consumption quota'),
      value: formatQuota(props.report.consumption.total_quota),
    },
    {
      label: t('Consumption requests'),
      value: formatNumber(props.report.consumption.total_requests),
    },
    {
      label: t('Consumed tokens'),
      value: formatNumber(props.report.consumption.total_tokens),
    },
  ]

  return (
    <div className='space-y-4'>
      <section className='space-y-2' aria-labelledby='recharge-summary-title'>
        <h3 id='recharge-summary-title' className='text-sm font-semibold'>
          {t('Recharge report')}
        </h3>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {rechargeCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>
      </section>
      <section
        className='space-y-2'
        aria-labelledby='consumption-summary-title'
      >
        <h3 id='consumption-summary-title' className='text-sm font-semibold'>
          {t('Consumption report')}
        </h3>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
          {consumptionCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>
      </section>
    </div>
  )
}
