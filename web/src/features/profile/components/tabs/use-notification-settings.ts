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
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { ROLE } from '@/lib/roles'

import { updateUserSettings } from '../../api'
import {
  DEFAULT_QUOTA_WARNING_THRESHOLD,
  NOTIFICATION_METHODS,
} from '../../constants'
import { parseUserSettings } from '../../lib'
import type { UserProfile, UserSettings, NotifyType } from '../../types'

const NOTIFICATION_VALUES = new Set<NotifyType>(
  NOTIFICATION_METHODS.map((method) => method.value)
)

export function normalizeNotifyType(value: unknown): NotifyType {
  return typeof value === 'string' &&
    NOTIFICATION_VALUES.has(value as NotifyType)
    ? (value as NotifyType)
    : 'email'
}

export type UpdateNotificationField = <K extends keyof UserSettings>(
  field: K,
  value: UserSettings[K]
) => void

export function useNotificationSettings(
  profile: UserProfile | null,
  onUpdate: () => void
) {
  const { t } = useTranslation()
  const isAdmin = (profile?.role ?? 0) >= ROLE.ADMIN
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    notify_type: 'email',
    quota_warning_threshold: DEFAULT_QUOTA_WARNING_THRESHOLD,
    notification_email: '',
    webhook_url: '',
    webhook_secret: '',
    bark_url: '',
    gotify_url: '',
    gotify_token: '',
    gotify_priority: 5,
    accept_unset_model_ratio_model: false,
    record_ip_log: false,
    upstream_model_update_notify_enabled: false,
  })

  const updateField = useCallback(
    <K extends keyof UserSettings>(field: K, value: UserSettings[K]) => {
      setSettings((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  useEffect(() => {
    if (!profile?.setting) {
      return
    }

    const parsed = parseUserSettings(profile.setting)
    setSettings({
      notify_type: normalizeNotifyType(parsed.notify_type),
      quota_warning_threshold:
        parsed.quota_warning_threshold ?? DEFAULT_QUOTA_WARNING_THRESHOLD,
      notification_email: parsed.notification_email ?? '',
      webhook_url: parsed.webhook_url ?? '',
      webhook_secret: parsed.webhook_secret ?? '',
      bark_url: parsed.bark_url ?? '',
      gotify_url: parsed.gotify_url ?? '',
      gotify_token: parsed.gotify_token ?? '',
      gotify_priority: parsed.gotify_priority ?? 5,
      accept_unset_model_ratio_model:
        parsed.accept_unset_model_ratio_model || false,
      record_ip_log: parsed.record_ip_log || false,
      upstream_model_update_notify_enabled:
        parsed.upstream_model_update_notify_enabled || false,
    })
  }, [profile])

  const handleSave = useCallback(async () => {
    try {
      setLoading(true)
      const response = await updateUserSettings(settings)

      if (response.success) {
        toast.success(t('Settings updated successfully'))
        onUpdate()
      } else {
        toast.error(response.message || t('Failed to update settings'))
      }
    } catch {
      toast.error(t('Failed to update settings'))
    } finally {
      setLoading(false)
    }
  }, [onUpdate, settings, t])

  return { isAdmin, loading, settings, updateField, handleSave }
}
