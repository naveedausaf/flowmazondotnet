import { within } from 'storybook/test';
import { ByRoleOptions } from '@testing-library/dom';

/**
 * The only purpose of this is to as a hint to TypsScript:
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function withinHTMLElement(element: HTMLElement) {
  return within(element);
}

/** This is the TypeScript type of the Testing Library adapter for an `HTMLElement`, i.e. type of the object returned by calling `within(element)` on `element` of type `HTMLElement`*/
export type WithinHTMLElement = ReturnType<typeof withinHTMLElement>;

export type ByRoleOptionsForPOM = Omit<ByRoleOptions, 'name'>;
