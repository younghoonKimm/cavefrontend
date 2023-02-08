import React, { useEffect, useState } from 'react';

import { Comp } from '@/types/common/common';

import Nav from './Nav';
import { useRecoilState } from 'recoil';
import { modalAtoms } from '@/states/common';
import Modal from '@/components/atoms/Modal/Modal';

interface LayoutProps extends Comp {
  isNav?: boolean;
}

function Layout({ children, isNav = false }: LayoutProps) {
  const [showComponent, setShowComponent] = useState(false);
  const [modalOption, setModalOption] = useRecoilState(modalAtoms);
  const { isModal, modalType } = modalOption;

  useEffect(() => {
    setShowComponent(true);
  }, []);

  const onCloseModal = () => setModalOption({ ...modalOption, isModal: false });

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
