import { postConferenceAPI } from '@/api/conference/conference';
import { useMutation } from '@tanstack/react-query';

export default function useConference() {
  const createConference = useMutation((conferenceData) =>
    postConferenceAPI(conferenceData),
  );

  return { createConference };
}
