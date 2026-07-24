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

import { HOME_GRAINIENT_CONFIG } from '../background-config'

describe('home background', () => {
  test('applies the configured pink, purple, and lavender Grainient preset', () => {
    assert.deepEqual(HOME_GRAINIENT_CONFIG, {
      color1: '#FF9FFC',
      color2: '#5227FF',
      color3: '#B497CF',
      timeSpeed: 1.95,
      colorBalance: 0,
      warpStrength: 1,
      warpFrequency: 5,
      warpSpeed: 2,
      warpAmplitude: 50,
      blendAngle: 0,
      blendSoftness: 0.05,
      rotationAmount: 500,
      noiseScale: 2,
      grainAmount: 0.1,
      grainScale: 2,
      grainAnimated: false,
      contrast: 1.5,
      gamma: 1,
      saturation: 1,
      centerX: 0,
      centerY: 0,
      zoom: 0.9,
    })
  })
})
