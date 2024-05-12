import { forwardRef, useMemo } from 'react';
import { Input } from '@headlessui/react';
import { nanoid } from 'nanoid';
import { cn } from '@/utils/cn';

type RHFInputProps = {
  label: string;
  helperText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RHFInput = forwardRef<HTMLInputElement, RHFInputProps>(function (
  { label, helperText, className, ...props },
  ref,
) {
  const id = useMemo(() => nanoid(), []);
  return (
    <div className="flex w-full flex-1 flex-col gap-y-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      ) : null}
      <Input
        type="text"
        {...props}
        id={id}
        ref={ref}
        className={cn(
          'block w-full rounded-lg border border-transparent bg-black/5 px-3 py-1.5 text-sm/6 text-black',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25',
          className,
          { 'border-red-500 data-[focus]:outline-red-500/40': helperText },
        )}
      />
      {helperText ? (
        <span className="text-xs font-normal leading-6 text-red-500">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

export default RHFInput;
