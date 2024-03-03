import { modalAtoms, rnbDate } from '@/states/common';
import { ModalTypes, rnbDateType } from '@/types/common/common';
import { useRecoilState } from 'recoil';

export default function useRnbInfo() {
  const [rnbDateState, setRnbDateState] = useRecoilState(rnbDate);

  const setRnb = (date: Date) => {
    console.log(date);
    setRnbDateState({ rnbDate: date });
  };

  //   const onCloseModal = () => setModalOption({ ...modalOption, isModal: false });

  return { rnbDateState, setRnb };
}
