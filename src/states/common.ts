import { atom, useSetRecoilState } from 'recoil';

import { ModalAtomType } from '@/types/common/common';

export const modalAtoms = atom<ModalAtomType>({
  key: 'common',
  default: {
    isModal: false,
    modalType: 'default',
  },
});
