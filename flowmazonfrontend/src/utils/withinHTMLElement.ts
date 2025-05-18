import { within } from '@storybook/test';

export default function withinHTMLElement(element: HTMLElement) {
  return within(element);
}
