export interface MainStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (key: string) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (key: string, value: any, syncRenderStore?: boolean) => Promise<void>
  clear: () => Promise<void>
}
