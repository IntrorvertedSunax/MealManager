import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from './Icons';
import Calendar from './Calendar';

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleDateChange = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const buttonBaseStyles = "w-full text-left py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";
  const buttonActiveStyles = "bg-orange-500 text-white border-orange-500 ring-orange-500";
  const iconActiveStyles = "text-white";

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${buttonBaseStyles} ${isOpen ? buttonActiveStyles : ''}`}
        >
          <span className="pl-4 pr-10">{formatDate(value)}</span>
        </button>
        <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-colors duration-200 ${isOpen ? iconActiveStyles : 'text-gray-400'}`}>
          <CalendarIcon />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 fade-in">
          <Calendar selectedDate={value} onDateChange={handleDateChange} />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
