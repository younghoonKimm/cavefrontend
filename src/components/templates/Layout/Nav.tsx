import { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useRecoilState } from 'recoil';

import { logOutAPI } from '@/api/auth/auth';
import { DefaultButton } from '@/components/atoms/Button';
import useAuth from '@/hooks/api/useAuth';

import { resetTokens } from '@/utils/getCookies';
import { modalAtoms } from '@/states/common';

function Nav() {
  const router = useRouter();
  const { user, clearUserQuery } = useAuth();

  const [modalOption, setModalOption] = useRecoilState(modalAtoms);

  useEffect(() => {
    if (!user) {
      resetTokens();
    }
  }, [user]);

  const signUp = () => router.push('/login');

  const signOut = async () => {
    try {
      const res = await logOutAPI();

      if (res) {
        clearUserQuery();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onOpenModal = () => setModalOption({ ...modalOption, isModal: true });

  return (
    <StyledNav>
      {user ? (
        <>
          <div>
            {user.profileImg && (
              <StyledProfileImg>
                <Image
                  src={user.profileImg}
                  alt="image"
                  width="52"
                  height="52"
                />
              </StyledProfileImg>
            )}
            <span>{user.name ?? '회원'}님 환영합니다</span>
          </div>
          <div>
            <DefaultButton
              type="button"
              buttonText="생성"
              onClick={onOpenModal}
            />
            <DefaultButton
              type="button"
              buttonText="로그아웃"
              onClick={signOut}
            />
          </div>
        </>
      ) : (
        <DefaultButton type="button" buttonText="로그인" onClick={signUp} />
      )}
    </StyledNav>
    // </Suspense>
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
