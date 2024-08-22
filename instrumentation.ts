import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,  // Corrected the property name here
    // Add other configuration options here
  });

  // Add any other initialization code here
}