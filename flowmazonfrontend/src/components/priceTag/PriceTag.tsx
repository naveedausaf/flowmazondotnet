import { ComponentProps } from 'react';

type PriceTagProps = {
  price: number;
  currencySymbol: string;
  className?: string;
} & ComponentProps<'span'>;

export default function PriceTag({
  price,
  currencySymbol,
  className,
  ...otherProps
}: PriceTagProps) {
  return (
    <span
      {...otherProps}
      role='paragraph'
      className={`badge badge-outline !border-gray-200 ${className}`}
    >
      {currencySymbol}
      {price}
    </span>
  );
}
