import { useMemo } from 'react';
import * as Modals from 'src/components/organisms/Modals';

export const useModals = () => {
  const modals = useMemo(() => {
    return {
      default: <Modals.CreateConfrenceModal />,
      conferenceCreate: <Modals.CreateConfrenceModal />,
    };
  }, []);

  return [modals];
};
