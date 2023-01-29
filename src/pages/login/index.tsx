import { NextPage } from 'next';
import React from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';

const Login: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div>
      Login
      <div>
        {session ? (
          <>
            {session.user?.name}님 반갑습니다 <br />
            <button type="button" onClick={() => signOut()}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            로그인되지 않았습니다 <br />
            <button onClick={() => signIn('kakao')}>로그인</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
