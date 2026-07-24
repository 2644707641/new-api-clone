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

describe('footer brand', () => {
  test('keeps the footer name and tagline without rendering a logo', () => {
    const source = readFileSync(
      new URL('../footer.tsx', import.meta.url),
      'utf8'
    )
    const brandStart = source.indexOf('{/* Brand column */}')
    const brandEnd = source.indexOf('{/* Links columns */}', brandStart)
    const brandSource = source.slice(brandStart, brandEnd)

    assert.match(brandSource, /\{displayName\}/)
    assert.match(brandSource, /Powerful API Management Platform/)
    assert.doesNotMatch(brandSource, /<img\b/)
  })

  test('aligns the footer content with the wider homepage container', () => {
    const source = readFileSync(
      new URL('../footer.tsx', import.meta.url),
      'utf8'
    )

    assert.match(source, /mx-auto max-w-7xl px-5 py-12/)
  })

  test('centers CS ROUTER legal information without the New API attribution', () => {
    const source = readFileSync(
      new URL('../footer.tsx', import.meta.url),
      'utf8'
    )

    assert.doesNotMatch(source, /ProjectAttribution/)
    assert.match(source, /CS ROUTER/)
    assert.match(source, /footer\.defaultCopyright/)
    assert.match(source, /justify-center/)
    assert.match(source, /<SiteLegalInfo\s*\/>/)
    assert.match(source, /https:\/\/csrouter\.com/)
    assert.match(source, /粤ICP备2023121579号-2/)
  })
})
