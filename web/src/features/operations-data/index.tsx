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
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { DateTimePicker } from '@/components/datetime-picker'
import { SectionPageLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

import { getOperationsReport } from './api'
import { OperationsReportSummary } from './components/operations-report-summary'
import { OperationsReportTable } from './components/operations-report-table'
import type { OperationsReportRange } from './types'

const MAX_REPORT_RANGE_DAYS = 366
const REPORT_STALE_TIME = 60 * 1000

function getDefaultDateRange(): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 29)
  start.setHours(0, 0, 0, 0)
  return { start, end }
}

function toReportRange(start: Date, end: Date): OperationsReportRange {
  return {
    startTimestamp: Math.floor(start.getTime() / 1000),
    endTimestamp: Math.floor(end.getTime() / 1000),
  }
}

function OperationsReportSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className='h-20 rounded-xl' />
        ))}
      </div>
      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className='h-20 rounded-xl' />
        ))}
      </div>
      <Skeleton className='h-72 rounded-xl' />
    </div>
  )
}

export function OperationsData() {
  const { t } = useTranslation()
  const [defaultRange] = useState(getDefaultDateRange)
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultRange.start
  )
  const [endDate, setEndDate] = useState<Date | undefined>(defaultRange.end)
  const [reportRange, setReportRange] = useState<OperationsReportRange>(() =>
    toReportRange(defaultRange.start, defaultRange.end)
  )
  const query = useQuery({
    queryKey: [
      'operations-report',
      reportRange.startTimestamp,
      reportRange.endTimestamp,
    ],
    queryFn: async () => {
      const result = await getOperationsReport(reportRange)
      if (!result.success || !result.data) {
        throw new Error(result.message || t('Failed to load operations report'))
      }
      return result.data
    },
    staleTime: REPORT_STALE_TIME,
  })

  const handleApply = () => {
    if (!startDate || !endDate) {
      toast.error(t('Select both start and end dates'))
      return
    }
    if (startDate > endDate) {
      toast.error(t('Start date must be before end date.'))
      return
    }
    const rangeDays = (endDate.getTime() - startDate.getTime()) / 86_400_000
    if (rangeDays > MAX_REPORT_RANGE_DAYS) {
      toast.error(t('Date range cannot exceed 366 days.'))
      return
    }
    setReportRange(toReportRange(startDate, endDate))
  }

  return (
    <SectionPageLayout>
      <SectionPageLayout.Title>{t('Operations Data')}</SectionPageLayout.Title>
      <SectionPageLayout.Content>
        <div className='space-y-4'>
          <Card>
            <CardContent className='flex flex-col gap-3 pt-4 lg:flex-row lg:items-end'>
              <div className='grid flex-1 gap-3 sm:grid-cols-2'>
                <fieldset className='space-y-1.5 text-sm font-medium'>
                  <legend>{t('From')}</legend>
                  <DateTimePicker value={startDate} onChange={setStartDate} />
                </fieldset>
                <fieldset className='space-y-1.5 text-sm font-medium'>
                  <legend>{t('To')}</legend>
                  <DateTimePicker value={endDate} onChange={setEndDate} />
                </fieldset>
              </div>
              <Button onClick={handleApply} disabled={query.isFetching}>
                {t('Apply')}
              </Button>
            </CardContent>
          </Card>

          {query.isLoading ? <OperationsReportSkeleton /> : null}
          {query.isError ? (
            <Empty className='min-h-72 border'>
              <EmptyContent>
                <EmptyTitle>{t('Failed to load operations report')}</EmptyTitle>
                <EmptyDescription>
                  {query.error instanceof Error
                    ? query.error.message
                    : t('Please try again later.')}
                </EmptyDescription>
                <Button
                  onClick={() => query.refetch()}
                  disabled={query.isFetching}
                >
                  {t('Retry')}
                </Button>
              </EmptyContent>
            </Empty>
          ) : null}
          {query.data ? (
            <>
              <OperationsReportSummary report={query.data} />
              <section
                className='space-y-3'
                aria-labelledby='recharge-reports-title'
              >
                <h3
                  id='recharge-reports-title'
                  className='text-sm font-semibold'
                >
                  {t('Recharge report')}
                </h3>
                <div className='grid gap-4 xl:grid-cols-2'>
                  <OperationsReportTable
                    title={t('By Date')}
                    items={query.data.recharge.by_date}
                    reportType='recharge'
                  />
                  <OperationsReportTable
                    title={t('By Customer')}
                    items={query.data.recharge.by_user}
                    reportType='recharge'
                  />
                </div>
              </section>
              <section
                className='space-y-3'
                aria-labelledby='consumption-reports-title'
              >
                <h3
                  id='consumption-reports-title'
                  className='text-sm font-semibold'
                >
                  {t('Consumption report')}
                </h3>
                <div className='grid gap-4 xl:grid-cols-2'>
                  <OperationsReportTable
                    title={t('By Date')}
                    items={query.data.consumption.by_date}
                    reportType='consumption'
                  />
                  <OperationsReportTable
                    title={t('By Customer')}
                    items={query.data.consumption.by_user}
                    reportType='consumption'
                  />
                  <OperationsReportTable
                    title={t('By Model')}
                    items={query.data.consumption.by_model}
                    reportType='consumption'
                  />
                  <OperationsReportTable
                    title={t('By Channel')}
                    items={query.data.consumption.by_channel}
                    reportType='consumption'
                  />
                </div>
              </section>
            </>
          ) : null}
        </div>
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )
}
