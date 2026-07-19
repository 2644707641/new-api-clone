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

import { AnimateInView } from '@/components/animate-in-view'

import { HOME_SERVICE_CARDS } from '../../home-layout'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 px-6 py-16 md:py-24'>
      <div className='mx-auto max-w-7xl'>
        <AnimateInView
          once={false}
          className='mx-auto mb-10 max-w-xl text-center md:mb-14'
        >
          <p className='text-muted-foreground mb-3 text-xs font-medium uppercase'>
            {t('Core Features')}
          </p>
          <h2 className='text-3xl leading-tight font-bold md:text-4xl'>
            {t('Built for developers,')}
            <br />
            {t('designed for scale')}
          </h2>
        </AnimateInView>

        <div className='grid gap-4 md:grid-cols-3 md:gap-6'>
          {HOME_SERVICE_CARDS.map((card, index) => {
            const Icon = card.icon

            return (
              <AnimateInView
                key={card.id}
                once={false}
                delay={index * 100}
                animation='fade-up'
                className='border-border/70 bg-background hover:border-border rounded-lg border p-6 transition-colors md:p-7'
              >
                <div
                  className={`mb-6 flex size-11 items-center justify-center rounded-lg ${card.accentClassName}`}
                >
                  <Icon className='size-5' aria-hidden='true' />
                </div>
                <h3 className='text-base font-semibold'>{t(card.titleKey)}</h3>
                <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
                  {t(card.descriptionKey)}
                </p>
              </AnimateInView>
            )
          })}
        </div>
      </div>
    </section>
  )
}
