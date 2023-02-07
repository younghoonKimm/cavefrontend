import styled from 'styled-components';
import { useRouter } from 'next/router';

import { logOutAPI } from '@/api/auth/auth';
import { DefaultButton } from '@/components/atoms/Button';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';
import { useEffect } from 'react';
import { resetTokens } from '@/utils/getCookies';

function Nav() {
  const router = useRouter();
  const { user, clearUserQuery } = useAuth();

  const signUp = () => router.push('/login');

  const signOut = async () => {
    try {
      const res = await logOutAPI();

      if (res) {
        clearUserQuery();
      }

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      resetTokens();
    }
  }, [user]);

  return (
    <StyledNav>
      {user ? (
        <>
          <div>
            <StyledProfileImg>
              <Image src={user.profileImg} alt="image" width="52" height="52" />
            </StyledProfileImg>

            <span>{user.name}님 환영합니다</span>
          </div>
          <DefaultButton
            type="button"
            buttonText="로그아웃"
            onClick={signOut}
          />
        </>
      ) : (
        <DefaultButton type="button" buttonText="로그인" onClick={signUp} />
      )}
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: yellow;
`;

const StyledProfileImg = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
  }
`;

export default Nav;
