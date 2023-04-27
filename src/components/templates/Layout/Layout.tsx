import React, { useEffect, useState } from 'react';

import { Comp } from '@/types/common/common';

import { useRecoilState } from 'recoil';
import { modalAtoms } from '@/states/common';
import Modal from '@/components/atoms/Modal/Modal';
import useModal from '@/hooks/useModal';
import dynamic from 'next/dynamic';
// import Nav from './Nav';

interface LayoutProps extends Comp {
  isNav?: boolean;
}
const Nav = dynamic(() => import('./Nav'), { ssr: false });

function Layout({ children, isNav = false }: LayoutProps) {
  const [showComponent, setShowComponent] = useState(false);

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
      <header>
        <Nav />
      </header>
      <main role="main">{showComponent ? children : null}</main>
      <footer></footer>
    </div>
  );
}

export default Layout;
