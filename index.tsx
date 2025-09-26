import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from './components/Toaster';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const toasterElement = document.getElementById('toaster-container');
if(toasterElement) {
  const toasterRoot = ReactDOM.createRoot(toasterElement);
  toasterRoot.render(<Toaster />);
}
