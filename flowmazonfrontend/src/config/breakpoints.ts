/**
 * Breakpoints replicated from Tailwind config (whether default or customized in tailwind.config.js) for use in computing value of `sizes` prop of image tags.
 */
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

/**
 * Computes a value for an image tag's sizes attribute for the given breakpoints plus an optional default value.
 * @param sizesAtBreakpoints object with keys that are a subset of the keys of 'breakpoints' export from this file,and values that are the width of the image on screen at that breakpoint. For example { md: '33vw', lg: '25vw' }.
 * @param defaultSize value for width of the image if no breakpoints match. Default is '100vw'.
 * @returns A string suitable for use as the value of the sizes attribute of an image tag.
 * @example
 * computeSizesValue({ md: '33vw', lg: '25vw' }, '50vw)
 * returns '(min-width: 768px) 33vw, (min-width: 1024px) 25vw, 50vw'
 */
const computeSizesValue = (
  sizesAtBreakpoints: Partial<Record<keyof typeof breakpoints, string>>,
  defaultSize: string = '100vw',
) => {
  // Tailwind uses min-width media queries so we do the same here.
  const sizesExceptDefault = Object.entries(sizesAtBreakpoints).reduce(
    (acc, [breakpoint, size]) =>
      acc +
      `(min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}) ${size}, `,
    '',
  );

  return sizesExceptDefault + defaultSize;
};
//TODO: Write Jest tests for computeSizesValue function.

export { breakpoints, computeSizesValue };
