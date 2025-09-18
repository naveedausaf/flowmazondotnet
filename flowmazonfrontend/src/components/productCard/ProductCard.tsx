import Link from 'next/link';
import Image from 'next/image';
import PriceTag from '../priceTag/PriceTag';
import { Product } from '@/models/product';

export interface ProductCardProps {
  product: Product;
  className?: string;
  sizes?: string; //sizes attribute for the Image component
}

export default function ProductCard({
  product,
  className,
  sizes = '100vw',
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={`card bg-base-100 transition-shadow hover:shadow-xl ${className || ''}`}
    >
      {/* daisyui requires we wrap the image in a figure tag 
       but we don't want it in the Accessibility Tree*/}
      <figure role='presentation'>
        {/* Setting empty alt on this Image as content of image is completely described by HTML content right next to the image on the card and function of the image is indicated by the heading (product name) right next to the image which is within the same Link that contains this image. 
        
        See example 3 in [WebAIM article "Alternative Text"](https://webaim.org/techniques/alttext/#functional).
        
        [W3C image alt text decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) gave the same conclusion.
        */}
        <Image
          src={product.imageUrl}
          alt=''
          width={product.imageWidth}
          height={product.imageHeight}
          className='h-48 object-cover'
          placeholder='blur'
          blurDataURL={product.imagePlaceholderDataUrl}
          sizes={sizes}
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{product.name}</h2>
        {product.isNew && <div className='badge badge-secondary'>NEW</div>}
        <p>{product.description}</p>
        <PriceTag
          price={product.price}
          currencySymbol={product.currencySymbol}
        />
      </div>
    </Link>
  );
}
