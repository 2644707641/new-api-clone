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
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, test } from 'node:test'

const profilePageSource = readFileSync(
  new URL('../index.tsx', import.meta.url),
  'utf8'
)
const profileSettingsCardSource = readFileSync(
  new URL('../components/profile-settings-card.tsx', import.meta.url),
  'utf8'
)
const notificationSettingsHookSource = readFileSync(
  new URL('../components/tabs/use-notification-settings.ts', import.meta.url),
  'utf8'
)
const notificationMethodLabels = {
  en: { Webhook: 'Webhook', Bark: 'Bark', Gotify: 'Gotify' },
  zh: { Webhook: '网络回调', Bark: 'Bark 推送', Gotify: 'Gotify 推送' },
  'zh-TW': {
    Webhook: '網路回呼',
    Bark: 'Bark 推送',
    Gotify: 'Gotify 推送',
  },
  fr: { Webhook: 'Webhook', Bark: 'Bark', Gotify: 'Gotify' },
  ja: { Webhook: 'Webhook', Bark: 'Bark', Gotify: 'Gotify' },
  ru: { Webhook: 'Вебхук', Bark: 'Bark', Gotify: 'Gotify' },
  vi: { Webhook: 'Webhook', Bark: 'Bark', Gotify: 'Gotify' },
}

describe('profile page panels', () => {
  test('renders only personal information and settings panels', () => {
    assert.match(profilePageSource, /<ProfileHeader\b/)
    assert.match(profilePageSource, /<ProfileSettingsCard\b/)

    for (const panel of [
      'LanguagePreferencesCard',
      'ProfileSecurityCard',
      'LoginSessionsCard',
      'CheckinCalendarCard',
      'SidebarModulesCard',
      'PasskeyCard',
      'TwoFACard',
    ]) {
      assert.doesNotMatch(profilePageSource, new RegExp(`<${panel}\\b`))
    }
  })

  test('places account bindings, preferences, and other settings in a responsive grid', () => {
    assert.match(
      profileSettingsCardSource,
      /grid grid-cols-1 gap-4 lg:grid-cols-2/
    )
    assert.match(profileSettingsCardSource, /<AccountBindingsTab\b/)
    assert.match(profileSettingsCardSource, /<NotificationPreferencesSection\b/)
    assert.match(profileSettingsCardSource, /<NotificationSettingsSection\b/)
    assert.match(profileSettingsCardSource, /lg:col-start-1 lg:row-start-1/)
    assert.match(profileSettingsCardSource, /lg:col-start-1 lg:row-start-2/)
    assert.match(
      profileSettingsCardSource,
      /lg:col-start-2 lg:row-start-1 lg:row-span-2/
    )
    assert.match(profileSettingsCardSource, /t\('Preferences'\)/)
    assert.match(profileSettingsCardSource, /t\('Other Settings'\)/)
    assert.doesNotMatch(
      profileSettingsCardSource,
      /\bTabs(?:Content|List|Trigger)?\b/
    )
    assert.doesNotMatch(profileSettingsCardSource, /Settings & Preferences/)
    assert.ok(
      profileSettingsCardSource.indexOf('<AccountBindingsTab') <
        profileSettingsCardSource.indexOf('<NotificationPreferencesSection')
    )
    assert.ok(
      profileSettingsCardSource.indexOf('<NotificationPreferencesSection') <
        profileSettingsCardSource.indexOf('<NotificationSettingsSection')
    )

    const otherSettingsSection = profileSettingsCardSource.slice(
      profileSettingsCardSource.indexOf(
        "aria-labelledby='profile-other-settings-title'"
      ),
      profileSettingsCardSource.indexOf('<NotificationSettingsSection')
    )
    assert.match(otherSettingsSection, /lg:col-start-2/)
    assert.match(otherSettingsSection, /lg:row-start-1/)
    assert.match(otherSettingsSection, /lg:row-span-2/)
  })

  test('shares one notification settings state across both sections', () => {
    assert.match(
      profileSettingsCardSource,
      /const notificationSettings = useNotificationSettings\(/
    )
    assert.match(
      profileSettingsCardSource,
      /<NotificationPreferencesSection[\s\S]*settings=\{notificationSettings\.settings\}/
    )
    assert.match(
      profileSettingsCardSource,
      /<NotificationSettingsSection[\s\S]*settings=\{notificationSettings\.settings\}/
    )
    assert.match(
      notificationSettingsHookSource,
      /export function useNotificationSettings\(/
    )
    assert.match(
      notificationSettingsHookSource,
      /updateUserSettings\(settings\)/
    )
  })

  test('provides translations for notification method labels in every locale', () => {
    for (const [locale, labels] of Object.entries(notificationMethodLabels)) {
      const { translation } = JSON.parse(
        readFileSync(
          new URL(`../../../i18n/locales/${locale}.json`, import.meta.url),
          'utf8'
        )
      )

      for (const [label, expected] of Object.entries(labels)) {
        assert.equal(translation[label], expected)
      }
    }
  })
})
