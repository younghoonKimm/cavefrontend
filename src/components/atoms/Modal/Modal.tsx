import { flexStyle } from '@/styles/common';
import { Comp, ModalTypes } from '@/types/common/common';
import React from 'react';
import styled from 'styled-components';

import Portal from '../Portal/Portal';
import { useModals } from '@/components/organisms/Modals/helper';

interface ModalProps extends Comp {
  isOpen: boolean;
  onClose: () => void;
  modalType: ModalTypes;
  [key: string]: any;
}

function Modal({ isOpen, onClose, children, modalType, ...props }: ModalProps) {
  const [modals] = useModals();
  return (
    <Portal elemId="#portal">
      <ModalContainer>
        <ModalDimmed onClick={onClose} />
        <ModalContents>{modals[modalType]}</ModalContents>

        {/* {children} */}
      </ModalContainer>
    </Portal>
  );
}

const ModalContainer = styled.div`
  position: fixed;
  z-index: 90;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
`;

const ModalContents = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${flexStyle}
  background: ${(props) => props.theme.lightTheme.bgColor};
  padding: 20px 20px;
  border-radius: 20px;
  min-width: 300px;
`;

const ModalDimmed = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

export default Modal;
