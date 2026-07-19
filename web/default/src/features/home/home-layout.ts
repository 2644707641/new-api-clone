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
  Code,
  DollarSign,
  Gauge,
  Globe,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface HomeTrustItem {
  id: string
  titleKey: string
  descriptionKey: string
  icon: LucideIcon
  accentClassName: string
}

export interface HomeServiceCard {
  id: string
  titleKey: string
  descriptionKey: string
  icon: LucideIcon
  accentClassName: string
}

export const HOME_TRUST_ITEMS: HomeTrustItem[] = [
  {
    id: 'billing',
    titleKey: 'Transparent Billing',
    descriptionKey: 'Pay-as-you-go with real-time usage monitoring',
    icon: DollarSign,
    accentClassName:
      'bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300',
  },
  {
    id: 'integration',
    titleKey: 'Developer Friendly',
    descriptionKey: 'Compatible API routes for common AI application workflows',
    icon: Code,
    accentClassName:
      'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300',
  },
  {
    id: 'security',
    titleKey: 'Secure & Reliable',
    descriptionKey:
      'Enterprise-grade security with comprehensive permission management',
    icon: Shield,
    accentClassName:
      'bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300',
  },
  {
    id: 'collaboration',
    titleKey: 'Team Collaboration',
    descriptionKey: 'Multi-user management with flexible permission allocation',
    icon: Users,
    accentClassName:
      'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300',
  },
  {
    id: 'performance',
    titleKey: 'High Performance',
    descriptionKey:
      'Support for high concurrency with automatic load balancing',
    icon: Gauge,
    accentClassName:
      'bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300',
  },
]

export const HOME_SERVICE_CARDS: HomeServiceCard[] = [
  {
    id: 'integration',
    titleKey: 'Developer Friendly',
    descriptionKey: 'Compatible API routes for common AI application workflows',
    icon: Code,
    accentClassName:
      'bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300',
  },
  {
    id: 'billing',
    titleKey: 'Transparent Billing',
    descriptionKey: 'Pay-as-you-go with real-time usage monitoring',
    icon: DollarSign,
    accentClassName:
      'bg-rose-500/10 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300',
  },
  {
    id: 'coverage',
    titleKey: 'Global Coverage',
    descriptionKey: 'Multi-region deployment for stable global access',
    icon: Globe,
    accentClassName:
      'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300',
  },
]

export const HOME_CTA_GRADIENT_CLASS =
  'bg-gradient-to-r from-cyan-200 via-indigo-200 to-violet-300'

export const HOME_HERO_BACKGROUND_STYLE = {
  backgroundColor: 'rgb(248 250 255)',
  backgroundImage:
    'radial-gradient(ellipse 58% 64% at 72% 5%, rgb(94 234 212 / 0.46), transparent 72%), radial-gradient(ellipse 62% 72% at 58% 72%, rgb(196 181 253 / 0.48), transparent 74%), linear-gradient(120deg, rgb(255 255 255) 0%, rgb(248 254 255) 42%, rgb(245 243 255) 100%)',
} as const

export const HOME_STATS_BACKGROUND_STYLE = {
  backgroundColor: 'rgb(255 255 255)',
  backgroundImage:
    'radial-gradient(ellipse 62% 120% at 58% -22%, rgb(196 181 253 / 0.38), transparent 74%), radial-gradient(ellipse 52% 110% at 72% -16%, rgb(94 234 212 / 0.18), transparent 72%), linear-gradient(180deg, rgb(237 239 255) 0%, rgb(255 255 255 / 0.72) 64%, rgb(255 255 255) 100%), linear-gradient(120deg, rgb(246 254 255) 0%, rgb(242 242 255) 50%, rgb(245 243 255) 100%)',
} as const

export const HOME_SITE_NAME = '中航科技'

export const HOME_HEADER_CLASS =
  'border-b border-border/60 bg-background shadow-sm'
