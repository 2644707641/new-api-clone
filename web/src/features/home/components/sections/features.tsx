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
import {
  ArrowRight,
  Boxes,
  Code2,
  ReceiptText,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'

interface ServiceCardProps {
  icon: LucideIcon
  iconClassName: string
  title: string
  description: string
  actionLabel: string
  href: string
}

function ServiceCard(props: ServiceCardProps) {
  const Icon = props.icon
  const action = (
    <>
      {props.actionLabel}
      <ArrowRight aria-hidden='true' className='size-3.5' />
    </>
  )

  return (
    <article className='bg-card border-border/60 flex min-h-64 flex-col rounded-lg border p-6 shadow-sm sm:p-7'>
      <div
        className={`mb-5 flex size-11 items-center justify-center rounded-lg ${props.iconClassName}`}
      >
        <Icon aria-hidden='true' className='size-5' />
      </div>
      <h3 className='text-lg font-semibold'>{props.title}</h3>
      <p className='text-muted-foreground mt-2 text-sm leading-6'>
        {props.description}
      </p>
      <div className='mt-auto pt-6'>
        {props.href.startsWith('http') ? (
          <Button
            variant='outline'
            size='sm'
            render={
              <a href={props.href} target='_blank' rel='noopener noreferrer' />
            }
          >
            {action}
          </Button>
        ) : (
          <Button variant='outline' size='sm' render={<Link to={props.href} />}>
            {action}
          </Button>
        )}
      </div>
    </article>
  )
}

export function Features() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'
  const services: ServiceCardProps[] = [
    {
      icon: Code2,
      iconClassName: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
      title: t('Developer Friendly'),
      description: t(
        'Compatible API routes for common AI application workflows'
      ),
      actionLabel: t('Docs'),
      href: docsUrl,
    },
    {
      icon: ReceiptText,
      iconClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
      title: t('Transparent Billing'),
      description: t('Pay-as-you-go with real-time usage monitoring'),
      actionLabel: t('View Pricing'),
      href: '/pricing',
    },
    {
      icon: Boxes,
      iconClassName: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
      title: t('Vast Range of AI Models'),
      description: t(
        'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
      ),
      actionLabel: t('All Models'),
      href: '/pricing',
    },
  ]

  return (
    <section className='border-border/50 border-t px-5 py-20 sm:px-6 sm:py-24'>
      <div className='mx-auto max-w-7xl'>
        <AnimateInView className='mx-auto max-w-2xl text-center'>
          <p className='text-primary text-sm font-semibold'>
            {t('Powerful API Management Platform')}
          </p>
          <h2 className='mt-3 text-3xl font-bold sm:text-4xl'>
            {t('Core Features')}
          </h2>
          <p className='text-muted-foreground mt-4 text-base leading-7'>
            {t('Built for developers,')} {t('designed for scale')}
          </p>
        </AnimateInView>

        <div className='mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3'>
          {services.map((service, index) => (
            <AnimateInView
              key={service.title}
              delay={index * 100}
              animation='fade-up'
            >
              <ServiceCard {...service} />
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
