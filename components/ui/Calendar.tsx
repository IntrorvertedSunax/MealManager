import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const areDatesEqual = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [displayDate, setDisplayDate] = useState(selectedDate || new Date());

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const handlePrevMonth = () => setDisplayDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setDisplayDate(new Date(year, month + 1, 1));

  const renderDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    for (let i = firstDay; i > 0; i--) {
      days.push(<div key={`prev-${i}`} className="p-2 text-center text-gray-300 dark:text-gray-600">{daysInPrevMonth - i + 1}</div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isSelected = areDatesEqual(currentDate, selectedDate);
      
      const dayClasses = `
        w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer
        ${isSelected ? 'bg-blue-600 text-white font-bold' : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'}
      `;
      days.push(
        <button key={day} type="button" onClick={() => onDateChange(currentDate)} className={dayClasses}>
          {day}
        </button>
      );
    }

    const totalCells = days.length > 35 ? 42 : 35;
    const daysFromNextMonth = totalCells - days.length;
    for (let i = 1; i <= daysFromNextMonth; i++) {
        days.push(<div key={`next-${i}`} className="p-2 text-center text-gray-300 dark:text-gray-600">{i}</div>);
    }
    
    return days;
  };

  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-80 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-800 dark:text-gray-100">
          {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button type="button" onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
        {dayLabels.map(label => <div key={label}>{label}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 justify-items-center">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;