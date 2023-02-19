import { NextPage } from 'next';
import React from 'react';
import { getMe } from '@/hooks/api/useAuth';
import Link from 'next/link';

const Login: NextPage = () => {
  return (
    <div>
      <div>
        <>
          <Link href={'http://localhost:3002/api/auth/google'}>로그인</Link>
        </>
      </div>
    </div>
  );
};

export default Login;
