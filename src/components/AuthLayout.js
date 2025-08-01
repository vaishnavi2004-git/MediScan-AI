import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
