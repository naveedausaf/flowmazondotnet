import { registerOTel } from '@vercel/otel';
import otelConfig from './config/otelconfig';

// GOT THE FOLLOWING BLOCK FROM
// https://github.com/grafana/faro-nextjs-example/tree/main
// BUT NOT SURE I NEED IT:

// import { Context } from '@opentelemetry/api';
// import {
//   ReadableSpan,
//   Span,
//   SpanProcessor,
// } from '@opentelemetry/sdk-trace-node';

// /**
//  * Span processor to reduce cardinality of span names.
//  *
//  * Customize with care!
//  */
// class SpanNameProcessor implements SpanProcessor {
//   forceFlush(): Promise<void> {
//     return Promise.resolve();
//   }

//   // because we may use parentContext in this function in the future:
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   onStart(span: Span, parentContext: Context): void {
//     if (span.name.startsWith('GET /_next/static')) {
//       span.updateName('GET /_next/static');
//     } else if (span.name.startsWith('GET /_next/data')) {
//       span.updateName('GET /_next/data');
//     } else if (span.name.startsWith('GET /_next/image')) {
//       span.updateName('GET /_next/image');
//     }
//   }
//   // because we may use span in this function in the future:
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   onEnd(span: ReadableSpan): void {}
//   shutdown(): Promise<void> {
//     return Promise.resolve();
//   }
// }

export function register() {
  registerOTel({
    serviceName: otelConfig.resource.serviceSideServiceName.value,
    attributes: {
      [otelConfig.resource.namespace.semanticConvention]:
        otelConfig.resource.namespace.value,
      [otelConfig.resource.version.semanticConvention]:
        otelConfig.resource.version.value,
      [otelConfig.resource.environment.semanticConvention]:
        otelConfig.resource.environment.value,
    },
    /* spanProcessors: ['auto', new SpanNameProcessor()], */
  });
}
