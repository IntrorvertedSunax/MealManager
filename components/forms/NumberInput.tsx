import React from 'react';

interface NumberInputProps {
  value: number | string;
  onChange?: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min = 0, max, step = 1, name, placeholder, disabled, readOnly, className }) => {
  const handleIncrement = () => {
    if (readOnly || !onChange) return;
    const numericValue = parseInt(String(value), 10) || 0;
    const newValue = numericValue + step;
    if (max === undefined || newValue <= max) {
      onChange(String(newValue));
    }
  };

  const handleDecrement = () => {
    if (readOnly || !onChange) return;
    const numericValue = parseInt(String(value), 10) || 0;
    const newValue = numericValue - step;
    if (min === undefined || newValue >= min) {
      onChange(String(newValue));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || !onChange) return;
    const inputValue = e.target.value;
    if (inputValue === '' || /^\d+$/.test(inputValue)) {
        const numericValue = parseInt(inputValue, 10);
        if (inputValue === '' || (
            (min === undefined || isNaN(numericValue) || numericValue >= min) &&
            (max === undefined || isNaN(numericValue) || numericValue <= max)
        )) {
            onChange(inputValue);
        }
    }
  };

  // Hides the default number input spinner
  const spinnerHideStyles = `
    /* For Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* For Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `;

  return (
    <div className="relative">
      <style>{spinnerHideStyles}</style>
      <input
        type="number" // use number to get numeric keyboard and for accessibility
        inputMode="numeric"
        pattern="[0-9]*"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full py-3 pl-4 pr-10 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition ${className || ''}`}
      />
      <div className={`absolute inset-y-0 right-0 mr-1 w-8 flex flex-col border-l border-slate-200 dark:border-slate-600 ${readOnly ? 'hidden' : ''}`}>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && Number(value) >= max)}
          className="h-1/2 w-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50 rounded-tr-lg"
          aria-label="Increment"
          tabIndex={-1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-600" />
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && Number(value) <= min)}
          className="h-1/2 w-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50 rounded-br-lg"
          aria-label="Decrement"
          tabIndex={-1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
