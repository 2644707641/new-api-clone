import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describe, test } from 'node:test'

import {
  HOME_CTA_GRADIENT_CLASS,
  HOME_HEADER_CLASS,
  HOME_HERO_BACKGROUND_STYLE,
  HOME_SERVICE_CARDS,
  HOME_STATS_BACKGROUND_STYLE,
  HOME_TRUST_ITEMS,
} from './home-layout'

describe('default home landing layout', () => {
  test('provides five concise trust signals for the hero side panel', () => {
    assert.equal(HOME_TRUST_ITEMS.length, 5)
    assert.equal(
      new Set(HOME_TRUST_ITEMS.map((item) => item.id)).size,
      HOME_TRUST_ITEMS.length
    )
  })

  test('groups the service system into three actions', () => {
    assert.equal(HOME_SERVICE_CARDS.length, 3)
    assert.equal(
      new Set(HOME_SERVICE_CARDS.map((card) => card.id)).size,
      HOME_SERVICE_CARDS.length
    )
  })

  test('keeps the CTA in the same low-saturation cyan-indigo-violet palette', () => {
    assert.match(HOME_CTA_GRADIENT_CLASS, /from-cyan-200/)
    assert.match(HOME_CTA_GRADIENT_CLASS, /via-indigo-200/)
    assert.match(HOME_CTA_GRADIENT_CLASS, /to-violet-300/)
  })

  test('layers cyan and purple diffusion behind the hero content', () => {
    assert.match(HOME_HERO_BACKGROUND_STYLE.backgroundImage, /radial-gradient/)
    assert.match(HOME_HERO_BACKGROUND_STYLE.backgroundImage, /at 72% 5%/)
    assert.match(HOME_HERO_BACKGROUND_STYLE.backgroundImage, /196 181 253/)
    assert.match(HOME_HERO_BACKGROUND_STYLE.backgroundImage, /linear-gradient/)
  })

  test('starts the stats area from the hero pastel base before fading to white', () => {
    assert.match(HOME_STATS_BACKGROUND_STYLE.backgroundImage, /radial-gradient/)
    assert.match(
      HOME_STATS_BACKGROUND_STYLE.backgroundImage,
      /rgb\(237 239 255\) 0%/
    )
    assert.match(HOME_STATS_BACKGROUND_STYLE.backgroundImage, /196 181 253/)
    assert.match(
      HOME_STATS_BACKGROUND_STYLE.backgroundImage,
      /linear-gradient\(120deg, rgb\(246 254 255\) 0%, rgb\(242 242 255\) 50%, rgb\(245 243 255\) 100%\)/
    )
  })

  test('applies only the reference background configuration in the hero component', async () => {
    const source = await readFile(
      new URL('./components/sections/hero.tsx', import.meta.url),
      'utf8'
    )

    assert.match(source, /HOME_HERO_BACKGROUND_STYLE/)
    assert.doesNotMatch(source, /HOME_HERO_LAYOUT_CLASS/)
    assert.doesNotMatch(source, /HOME_APP_BADGES/)
    assert.doesNotMatch(source, /lg:min-h-\[48rem\]/)
    assert.match(source, /border-transparent/)
  })

  test('keeps the top navigation visually separate from the hero gradient', () => {
    assert.match(HOME_HEADER_CLASS, /bg-background/)
    assert.match(HOME_HEADER_CLASS, /border-b/)
  })

  test('applies the stats diffusion without changing its content layout', async () => {
    const source = await readFile(
      new URL('./components/sections/stats.tsx', import.meta.url),
      'utf8'
    )

    assert.match(source, /HOME_STATS_BACKGROUND_STYLE/)
    assert.match(source, /grid-cols-2/)
    assert.match(source, /md:grid-cols-4/)
    assert.match(source, /border-transparent/)
  })

  test('uses dark foreground colors on the pastel CTA without changing its structure', async () => {
    const source = await readFile(
      new URL('./components/sections/cta.tsx', import.meta.url),
      'utf8'
    )

    assert.match(source, /overflow-hidden px-6 py-16 text-slate-950 md:py-24/)
    assert.match(source, /max-w-2xl text-center/)
  })

  test('replays homepage entrance animations whenever sections re-enter the viewport', async () => {
    const [cta, features, howItWorks] = await Promise.all([
      readFile(
        new URL('./components/sections/cta.tsx', import.meta.url),
        'utf8'
      ),
      readFile(
        new URL('./components/sections/features.tsx', import.meta.url),
        'utf8'
      ),
      readFile(
        new URL('./components/sections/how-it-works.tsx', import.meta.url),
        'utf8'
      ),
    ])

    for (const source of [cta, features, howItWorks]) {
      assert.match(source, /<AnimateInView[\s\S]*?once=\{false\}/)
    }
  })

  test('uses 中航科技 as the homepage header brand without changing the global system name', async () => {
    const [homeSource, layoutSource] = await Promise.all([
      readFile(new URL('./index.tsx', import.meta.url), 'utf8'),
      readFile(new URL('./home-layout.ts', import.meta.url), 'utf8'),
    ])

    assert.match(layoutSource, /export const HOME_SITE_NAME = '中航科技'/)
    assert.match(homeSource, /siteName: HOME_SITE_NAME/)
  })
})
