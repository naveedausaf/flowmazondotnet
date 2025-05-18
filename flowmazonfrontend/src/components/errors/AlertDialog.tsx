import { ReactEventHandler, useEffect, useId } from 'react';

/**
 * AlertDialog is a component that displays an modal dialog with
 * an accessible name and accessible description and a single
 * Close button to dismiss the dialog.
 * @returns
 */
export default function AlertDialog({
  title,
  description,
  open,
  elementIdToFocusAfterDialogClosed,
  onClose,
}: {
  /**
   * Title of the alert dialog. This will be the dialog's accessible name
   */
  title: string;

  /**
   *Description shown on the alert dialog. This will be the dialog's accessible description.
   */
  description: string;
  /**
   * This is a boolean that indicates whether the alert dialog is open or closed.
   */
  open: boolean;
  /**
   * This is an optional string that represents the ID
   * of the element that should receive focus after
   * the dialog is closed.
   *
   * If MUST be provided, and should be the id of a
   * control in the document, when 'open' is true.
   *
   * It ensures compliance with accessibility
   * requriement of dialog role.
   *
   * It should ideally be the control that as focused
   * a the time the alert opened (e.g. when the
   * form was submitted but there was a server error
   * that resultd in the AlertDialog being opened). If not,
   * it should be the first element on the page.
   */
  elementIdToFocusAfterDialogClosed?: string;
  onClose?: ReactEventHandler<HTMLDialogElement>;
}) {
  const headingId = useId();
  const descriptionId = useId();
  const buttonId = useId();
  const dialogId = useId();

  useEffect(() => {
    //set focus to the button
    //tried autoFocus={true} on the button before
    //but that stopped working when I stopped putting
    //this dialog inside a React ErrorBoundary and started
    //placing it next to the form element and remove the
    //React ErrorBoundary.
    const dialogElement = document.getElementById(dialogId);
    const closeButton = document.getElementById(buttonId);
    if (dialogElement && closeButton) {
      if ((dialogElement as HTMLDialogElement).open) {
        closeButton.focus({ preventScroll: true });
        console.log('focused to close button');
      }
    } else {
      //log error as taking this branch should be IMPOSSIBLE
    }
  });

  return (
    <dialog
      role='alertdialog'
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      aria-modal='true'
      id={dialogId}
      className='modal'
      onClose={(e) => {
        if (elementIdToFocusAfterDialogClosed) {
          const elementToFocus = document.getElementById(
            elementIdToFocusAfterDialogClosed,
          );
          if (elementToFocus) {
            console.log(
              `found element to focus:             ${elementIdToFocusAfterDialogClosed}`,
            );
            elementToFocus.focus({
              //since this is a modal dialog, we don't want to
              //scroll the form underneath whan it closes,
              //let it be as it was
              preventScroll: true,
            });
            console.log('finished focusing on it');
          } else {
            throw new Error(
              `Element with id '${elementIdToFocusAfterDialogClosed}' provided by elementIdToFocusAfterDialogClosed prop was not found at time of dialog close`,
            );
          }
        }
        if (onClose) {
          onClose(e);
        }
      }}
      open={open}
    >
      <div className='modal-box'>
        <h3 id={headingId} className='text-lg font-bold'>
          {title}
        </h3>
        <p className='py-4' id={descriptionId}>
          {description}
        </p>
        <div className='modal-action'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}

            <button
              className='btn'
              id={buttonId}
              onKeyDown={(e) => {
                //also works for Shift+Tab as
                //tests in storybook also show
                if (e.key === 'Tab') {
                  //we need to create a keyboard
                  //trp on buttons of this modal
                  //dialog, as per requirements of dialog role
                  //(alertdialog of the dialog element above
                  // is a mashup of dialog and alert roles)
                  e.preventDefault();
                }
              }}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
