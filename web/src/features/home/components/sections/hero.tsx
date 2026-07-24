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
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

import { HOME_GRAINIENT_CONFIG } from '../background-config'
import { CodeRainBackground } from '../code-rain-background'
import { FeaturePanel } from '../feature-panel'
import Grainient from '../grainient'
import { homeHeroLayoutClasses } from '../layout'
import { SupportedApps } from '../supported-apps'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

interface DocsButtonProps {
  docsUrl: string
}

function DocsButton(props: DocsButtonProps) {
  const { t } = useTranslation()
  const className =
    'group border-border/70 bg-background/65 hover:bg-background h-12 rounded-full px-6 text-sm font-medium shadow-sm'

  if (props.docsUrl.startsWith('http')) {
    return (
      <Button
        variant='outline'
        className={className}
        render={
          <a href={props.docsUrl} target='_blank' rel='noopener noreferrer' />
        }
      >
        <BookOpen aria-hidden='true' className='size-4' />
        {t('Docs')}
      </Button>
    )
  }

  return (
    <Button
      variant='outline'
      className={className}
      render={<Link to={props.docsUrl} />}
    >
      <BookOpen aria-hidden='true' className='size-4' />
      {t('Docs')}
    </Button>
  )
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const { systemName } = useSystemConfig()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'

  return (
    <section className={homeHeroLayoutClasses.section}>
      {/* Animated gradient background (Grainient) */}
      <div className='pointer-events-none absolute inset-0 z-0 opacity-60 dark:opacity-40'>
        <Grainient className='h-full w-full' {...HOME_GRAINIENT_CONFIG} />
      </div>
      {/* Readability scrim over the gradient */}
      <div className='pointer-events-none absolute inset-0 z-0 bg-background/40 dark:bg-background/60' />
      {/* Code rain overlay */}
      <CodeRainBackground />
      <div className={homeHeroLayoutClasses.columns}>
        <div className={homeHeroLayoutClasses.intro}>
          <p className='text-primary mb-5 text-sm font-semibold'>
            {t('AI Application Infrastructure Foundation')}
          </p>
          <h1 className='text-4xl leading-tight font-bold sm:text-5xl'>
            {systemName}
          </h1>
          <p className='text-muted-foreground mt-6 max-w-xl text-base leading-8 sm:text-lg'>
            {t(
              'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
            )}
          </p>
          <p className='border-foreground/70 mt-5 border-l-2 pl-4 text-sm font-semibold sm:text-base'>
            {t('Powerful API Management Platform')}
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            {props.isAuthenticated ? (
              <Button
                className='group h-12 rounded-full px-6 text-sm font-semibold shadow-sm'
                render={<Link to='/dashboard' />}
              >
                {t('Go to Dashboard')}
                <ArrowRight
                  aria-hidden='true'
                  className='size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none'
                />
              </Button>
            ) : (
              <Button
                className='group h-12 rounded-full px-6 text-sm font-semibold shadow-sm'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight
                  aria-hidden='true'
                  className='size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none'
                />
              </Button>
            )}
            <DocsButton docsUrl={docsUrl} />
          </div>
          <SupportedApps />
        </div>

        <div className={homeHeroLayoutClasses.panel}>
          <FeaturePanel />
        </div>
      </div>
    </section>
  )
}
