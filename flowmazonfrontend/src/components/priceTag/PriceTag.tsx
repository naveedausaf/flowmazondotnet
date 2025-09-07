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
      className={`badge ${className ?? ''}`}
    >
      {currencySymbol}
      {price}
    </span>
  );
}
