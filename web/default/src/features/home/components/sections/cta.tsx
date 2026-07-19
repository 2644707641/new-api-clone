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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

import { HOME_CTA_GRADIENT_CLASS } from '../../home-layout'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section
      className={`relative z-10 overflow-hidden px-6 py-16 text-slate-950 md:py-24 ${HOME_CTA_GRADIENT_CLASS}`}
    >
      <AnimateInView
        once={false}
        className='mx-auto max-w-2xl text-center'
        animation='scale-in'
      >
        <h2 className='text-3xl leading-tight font-bold md:text-4xl'>
          {t('Ready to simplify')}
          <br />
          <span>{t('your AI integration?')}</span>
        </h2>
        <p className='mx-auto mt-5 max-w-md text-sm leading-relaxed text-slate-700 md:text-base'>
          {t(
            'Deploy your own gateway and start routing requests through your configured upstream services.'
          )}
        </p>
        <div className='mt-8 flex items-center justify-center gap-3'>
          <Button
            className='group rounded-lg bg-slate-950 text-white hover:bg-slate-800 hover:text-white'
            render={<Link to='/sign-up' />}
          >
            {t('Get Started')}
            <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
          <Button
            variant='outline'
            className='rounded-lg border-slate-900/20 bg-white/50 text-slate-950 hover:border-slate-900/30 hover:bg-white/80 hover:text-slate-950'
            render={<Link to='/pricing' />}
          >
            {t('View Pricing')}
          </Button>
        </div>
      </AnimateInView>
    </section>
  )
}
