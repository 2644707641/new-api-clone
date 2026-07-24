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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatQuota } from '@/lib/format'

import type { OperationsDimensionItem } from '../types'

type OperationsReportTableProps = {
  title: string
  items: OperationsDimensionItem[]
  reportType: 'recharge' | 'consumption'
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

export function OperationsReportTable(props: OperationsReportTableProps) {
  const { t } = useTranslation()
  const isRecharge = props.reportType === 'recharge'
  const columnCount = isRecharge ? 5 : 4

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Dimension')}</TableHead>
              {isRecharge ? (
                <>
                  <TableHead className='text-right'>
                    {t('Payment amount')}
                  </TableHead>
                  <TableHead className='text-right'>
                    {t('Recharge quota')}
                  </TableHead>
                  <TableHead className='text-right'>
                    {t('Online recharges')}
                  </TableHead>
                  <TableHead className='text-right'>
                    {t('Voucher redemptions')}
                  </TableHead>
                </>
              ) : (
                <>
                  <TableHead className='text-right'>
                    {t('Consumption requests')}
                  </TableHead>
                  <TableHead className='text-right'>
                    {t('Consumption quota')}
                  </TableHead>
                  <TableHead className='text-right'>
                    {t('Consumed tokens')}
                  </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className='text-muted-foreground text-center'
                >
                  {t(
                    'No report data is available for the selected date range.'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              props.items.map((item) => (
                <TableRow key={item.key}>
                  <TableCell className='font-medium'>{item.label}</TableCell>
                  {isRecharge ? (
                    <>
                      <TableCell className='text-right tabular-nums'>
                        {formatNumber(item.payment_amount)}
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatQuota(item.quota)}
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatNumber(item.online_transactions)}
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatNumber(item.voucher_transactions)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className='text-right tabular-nums'>
                        {formatNumber(item.requests)}
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatQuota(item.quota)}
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatNumber(item.tokens)}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
