import styled from 'styled-components';
import { useRouter } from 'next/router';

import { logOutAPI } from '@/api/auth';
import { DefaultButton } from '@/components/atoms/Button';
import useAuth from '@/hooks/useAuth';

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

  return (
    <StyledNav>
      {user ? (
        <>
          <div>
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

export default Nav;
