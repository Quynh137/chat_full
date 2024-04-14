import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import App from '@/App';
import reportWebVitals from '@/reportWebVitals';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ThemeContext from '@/common/context/theme-context';
import TshusProvider from '@/common/context/tshus-context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <TshusProvider>
      <ThemeContext>
        <Router>
          <Routes>
            <Route path="/*" element={<App/>} />
          </Routes>
        </Router>
      </ThemeContext>
    </TshusProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
