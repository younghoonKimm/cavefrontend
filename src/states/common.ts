import { atom } from 'recoil';

import { ModalAtomType } from '@/types/common/common';

export const modalAtoms = atom<ModalAtomType>({
  key: 'commonModal',
  default: {
    isModal: false,
    modalType: 'default',
  },
});
