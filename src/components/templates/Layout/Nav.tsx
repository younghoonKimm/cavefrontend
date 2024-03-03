import { Suspense, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useRecoilState } from 'recoil';

import { logOutAPI } from '@/api/auth/auth';
import { DefaultButton } from '@/components/atoms/Button';
import useAuth from '@/hooks/api/useAuth';

import useModal from '@/hooks/useModal';
import LogoImg from '../../../../public/favicon.png';
import Link from 'next/link';
import {
  AddConfIcon,
  FolderIcon,
  TrashIcon,
} from '@/components/atoms/Svg/Index';
import { getCategoryAPI, postCategoryAPI } from '@/api/category/category';

function Nav() {
  const router = useRouter();
  const { user, clearUserQuery } = useAuth();

  const { openModal } = useModal();

  const signUp = () => router.push('/login');

  const signOut = async () => {
    try {
      const res = await logOutAPI();

      if (res) {
        clearUserQuery();
        router.push('/');
      }
    } catch (error) {
      console.log(error, 'logout');
    }
  };

  const handleAddConference = () => router.push('/conference/setting');

  const handleClickProfile = () => router.push('/profile/setting');

  const onOpenModal = () => openModal('conferenceCreate');

  const handleAddCategory = async () => {
    const cat = {
      title: '임시',
      order: 1,
    };
    try {
      await postCategoryAPI(cat);
    } catch (error) {}
  };

  // console.log(user);

  const getCategory = async () => {
    try {
      const res = await getCategoryAPI('7a61ed02-451f-40db-b762-c2c40e4c40ed');

      console.log(res);
    } catch (error) {}
  };

  // 7a61ed02-451f-40db-b762-c2c40e4c40ed

  return (
    <StyledNav>
      {user ? (
        <>
          <div>
            <Link href="/">
              <Image src={LogoImg} alt="logo" width="80" height="40" />
            </Link>
            {/* 
            {user.profileImg && (
              <StyledProfileImg onClick={handleClickProfile}>
                <Image
                  src={user.profileImg}
                  alt="image"
                  width="52"
                  height="52"
                />
              </StyledProfileImg>
            )} */}
            {/* <span>{user.name ?? '회원'}님 환영합니다</span> */}
          </div>
          <StyledButtonsContainer>
            <DefaultButton
              type="button"
              buttonText="회의 생성하기"
              styleType="primary"
              onClick={handleAddConference}
            >
              <AddConfIcon width={22} height={22} />
            </DefaultButton>
            <StyledFolderListContainer>
              <DefaultButton
                type="button"
                buttonText="전체 회의록"
                onClick={handleAddCategory}
              >
                <FolderIcon width={22} height={22} />
              </DefaultButton>

              {user?.categories && (
                <StyledFolderList>
                  <DefaultButton
                    type="button"
                    buttonText="기본폴더"
                    onClick={() => {}}
                  >
                    <FolderIcon width={22} height={22} />
                  </DefaultButton>
                  {user?.categories.map((category) => (
                    <DefaultButton
                      key={category.id}
                      type="button"
                      buttonText={category.title}
                      onClick={() => {}}
                    >
                      <FolderIcon width={22} height={22} />
                    </DefaultButton>
                  ))}
                </StyledFolderList>
              )}

              <DefaultButton
                type="button"
                buttonText="휴지통"
                onClick={getCategory}
              >
                <TrashIcon width={22} height={22} />
              </DefaultButton>
            </StyledFolderListContainer>
            <DefaultButton
              type="button"
              buttonText="로그아웃 테스트"
              onClick={signOut}
            />
          </StyledButtonsContainer>
        </>
      ) : (
        <DefaultButton type="button" buttonText="로그인" onClick={signUp} />
      )}
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  width: 260px;
  height: 100%;
  min-height: 600px;
  display: flex;
  /* justify-content: space-between; */
  flex-direction: column;
  background: green;
  padding: 26px 24px;
`;

const StyledFolderList = styled.div`
  margin-left: 12px;
  button {
    padding: 12px 32px 12px;
  }
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

const StyledButtonsContainer = styled.div`
  margin-top: 106px;
`;

const StyledFolderListContainer = styled.div`
  margin-top: 20px;
`;

export default Nav;
