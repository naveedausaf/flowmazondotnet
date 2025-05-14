import { useId } from 'react';

export default function AlertDialog({
  resetErrorBoundary,
  title,
  description,
}: {
  resetErrorBoundary?: () => void;
  title: string;
  description: string;
}) {
  const headingId = useId();
  const descriptionId = useId();
  return (
    <dialog
      role='alertdialog'
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      aria-modal='true'
      id='my_modal_1'
      className='modal'
      onClose={() => {
        if (resetErrorBoundary) {
          resetErrorBoundary();
        }
      }}
      open={true}
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

            {
              //we are disabling the eslint rule
              //that autofocus should not be used because
              //in case of a modal dialog, which is what this is
              //setting this atribute is what MDN documentation
              //advises. It allows us to fulfill the requirement
              //of alertdialog role (we have assgined it to the
              //dialog above) to have focus set to a focusable
              //within the dialog.
            }
            <button
              className='btn'
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
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
