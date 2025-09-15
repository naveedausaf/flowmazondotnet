/* import Link from 'next/link'; */
import Image from 'next/image';
// // import PriceTag from '../priceTag/PriceTag';
// import { Product } from '@/models/product';
import { ProductCardProps } from '../productCard/ProductCard';
import {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
  /* ReactNode, */
} from 'react';

type HeroCardProps<T extends ElementType = 'section'> = PropsWithChildren<
  ComponentPropsWithoutRef<T>
> & {
  as?: T;
} & ProductCardProps;

export default function HeroCard<T extends ElementType = 'section'>({
  product,
  className,
  as,
  ...props
}: HeroCardProps<T>) {
  const OuterTag = as ?? 'section';
  return (
    <OuterTag
      {...props}
      className={`hero bg-base-200 rounded-xl ${className ?? ''}`}
    >
      <div className='hero-content flex-col lg:flex-row'>
        <Image
          src={product.imageUrl}
          alt='' //see ProductCard for explanation why empty string
          width={product.imageWidth}
          height={320}
          className='max-w-sm rounded-lg shadow-2xl'
        />
        <div>
          <h1 className='text-5xl font-bold'>Box Office News!</h1>
          <p className='py-6'>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button className='btn btn-primary'>Get Started</button>
        </div>
      </div>
    </OuterTag>
  );
}
