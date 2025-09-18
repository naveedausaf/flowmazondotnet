const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'error-backend-url-not-specified';

const config = {
  serviceUrls: {
    base: baseUrl,
    product: `${baseUrl}/product`,
  },
  breakpoints: {},
} as const;

export default config;
