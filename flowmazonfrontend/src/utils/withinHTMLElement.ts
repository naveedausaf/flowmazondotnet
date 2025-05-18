import { within } from '@storybook/test';

/**
 * The only puspose of this is to as a hint to TypsScript:
 * When I say ReturnType<typeof withinHTMLElement>, it is
 * somehow understood more often as the type of a variable
 * (usually of an argument to a function which is how I
 * usually use the phrase) than if I said
 * ReturnType<typeof within> which is sometimes deduced
 * to 'any'.
 * @param element The HTMLElement on which within from
 * @storybook/test will be called.
 * @returns
 */
export default function withinHTMLElement(element: HTMLElement) {
  return within(element);
}
