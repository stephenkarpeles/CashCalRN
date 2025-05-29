import { createTamagui } from '@tamagui/core'
import { createInterFont } from '@tamagui/font-inter'
// Use require to import themes
const themes = require('@tamagui/theme-base')

const interFont = createInterFont()

const config = createTamagui({
  theme: themes,
  fonts: {
    heading: interFont,
    body: interFont,
  },
  shorthands: {
    p: 'padding',
    m: 'margin',
  },
})

export type AppConfig = typeof config
export default config 