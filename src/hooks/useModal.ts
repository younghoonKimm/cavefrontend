import { modalAtoms } from '@/states/common';
import { ModalTypes } from '@/types/common/common';
import { useRecoilState } from 'recoil';

export default function useModal() {
  const [modalOption, setModalOption] = useRecoilState(modalAtoms);

  const openModal = (modalType: ModalTypes) =>
    setModalOption({ modalType: modalType, isModal: true });

  const onCloseModal = () => setModalOption({ ...modalOption, isModal: false });

  return { modalOption, openModal, onCloseModal };
}
