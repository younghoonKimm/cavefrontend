import { NextPage } from 'next';
import React from 'react';
import { getMe } from '@/hooks/api/useAuth';
import Link from 'next/link';

const Login: NextPage = () => {
  const getMeBtn = async () => {
    await getMe();
  };

  const signOut = async () => {};

  return (
    <div>
      Login
      <div>
        {0 ? (
          <>
            님 반갑습니다 <br />
            <button type="button" onClick={() => signOut()}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            로그인되지 않았습니다 <br />
            <Link href={'http://localhost:3002/api/auth/google'}>로그인</Link>
            <button onClick={() => getMeBtn()}>로그인</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
