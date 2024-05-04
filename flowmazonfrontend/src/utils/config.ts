const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

export const config = {
  serviceUrls: {
    base: `${baseUrl}`,
    product: `${baseUrl}/product`,
  },
};
