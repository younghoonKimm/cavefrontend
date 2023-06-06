import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const LoginTemplate = dynamic(
  () => import('@/components/templates/LoginTemplate/Login'),
);

const Login: NextPage = () => {
  return <LoginTemplate />;
};

export default Login;
