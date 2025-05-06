import { within } from '@storybook/test';
import { ByRoleOptions } from '@testing-library/dom';

export type TextboxGet = (options?: Omit<ByRoleOptions, 'name'>) => HTMLElement;

export type TextboxQuery = (
  options?: Omit<ByRoleOptions, 'name'>,
) => HTMLElement | null;

export type TextboxQueries = {
  get: TextboxGet;
  query: TextboxQuery;
};

export type AddProductPagePOM = {
  getAddProductForm: () => {
    tlFormContainer: ReturnType<typeof within>;
    formElement: HTMLElement;
    name: TextboxQueries;
    description: TextboxQueries;
    imageUrl: TextboxQueries;
    price: TextboxQueries;
    getSubmitButton: () => Promise<HTMLElement>;
  };
};

const createAddProductPagePOM = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const formElement = canvas.getByRole('form', {
    name: accessibleNames.FormName,
  });

  const tlFormContainer = within(formElement);
  const createTextboxQueries = (
    accessibleName: string,
  ): {
    get: TextboxGet;
    query: TextboxQuery;
  } => ({
    get: (options?: Omit<ByRoleOptions, 'name'>) => {
      return tlFormContainer.getByRole('textbox', {
        name: new RegExp(`^${accessibleName}`),
        ...options,
      });
    },
    query: (options?: Omit<ByRoleOptions, 'name'>) => {
      return tlFormContainer.queryByRole('textbox', {
        name: new RegExp(`^${accessibleName}`),
        ...options,
      });
    },
  });

  return {
    getAddProductForm: () => {
      return {
        tlFormContainer,
        formElement,
        name: createTextboxQueries(accessibleNames.Name),
        description: createTextboxQueries(accessibleNames.Description),
        imageUrl: createTextboxQueries(accessibleNames.ImageUrl),
        price: createTextboxQueries(accessibleNames.Price),
        getSubmitButton: () => {
          return tlFormContainer.getByRole('button', {
            name: new RegExp(`^${accessibleNames.SubmitButton}`),
          });
        },
      };
    },
  };
};
export default createAddProductPagePOM;

export const accessibleNames = Object.freeze({
  FormName: 'add product form',
  Name: 'Name',
  Description: 'Description',
  ImageUrl: 'Image URL',
  Price: 'Price',
  SubmitButton: 'Add Product',
});
