export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  price: number;
  currencySymbol: string;
  isNew: boolean;
  createdAt: string;
  updatedAt?: string;
  imagePlaceholderDataUrl?: string; //for Low Quality Image Placeholder (LQIP) when loading images
}
