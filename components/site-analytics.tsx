"use client"

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { redactAnalyticsUrl } from '@/lib/analytics-privacy';

export function SiteAnalytics() {
  return <>
    <Analytics beforeSend={redactAnalyticsUrl} />
    <SpeedInsights beforeSend={redactAnalyticsUrl} />
  </>;
}
