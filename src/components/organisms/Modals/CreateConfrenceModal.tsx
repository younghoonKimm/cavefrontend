import useAuth from '@/hooks/api/useAuth';
import { useCreateConference } from '@/hooks/api/useConference';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';

function CreateConfrenceModal() {
  const router = useRouter();
  const { user } = useAuth();
  const createConference = useCreateConference();

  const [conferenceData, setConferenceData] = useState<any>({
    title: '테스트용',
    status: 'P',
    agendas: [{ title: 'sddssd', text: 'dssddssd' }],
    users: [],
  });

  useEffect(() => {
    if (user) {
      setConferenceData({
        title: '테ㅡ트',
        status: 'P',
        agendas: [{ title: 'sddssd', text: 'dssddssd' }],
        users: [user.id],
      });
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    try {
      if (user) {
        createConference(conferenceData);
      }
      return router.push('/');
    } catch (e) {}

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
