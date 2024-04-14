import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicClientRoutes } from './client/routes/routes';
import Page404 from './common/error/404';
import Base from '@/common/layout/base';
import Page403 from '@/common/error/403';
import Page500 from '@/common/error/500';
import Main from '@/common/layout/frontend';
import Login from '@/client/pages/login';
import '@/client/styles/client.css';
import Register from '@/client/pages/register';
import AuthGuard from './common/guard/auth';
import GuestGuard from './common/guard/guest';

const App: React.FC = () => {
  // Return
  return (
    <Routes>
      {/* Main Layout */}
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Main />}>
          {publicClientRoutes.map((route: any, index: number) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            ></Route>
          ))}
        </Route>
      </Route>
      <Route path="/" element={<Base />}>
        <Route path="auth/" element={<GuestGuard />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="403" element={<Page403 />} />
        <Route path="403" element={<Page403 />} />
        <Route path="500" element={<Page500 />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default App;
