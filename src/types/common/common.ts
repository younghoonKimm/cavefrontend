import React from 'react';

export interface Comp {
  children?: React.ReactElement;
}

export type ModalTypes = 'default' | 'conferenceCreate';

export type ModalAtomType = {
  isModal: boolean;
  modalType: ModalTypes;
};
