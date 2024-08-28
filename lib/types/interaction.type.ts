export type AdEvent = {
  id?: string
  country: string
  referer: string
  adParcelId?: number
  acceptLanguage: string
  ip: string
  userAgent: string
  timestamp?: {
    _seconds: number
    _nanoseconds: number
  }
}
