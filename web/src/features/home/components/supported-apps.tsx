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
import { Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getLobeIcon } from '@/lib/lobe-icon'

const supportedApps = [
  {
    name: 'Cherry Studio',
    href: 'https://cherry-ai.com',
    iconName: 'CherryStudio',
  },
  { name: 'LobeHub', href: 'https://lobehub.com', iconName: 'LobeHub.Color' },
  { name: 'Dify', href: 'https://dify.ai', iconName: 'Dify.Color' },
  {
    name: 'Open WebUI',
    href: 'https://openwebui.com',
    iconName: 'OpenWebUI',
  },
  { name: 'Cline', href: 'https://cline.bot', iconName: 'Cline' },
] as const

export function SupportedApps() {
  const { t } = useTranslation()

  return (
    <div className='mt-10 w-full max-w-xl'>
      <p className='text-muted-foreground text-xs font-semibold uppercase'>
        {t('Supported Applications')}
      </p>
      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
        {t(
          'Supports one-click configuration and perfectly adapts to NewAPI multi-protocol configuration.'
        )}
      </p>
      <div className='mt-4 flex flex-wrap items-center gap-2.5'>
        {supportedApps.map((app) => (
          <a
            key={app.name}
            href={app.href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={app.name}
            title={app.name}
            className='bg-background/85 border-border/70 hover:border-primary/40 hover:bg-background flex size-12 items-center justify-center rounded-lg border shadow-sm transition-colors'
          >
            {app.iconName === 'CherryStudio' ? (
              <CherryStudio.Color size={24} aria-hidden='true' />
            ) : (
              getLobeIcon(app.iconName, 24)
            )}
          </a>
        ))}
        <div
          title={t('More Apps')}
          aria-label={t('More Apps')}
          className='bg-background/70 border-border/70 text-muted-foreground flex size-12 items-center justify-center rounded-lg border'
        >
          <Ellipsis aria-hidden='true' className='size-5' />
        </div>
      </div>
    </div>
  )
}
