import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Clean, accessible input field with top label, leading icon,
 * password toggle, inline error, and helper text.
 */
export default function FloatingLabelInput({
  id,
  name,
  label,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  icon: Icon,
  required = false,
  error = '',
  helperText = '',
  theme = 'dark',
  disabled = false,
  autoComplete,
  placeholder = '',
  className = '',
  list,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isLight = theme === 'light';

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-[#00629B] dark:text-[#38bdf8] ml-1">*</span>}
        </label>
      )}

      <div
        className={`relative flex items-center w-full rounded-xl border transition-all duration-150 ${
          error
            ? isLight
              ? 'border-rose-400 bg-rose-50/30 text-slate-900 ring-2 ring-rose-500/10'
              : 'border-rose-500/70 bg-rose-950/20 text-slate-100 ring-2 ring-rose-500/20'
            : isLight
            ? 'border-slate-300/80 bg-white text-slate-900 focus-within:border-[#00629B] focus-within:ring-2 focus-within:ring-[#00629B]/15 shadow-sm'
            : 'border-slate-800 bg-[#0E131F] text-slate-100 focus-within:border-[#00629B] focus-within:ring-2 focus-within:ring-[#00629B]/25'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        {Icon && (
          <div
            className={`pl-3.5 pr-1 shrink-0 transition-colors pointer-events-none ${
              error
                ? 'text-rose-500'
                : isLight
                ? 'text-slate-400 group-focus-within:text-[#00629B]'
                : 'text-slate-500 group-focus-within:text-[#38bdf8]'
            }`}
          >
            <Icon size={16} strokeWidth={1.8} />
          </div>
        )}

        <input
          id={id}
          name={name || id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          list={list}
          className={`w-full h-10 bg-transparent text-sm font-normal outline-none px-3 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            isPassword ? 'pr-10' : ''
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
            className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 leading-tight">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
