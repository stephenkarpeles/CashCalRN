import { createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { themes } from '@tamagui/themes'
import { tokens } from '@tamagui/themes'

const interFont = createInterFont()

const config = createTamagui({
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  themes,
  tokens,
  fonts: {
    heading: interFont,
    body: interFont,
  },
  shorthands: {
    p: 'padding',
    m: 'margin',
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

export type AppConfig = typeof config
export default config 