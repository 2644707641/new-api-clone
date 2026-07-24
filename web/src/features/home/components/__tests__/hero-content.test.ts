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

describe('hero content', () => {
  test('keeps the hero message while removing actions and app support', () => {
    const source = readFileSync(
      new URL('../sections/hero.tsx', import.meta.url),
      'utf8'
    )

    assert.match(source, /<h1[^>]*>\s*\{systemName\}\s*<\/h1>/)
    assert.match(source, /<FeaturePanel\s*\/>/)
    assert.match(source, /Powerful API Management Platform/)
    assert.doesNotMatch(source, /<DocsButton\b/)
    assert.doesNotMatch(source, /<SupportedApps\s*\/>/)
  })

  test('groups and emphasizes the hero title', () => {
    const source = readFileSync(
      new URL('../sections/hero.tsx', import.meta.url),
      'utf8'
    )

    assert.match(
      source,
      /<div className='flex -translate-y-2 flex-col gap-4 sm:-translate-y-3'>/
    )
    assert.match(
      source,
      /<h1 className='text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl'>/
    )
  })
})
