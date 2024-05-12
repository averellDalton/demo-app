import { cn } from '@/utils/cn';
import { nanoid } from 'nanoid';
import { forwardRef, useMemo } from 'react';

type RHFCheckboxProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RHFCheckbox = forwardRef<HTMLInputElement, RHFCheckboxProps>(function (
  { label, className, ...props },
  ref,
) {
  const id = useMemo(() => nanoid(), []);
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <div className="flex w-full flex-1 items-center justify-center gap-x-4 py-2">
        <input
          ref={ref}
          {...props}
          id={id}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600',
            className,
          )}
        />
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      </div>
    </div>
  );
});

export default RHFCheckbox;
