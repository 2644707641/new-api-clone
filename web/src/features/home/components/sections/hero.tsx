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

import { useSystemConfig } from '@/hooks/use-system-config'

import { HOME_GRAINIENT_CONFIG } from '../background-config'
import { CodeRainBackground } from '../code-rain-background'
import { FeaturePanel } from '../feature-panel'
import Grainient from '../grainient'
import { homeHeroLayoutClasses } from '../layout'

export function Hero() {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()

  return (
    <section className={homeHeroLayoutClasses.section}>
      {/* Animated gradient background (Grainient) */}
      <div className='pointer-events-none absolute inset-0 z-0 opacity-60 dark:opacity-40'>
        <Grainient className='h-full w-full' {...HOME_GRAINIENT_CONFIG} />
      </div>
      {/* Readability scrim over the gradient */}
      <div className='bg-background/40 dark:bg-background/60 pointer-events-none absolute inset-0 z-0' />
      {/* Code rain overlay */}
      <CodeRainBackground />
      <div className={homeHeroLayoutClasses.columns}>
        <div className={homeHeroLayoutClasses.intro}>
          <div className='flex -translate-y-2 flex-col gap-4 sm:-translate-y-3'>
            <p className='text-primary text-sm font-semibold'>
              {t('AI Application Infrastructure Foundation')}
            </p>
            <h1 className='text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl'>
              {systemName}
            </h1>
          </div>
          <p className='text-muted-foreground max-w-xl text-base leading-8 sm:text-lg'>
            {t(
              'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
            )}
          </p>
          <p className='border-foreground/70 border-l-2 pl-4 text-sm font-semibold sm:text-base'>
            {t('Powerful API Management Platform')}
          </p>
        </div>

        <div className={homeHeroLayoutClasses.panel}>
          <FeaturePanel />
        </div>
      </div>
    </section>
  )
}
