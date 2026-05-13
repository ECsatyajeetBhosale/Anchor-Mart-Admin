/**
 * components/ui/Input.tsx
 *
 * A reusable text Input component.
 *
 * Props:
 *   - All standard HTML input attributes (type, placeholder, disabled, etc.)
 *   - `label`  → the label text shown above the input
 *   - `error`  → an error message shown below the input (from Zod/RHF)
 *
 * We use React.forwardRef so that React Hook Form's `register()` can attach
 * its ref to the underlying <input> element directly.
 */

import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, id, className = "", ...rest },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Input field */}
      <input
        ref={ref}
        id={id}
        className={`
          w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900
          placeholder:text-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}
          ${className}
        `}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        {...rest}
      />

      {/* Validation error message from Zod */}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
