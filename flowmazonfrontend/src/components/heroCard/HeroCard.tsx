import Link from 'next/link';
import Image from 'next/image';
// // import PriceTag from '../priceTag/PriceTag';
// import { Product } from '@/models/product';
import { ProductCardProps } from '../productCard/ProductCard';
import {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
  useId,
} from 'react';

// Implementation of 'as' props pattern (aka Polymorphic component pattern) from:
// https://www.christianvm.dev/blog/react-as-prop
type HeroCardProps<T extends ElementType = 'section'> = PropsWithChildren<
  ComponentPropsWithoutRef<T>
> & {
  as?: T;
  ariaLabel?: string;
} & ProductCardProps;

export default function HeroCard<T extends ElementType = 'section'>({
  product,
  className,
  sizes = '100vw',
  as,
  ariaLabel = 'Featured Product',
  ...props
}: HeroCardProps<T>) {
  const OuterTag = as ?? 'section';
  const productDescriptionId = useId();
  return (
    <OuterTag
      {...props}
      ariaLabel={ariaLabel}
      className={`hero bg-base-200 rounded-xl ${className ?? ''}`}
    >
      <div className='hero-content flex-col lg:flex-row'>
        <Image
          src='https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' //{product.imageUrl}
          alt='' //see ProductCard for explanation why empty string
          width={product.imageWidth}
          height={product.imageHeight}
          className='max-w-sm rounded-lg shadow-2xl'
          placeholder='blur'
          blurDataURL={product.imagePlaceholderDataUrl}
          sizes={sizes}
          priority
        />
        <div>
          <h1 className='text-5xl font-bold'>{product.name}</h1>
          <p className='py-6' id={productDescriptionId}>
            {product.description}
          </p>
          {/* TODO: Take out the computation of this link into a separate module. It is repeated in ProductCard also. Do a search for this to see if it also appears elsewhere before remove it. */}
          <Link
            href={`/products/${product.id}`}
            className='btn btn-primary'
            aria-describedby='{productDescriptionId}'
            aria-label={`${product.name}, Check it out`}
          >
            Check it out
          </Link>
        </div>
      </div>
    </OuterTag>
  );
}

//TODO: Breaks at iphone SE viewport. Need to fix
