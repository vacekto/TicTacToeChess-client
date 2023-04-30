import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import ContextProvider from './context/GlobalStateProvider';
import { BrowserRouter } from 'react-router-dom';
import Test from './test/Test';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>
  // <Test />
);