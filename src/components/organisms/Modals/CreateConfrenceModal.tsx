import useAuth from '@/hooks/api/useAuth';
import { useCreateConference } from '@/hooks/api/useConference';

import { useEffect, useState } from 'react';

function CreateConfrenceModal() {
  const { user } = useAuth();
  const createConference = useCreateConference();

  const [conferenceData, setConferenceData] = useState<any>({
    title: '테ㅡ트',
    status: 'P',
    agenda: 'ㅇㄴㅇㄴ',
    users: [],
  });

  useEffect(() => {
    if (user) {
      setConferenceData({
        title: '테ㅡ트',
        status: 'P',
        agenda: 'ㅇㄴㅇㄴ',
        users: [user.id],
      });
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    if (user) {
      createConference(conferenceData);
    }

    //
  };

  return (
    <div>
      <button type="button" onClick={() => onSubmit(conferenceData)}>
        생성
      </button>
    </div>
  );
}

export default CreateConfrenceModal;
