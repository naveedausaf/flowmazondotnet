import { test, expect } from '@playwright/test';
import { accessibleNames } from '@/pageStories/add-product/index.pom';
import { ValidInputs } from '@/pageStories/add-product/testdata';
import { serverErrorTitle, serverErrorMessage } from '@/pages/add-product';

test('add a new product', async ({ page }) => {
  //TODO: This name needs to be a constant somewhere
  await page.goto('/add-product');

  //TODO: This title needs to be a constant somewhere
  //
  //TODO: Perhaps I need to recreate the structure
  //of my Srorybook POMs here and that is where such constants
  //would go
  await expect(page).toHaveTitle('Add Product - Flowmazon');

  await page
    .getByRole('textbox', { name: accessibleNames.Name })
    .fill(ValidInputs.name);
  await page
    .getByRole('textbox', { name: accessibleNames.Price })
    .fill(ValidInputs.price);
  await page
    .getByRole('textbox', { name: accessibleNames.ImageUrl })
    .fill(ValidInputs.imageUrl);
  await page
    .getByRole('textbox', { name: accessibleNames.Description })
    .fill(ValidInputs.description);

  await page
    .getByRole('button', {
      name: accessibleNames.SubmitButton,
    })
    .click();

  //TODO: Complete this test when funcitonality is implemented
  //a the moment, the there is not feedback for the product
  //being created. So we just check that error dialog is not shown
  const alertDialog = page.getByRole('alertdialog', {
    name: serverErrorTitle,
  });
  await expect(alertDialog).not.toBeVisible();
  //await expect(alertDialog).not.toHaveAccessibleDescription(serverErrorMessage);
});
