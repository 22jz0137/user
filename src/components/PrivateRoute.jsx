import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // ローカルストレージに保存されたトークンで認証を確認

  return (
    <Route
      {...rest}
      element={isAuthenticated ? Element : <Navigate to="/login" />} // 認証されていればコンポーネント表示、されていなければ/loginへリダイレクト
    />
  );
};

export default PrivateRoute;
