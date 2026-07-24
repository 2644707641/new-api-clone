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
import { describe, test } from 'node:test'

import { homeHeroLayoutClasses } from '../layout'

describe('home hero layout', () => {
  test('uses a Grainient gradient background instead of the old solid hero surface', () => {
    assert.ok(
      !homeHeroLayoutClasses.section.split(' ').includes('bg-home-hero')
    )
    assert.doesNotMatch(
      homeHeroLayoutClasses.section,
      /radial-gradient|linear-gradient/
    )
  })

  test('stacks content on small screens and becomes two columns on desktop', () => {
    const columnClasses = homeHeroLayoutClasses.columns.split(' ')

    assert.ok(columnClasses.includes('grid-cols-1'))
    assert.ok(columnClasses.includes('lg:grid-cols-2'))
  })
})
