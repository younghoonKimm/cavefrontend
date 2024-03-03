import React from 'react';

export interface Comp {
  children?: React.ReactElement;
}

export type ModalTypes = 'default' | 'conferenceCreate';

export type ModalAtomType = {
  isModal: boolean;
  modalType: ModalTypes;
};

export type rnbDateType = {
  rnbDate: Date;
};

export interface SVGProps {
  width?: number;
  height?: number;
  [key: string]: any;
}

export enum ConferenceStatus {
  Reserve = 'R',
  Proceed = 'P',
  Done = 'D',
}
