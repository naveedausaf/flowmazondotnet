const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseUrl) {
  console.log(
    'NEXT_PUBLIC_BACKEND_URL is not defined. This could be because the app is being run using next dev as opposed to next build and this is this is the bundling phase and not run time. If this is not the case, then set it in your environment variables.',
  );
}
export const config = {
  serviceUrls: {
    base: baseUrl,
    product: `${baseUrl}/product`,
  },
};
