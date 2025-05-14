import { ErrorBoundary } from 'react-error-boundary';
import AlertDialog from './AlertDialog';

export default function AlertDialogErrorBoundary({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  //manufacturing a function on every render is
  //in general a VERY bad idea but I cannot
  //provide a function to fallbackRender property
  //that could be passed or could access title
  //and description props here.
  //So I am computing a new function on every render here.
  //The mitigation is that render of this component
  //whose render function is passed to fallbackRender property
  //would only happen ONCE.
  //Then at some point the user would click Close on the
  //dialog. This would call the passed resetErrorBoundary
  //function that in turn would trigger a re-render of
  //ErrorBoundary when the fallbackRender function would NOT
  //be shown (i.e. it wouldn't render again).
  //HENCE there would be no effect on performance.
  //AND no danger of state of the component being lost.
  //because DOM had to be rebuilt on a re-render
  return (
    <ErrorBoundary
      fallbackRender={({
        resetErrorBoundary,
      }: {
        resetErrorBoundary: () => void;
      }) => (
        <AlertDialog
          title={title}
          description={description}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
