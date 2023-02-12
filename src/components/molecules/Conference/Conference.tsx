import styled from 'styled-components';

import { flexStyle } from '@/styles/common';
import { IConference } from '@/types/conference';
import { useRouter } from 'next/router';
import { useDeleteConference } from '@/hooks/api/useConference';

interface ConferenceProps {
  conference: IConference;
}

function Conference({ conference }: ConferenceProps) {
  const router = useRouter();
  const { id, title, status } = conference;
  const { deleteConferenceMutate } = useDeleteConference();
  return (
    <StyledConferenceContainer>
      <StyledRouterButton onClick={() => router.push(`conference/${id}`)}>
        <span>{status}</span>
        <p>{title}</p>
      </StyledRouterButton>

      <button onClick={() => deleteConferenceMutate(id)}>삭제</button>
    </StyledConferenceContainer>
  );
}

const StyledRouterButton = styled.button`
  ${flexStyle}
  gap:0 10px;
`;

const StyledConferenceContainer = styled.div`
  ${flexStyle}
  justify-content: space-between;
`;

export default Conference;
