import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-6 w-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

interface IconProps {
  className?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></IconWrapper>;
export const UserGroupIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></IconWrapper>;
export const ClipboardListIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></IconWrapper>;
export const CalendarIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></IconWrapper>;
export const ReceiptIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconWrapper>;
export const CurrencyBangladeshiIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11 11V3m0 8h2m-2 0V3m0 8l-2.5 4.5M11 11l2.5 4.5m0 0l2.5-4.5m-5 0l-2.5 4.5M12 21a9 9 0 110-18 9 9 0 010 18z" /></IconWrapper>;
export const MenuIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></IconWrapper>;
export const XIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconWrapper>;
export const PlusIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></IconWrapper>;
export const UserIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></IconWrapper>;
export const UserPlusIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></IconWrapper>;
export const TrashIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></IconWrapper>;
export const PencilIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></IconWrapper>;
export const SearchIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></IconWrapper>;
export const SwitchVerticalIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L3 8m4 8l4-4m4-4v12m0 0l4-4m-4 4l-4 4" /></IconWrapper>;
export const UpDownIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></IconWrapper>;
export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.51 15a9 9 0 1 0 2.19-9.51L1 10"/>
  </IconWrapper>
);

export const MealIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12.5,2C12.5,2 12.5,9 10,9C7.5,9 7.5,2 7.5,2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.5,13L12.5,22" /><path strokeLinecap="round" strokeLinejoin="round" d="M10,13L10,22" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5,13L7.5,22" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.5 2L15.5 22" /></IconWrapper>;
export const DepositIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></IconWrapper>;
export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></IconWrapper>;
export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></IconWrapper>;
export const ChartBarIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></IconWrapper>;
export const ScaleIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></IconWrapper>;
export const SettingsIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>;

export const SunIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" /></IconWrapper>;
export const MoonIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></IconWrapper>;
export const ComputerDesktopIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v1a3 3 0 006 0v-1m-6 0H5a2 2 0 00-2 2h14a2 2 0 00-2-2H9zM9 17v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6" /><path d="M2 12a10 10 0 0110-10h0a10 10 0 0110 10v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" /></IconWrapper>;
export const DatabaseIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 8 0 0116 0" /><path d="M4 11c0 2.21 3.582 4 8 4s8-1.79 8-4" /></IconWrapper>;
export const ExclamationIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></IconWrapper>;
export const CheckIcon: React.FC<IconProps> = ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></IconWrapper>;