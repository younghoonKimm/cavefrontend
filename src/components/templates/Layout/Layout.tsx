import React, { useEffect, useState } from 'react';

import { Comp } from '@/types/common/common';

import { useRecoilState } from 'recoil';
import { modalAtoms } from '@/states/common';
import Modal from '@/components/atoms/Modal/Modal';
import useModal from '@/hooks/useModal';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/api/useAuth';

interface LayoutProps extends Comp {
  isNav?: boolean;
}
const Nav = dynamic(() => import('./Nav'), { ssr: false });

function Layout({ children, isNav = true }: LayoutProps) {
  const [showComponent, setShowComponent] = useState(false);
  const { user, clearUserQuery } = useAuth();
  const { modalOption, onCloseModal } = useModal();
  const { isModal, modalType } = modalOption;

  useEffect(() => {
    setShowComponent(true);
  }, []);

  return (
    <div>
      {isModal ? (
        <Modal onClose={onCloseModal} isOpen={true} modalType={modalType} />
      ) : null}
      <header>{isNav && <Nav />}</header>
      <main role="main">{showComponent ? children : null}</main>
      <footer></footer>
    </div>
  );
}

export default Layout;
