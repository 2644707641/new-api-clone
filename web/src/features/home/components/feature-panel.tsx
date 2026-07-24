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
import {
  BarChart3,
  Code2,
  Gauge,
  ReceiptText,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface FeaturePanelProps {
  className?: string
}

interface PanelFeature {
  icon: LucideIcon
  title: string
  desc: string
  iconBg: string
  iconColor: string
}

export function FeaturePanel({ className }: FeaturePanelProps) {
  const { t } = useTranslation()

  const features: PanelFeature[] = [
    {
      icon: ReceiptText,
      title: t('Transparent Billing'),
      desc: t('Pay-as-you-go with real-time usage monitoring'),
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-500',
    },
    {
      icon: Code2,
      title: t('Developer Friendly'),
      desc: t('Compatible API routes for common AI application workflows'),
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-500',
    },
    {
      icon: BarChart3,
      title: t('Cost Tracking'),
      desc: t('Track usage, costs and performance with real-time analytics'),
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-500',
    },
    {
      icon: Gauge,
      title: t('High Performance'),
      desc: t('Support for high concurrency with automatic load balancing'),
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-500',
    },
    {
      icon: ShieldCheck,
      title: t('Secure & Reliable'),
      desc: t(
        'Enterprise-grade security with comprehensive permission management'
      ),
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-500',
    },
  ]

  return (
    <div className={cn('mx-auto w-full max-w-lg', className)}>
      <div className='bg-card/95 border-border/60 overflow-hidden rounded-xl border shadow-xl backdrop-blur-sm transition-transform duration-300 motion-reduce:transition-none lg:rotate-2 lg:hover:scale-[1.01] lg:hover:rotate-1'>
        <div className='p-6 sm:p-8'>
          <div className='mb-5'>
            <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
              {t('Powerful API Management Platform')}
            </h2>
            <p className='text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base'>
              {t('Built for developers,')} {t('designed for scale')}
            </p>
          </div>

          <div className='space-y-1'>
            {features.map((feature) => (
              <div
                key={feature.title}
                className='group/feature hover:bg-muted/40 flex items-start gap-4 rounded-lg px-2 py-3 transition-colors duration-200'
              >
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover/feature:scale-105 motion-reduce:transition-none',
                    feature.iconBg
                  )}
                >
                  <feature.icon
                    aria-hidden='true'
                    className={cn('size-4', feature.iconColor)}
                    strokeWidth={2}
                  />
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='text-sm font-semibold'>{feature.title}</h3>
                  <p className='text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm'>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
