import Link from 'next/link';
import Image from 'next/image';
import PriceTag from '../priceTag/PriceTag';
import { Product } from '@/models/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className='card bg-base-1 00 transition-shadow hover:shadow-xl'
    >
      {/* daisyui requires we wrap the image in a figure tag 
       but we don't want it ni the Accessibility Tree*/}
      <figure role='presentation'>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={product.imageWidth}
          height={product.imageHeight}
          className='h-48 object-cover'
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
