import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          {label} {required && <span className="text-[var(--error-color)]">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-[var(--surface-color)] border ${
          error ? 'border-[var(--error-color)]' : 'border-[#333]'
        } rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6200ea] focus:border-transparent transition-all duration-200 placeholder-gray-500`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[var(--error-color)]">{error}</p>}
    </div>
  );
};

export default Input;
