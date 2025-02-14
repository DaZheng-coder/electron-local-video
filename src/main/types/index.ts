import { BrowserWindowConstructorOptions } from 'electron'

export interface BaseWindowOptions extends BrowserWindowConstructorOptions {
  name: string
}

export interface BaseWindowLoadOptions {
  query?: Record<string, unknown>
  show?: boolean
  browserWindowOptions?: BrowserWindowConstructorOptions
}
