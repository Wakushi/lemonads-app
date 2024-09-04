export type Website = {
  id: string
  url: string
  name: string
  category: string
  keywords: string[]
  trafficAverage: string
  language: string
  geoReach: string
  ipfsHash?: string
  analyticsPropertyId?: string
  metrics?: Metrics
}

export type Metrics = {
  activeUsers: string
  averageSessionDuration: string
  bounceRate: string
  engagementRate: string
  screenPageViews: string
  sessions: string
  sessionsPerUser: string
}
