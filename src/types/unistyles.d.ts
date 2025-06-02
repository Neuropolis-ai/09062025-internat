import type { AppTheme } from '../styles/unistyles'

type UnistylesBreakpoints = {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme
  }
  export interface UnistylesBreakpoints extends UnistylesBreakpoints {}
} 