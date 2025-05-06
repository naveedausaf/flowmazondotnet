const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseUrl) {
  throw new Error(
    'NEXT_PUBLIC_BACKEND_URL is not defined. Please set it in your environment variables.',
  );
}
export const config = {
  serviceUrls: {
    base: baseUrl,
    product: `${baseUrl}/product`,
  },
};
