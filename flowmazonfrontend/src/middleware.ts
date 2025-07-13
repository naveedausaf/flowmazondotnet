import { NextRequest, NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

// because we may use 'request' in this function in the future:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const current = trace.getActiveSpan();

  // set server-timing header with traceparent
  if (current) {
    response.headers.set(
      'server-timing',
      `traceparent;desc="00-${current.spanContext().traceId}-${current.spanContext().spanId}-01"`,
    );
  }
  return response;
}
