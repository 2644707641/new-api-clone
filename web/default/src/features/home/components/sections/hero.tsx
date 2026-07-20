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
import { CherryStudio } from '@lobehub/icons'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'

import { Grainient } from '../grainient'
import { HOME_TRUST_ITEMS } from '../../home-layout'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'

  const renderDocsButton = () => {
    const isExternal = docsUrl.startsWith('http')
    if (isExternal) {
      return (
        <Button
          variant='outline'
          className='group inline-flex h-11 items-center gap-1.5 rounded-lg border border-slate-900/15 bg-white/70 px-5 text-sm font-medium text-slate-950 hover:border-slate-900/25 hover:bg-white hover:text-slate-950'
          render={
            <a href={docsUrl} target='_blank' rel='noopener noreferrer' />
          }
        >
          <BookOpen className='size-4 text-slate-600 transition-colors duration-200 group-hover:text-slate-950' />
          <span>{t('Docs')}</span>
        </Button>
      )
    }
    return (
      <Button
        variant='outline'
        className='group inline-flex h-11 items-center gap-1.5 rounded-lg border border-slate-900/15 bg-white/70 px-5 text-sm font-medium text-slate-950 hover:border-slate-900/25 hover:bg-white hover:text-slate-950'
        render={<Link to={docsUrl} />}
      >
        <BookOpen className='size-4 text-slate-600 transition-colors duration-200 group-hover:text-slate-950' />
        <span>{t('Docs')}</span>
      </Button>
    )
  }

  return (
    <section
      className='relative z-10 overflow-hidden border-b border-transparent px-6 py-16 text-slate-950 md:py-24'
    >
      <Grainient aria-hidden className='pointer-events-none absolute inset-0 z-0' />
      <div className='relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16'>
        <div className='flex flex-col items-start text-left'>
          <div
            className='landing-animate-fade-up mb-5 inline-flex items-center gap-1.5 rounded-full border border-slate-900/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-950 opacity-0'
            style={{ animationDelay: '0ms' }}
          >
            <span className='relative flex size-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/50 opacity-75' />
              <span className='relative inline-flex size-1.5 rounded-full bg-blue-600' />
            </span>
            <span>{t('AI Application Infrastructure Foundation')}</span>
          </div>

          <h1
            className='landing-animate-fade-up text-3xl leading-tight font-bold opacity-0 md:text-5xl'
            style={{ animationDelay: '60ms' }}
          >
            {t('Unified API Gateway for')}
            <br />
            <span className='text-blue-700'>
              {t('Vast Range of AI Models')}
            </span>
          </h1>
          <p
            className='landing-animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-slate-700 opacity-0 md:text-[15px]'
            style={{ animationDelay: '120ms' }}
          >
            {t(
              'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
            )}
          </p>

          <div
            className='landing-animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0'
            style={{ animationDelay: '180ms' }}
          >
            {props.isAuthenticated ? (
              <>
                <Button
                  className='group h-11 rounded-lg bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800 hover:text-white'
                  render={<Link to='/dashboard' />}
                >
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                {renderDocsButton()}
              </>
            ) : (
              <>
                <Button
                  className='group h-11 rounded-lg bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800 hover:text-white'
                  render={<Link to='/sign-up' />}
                >
                  {t('Get Started')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button
                  variant='outline'
                  className='h-11 rounded-lg border border-slate-900/15 bg-white/70 px-5 text-sm font-medium text-slate-950 hover:border-slate-900/25 hover:bg-white hover:text-slate-950'
                  render={<Link to='/pricing' />}
                >
                  {t('View Pricing')}
                </Button>
                {renderDocsButton()}
              </>
            )}
          </div>

          <div
            className='landing-animate-fade-up mt-10 w-full opacity-0'
            style={{ animationDelay: '240ms' }}
          >
            <div className='mb-4 flex flex-col gap-1'>
              <span className='text-[10px] font-bold tracking-[0.15em] text-slate-700 uppercase'>
                {t('Supported Applications')}
              </span>
              <p className='text-xs leading-relaxed text-slate-600'>
                {t(
                  'Supports one-click configuration and perfectly adapts to NewAPI multi-protocol configuration.'
                )}
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <a
                href='https://cherry-ai.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 rounded-lg border border-slate-900/15 bg-white/70 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:border-slate-900/25 hover:bg-white hover:text-slate-950'
              >
                <CherryStudio.Color size={24} className='shrink-0' />
                <span>Cherry Studio</span>
              </a>

              <div className='flex cursor-default items-center gap-2 rounded-lg border border-slate-900/15 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700'>
                <Ellipsis className='size-5' aria-hidden='true' />
                <span>{t('More Apps')}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className='landing-animate-fade-up w-full opacity-0'
          style={{ animationDelay: '320ms' }}
        >
          <aside className='w-full rounded-lg border border-white/50 bg-white p-6 text-slate-950 shadow-xl md:p-8'>
            <div className='mb-6 border-b border-slate-200 pb-5'>
              <h2 className='text-xl font-bold'>{t('Secure & Reliable')}</h2>
              <p className='mt-3 text-sm leading-relaxed text-slate-600'>
                {t(
                  'Enterprise-grade security with comprehensive permission management'
                )}
              </p>
            </div>
            <ul className='space-y-5'>
              {HOME_TRUST_ITEMS.map((item) => {
                const Icon = item.icon

                return (
                  <li key={item.id} className='flex items-start gap-3'>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${item.accentClassName}`}
                    >
                      <Icon className='size-4' aria-hidden='true' />
                    </span>
                    <div className='min-w-0'>
                      <h3 className='text-sm font-semibold text-slate-950'>
                        {t(item.titleKey)}
                      </h3>
                      <p className='mt-1 text-xs leading-relaxed text-slate-600'>
                        {t(item.descriptionKey)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
