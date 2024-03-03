import { atom } from 'recoil';

import { ModalAtomType, rnbDateType } from '@/types/common/common';

export const modalAtoms = atom<ModalAtomType>({
  key: 'commonModal',
  default: {
    isModal: false,
    modalType: 'default',
  },
});

export const rnbDate = atom<rnbDateType>({
  key: 'rnbDate',
  default: {
    rnbDate: new Date(),
  },
});
