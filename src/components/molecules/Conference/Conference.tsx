import styled from 'styled-components';

import { flexStyle } from '@/styles/common';
import { IConference } from '@/types/conference';
import { useRouter } from 'next/router';

interface ConferenceProps {
  conference: IConference;
}

function Conference({ conference }: ConferenceProps) {
  const router = useRouter();
  const { id, title, status } = conference;
  return (
    <StyledConferenceContainer onClick={() => router.push(`conference/${id}`)}>
      <span>{status}</span>
      <p>{title}</p>
    </StyledConferenceContainer>
  );
}

const StyledConferenceContainer = styled.button`
  ${flexStyle}
`;

export default Conference;
