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
import { Link2, Settings, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TitledCard } from '@/components/ui/titled-card'

import type { UserProfile } from '../types'
import { AccountBindingsTab } from './tabs/account-bindings-tab'
import {
  NotificationPreferencesSection,
  NotificationSettingsSection,
} from './tabs/notification-tab'
import { useNotificationSettings } from './tabs/use-notification-settings'

// ============================================================================
// Profile Settings Card Component
// ============================================================================

interface ProfileSettingsCardProps {
  profile: UserProfile | null
  loading: boolean
  onProfileUpdate: () => void
}

export function ProfileSettingsCard({
  profile,
  loading,
  onProfileUpdate,
}: ProfileSettingsCardProps) {
  const { t } = useTranslation()
  const notificationSettings = useNotificationSettings(profile, onProfileUpdate)

  if (loading) {
    return (
      <Card data-card-hover='false' className='gap-0 overflow-hidden py-0'>
        <CardHeader className='border-b p-3 !pb-3 sm:p-5 sm:!pb-5'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='mt-2 h-4 w-48' />
        </CardHeader>
        <CardContent className='p-3 sm:p-5'>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            {[
              {
                key: 'bindings',
                className: 'lg:col-start-1 lg:row-start-1',
              },
              {
                key: 'preferences',
                className: 'lg:col-start-1 lg:row-start-2',
              },
              {
                key: 'other-settings',
                className: 'lg:col-start-2 lg:row-start-1 lg:row-span-2',
              },
            ].map(({ key, className }) => (
              <div
                key={key}
                className={`space-y-3 rounded-xl border p-3 sm:p-5 ${className}`}
              >
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-16 w-full' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <TitledCard
      title={t('Settings')}
      description={t('Configure your account preferences and integrations')}
      icon={<Settings className='h-4 w-4' />}
      iconTone='info'
      disableHoverEffect
    >
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <section
          aria-labelledby='profile-account-bindings-title'
          className='space-y-4 rounded-xl border p-3 sm:p-5 lg:col-start-1 lg:row-start-1'
        >
          <div className='flex items-center gap-2'>
            <Link2
              className='text-muted-foreground h-4 w-4'
              aria-hidden='true'
            />
            <h3
              id='profile-account-bindings-title'
              className='text-sm font-semibold'
            >
              {t('Account Bindings')}
            </h3>
          </div>
          <AccountBindingsTab profile={profile} onUpdate={onProfileUpdate} />
        </section>

        <section
          aria-labelledby='profile-preferences-title'
          className='space-y-4 rounded-xl border p-3 sm:p-5 lg:col-start-1 lg:row-start-2'
        >
          <div className='flex items-center gap-2'>
            <SlidersHorizontal
              className='text-muted-foreground h-4 w-4'
              aria-hidden='true'
            />
            <h3
              id='profile-preferences-title'
              className='text-sm font-semibold'
            >
              {t('Preferences')}
            </h3>
          </div>
          <p className='text-muted-foreground -mt-2 text-xs'>
            {t('Configure your account behavior preferences')}
          </p>
          <NotificationPreferencesSection
            settings={notificationSettings.settings}
            updateField={notificationSettings.updateField}
            isAdmin={notificationSettings.isAdmin}
            loading={notificationSettings.loading}
            onSave={notificationSettings.handleSave}
          />
        </section>

        <section
          aria-labelledby='profile-other-settings-title'
          className='space-y-4 rounded-xl border p-3 sm:p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1'
        >
          <div className='flex items-center gap-2'>
            <Settings
              className='text-muted-foreground h-4 w-4'
              aria-hidden='true'
            />
            <h3
              id='profile-other-settings-title'
              className='text-sm font-semibold'
            >
              {t('Other Settings')}
            </h3>
          </div>
          <NotificationSettingsSection
            settings={notificationSettings.settings}
            updateField={notificationSettings.updateField}
          />
        </section>
      </div>
    </TitledCard>
  )
}
