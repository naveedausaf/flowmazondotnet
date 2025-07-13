import packageJson from '../../package.json';

// See this page for details on semantic conventions for Resource:
// https://opentelemetry.io/docs/specs/semconv/resource/
const resourceConventions = {
  serviceName: 'service.name',
  namespace: 'service.namespace',
  version: 'service.version',
  environment: 'deployment.environment.name',
};

const resourceConfig = {
  clientSideServiceName: {
    semanticConvention: resourceConventions.serviceName,
    value:
      process.env.NEXT_PUBLIC_FARO_SERVICE_NAME ??
      'error-client-service-name-not-specified',
  },
  serviceSideServiceName: {
    semanticConvention: resourceConventions.serviceName,
    value: 'flowmazonfrontend-server',
  },
  namespace: {
    semanticConvention: resourceConventions.namespace,
    value: 'flowmazon',
  },
  version: {
    semanticConvention: resourceConventions.version,
    value: packageJson.version,
  },
  environment: {
    semanticConvention: resourceConventions.environment,
    value:
      process.env.NEXT_PUBLIC_OTEL_ENVIRONMENT ??
      'error-otel-environment-not-specified',
  },
} as const;

const otelConfig = {
  resource: resourceConfig,
  faroUrl: process.env.NEXT_PUBLIC_FARO_URL,
} as const;

export default otelConfig;
