import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const HomeIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></IconWrapper>;
export const UserGroupIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></IconWrapper>;
export const ClipboardListIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></IconWrapper>;
export const CalendarIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></IconWrapper>;
export const ReceiptIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconWrapper>;
export const CurrencyBangladeshiIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M11 11V3m0 8h2m-2 0V3m0 8l-2.5 4.5M11 11l2.5 4.5m0 0l2.5-4.5m-5 0l-2.5 4.5M12 21a9 9 0 110-18 9 9 0 010 18z" /></IconWrapper>;
export const MenuIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></IconWrapper>;
export const XIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconWrapper>;
export const PlusIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></IconWrapper>;
export const UserPlusIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></IconWrapper>;
export const TrashIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></IconWrapper>;
export const PencilIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></IconWrapper>;
export const HistoryIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.51 15a9 9 0 1 0 2.19-9.51L1 10"/>
  </IconWrapper>
);

export const MealIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M12.5,2C12.5,2 12.5,9 10,9C7.5,9 7.5,2 7.5,2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.5,13L12.5,22" /><path strokeLinecap="round" strokeLinejoin="round" d="M10,13L10,22" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5,13L7.5,22" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.5 2L15.5 22" /></IconWrapper>;
export const DepositIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></IconWrapper>;