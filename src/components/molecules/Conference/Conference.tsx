import styled from 'styled-components';

import { flexStyle } from '@/styles/common';
import { IConference } from '@/types/conference';
import { useRouter } from 'next/router';
import { useDeleteConference } from '@/hooks/api/useConference';
import ProfileImage from '../Images/ProfileImage/ProfileImage';

interface ConferenceProps {
  conference: IConference;
}

function Conference({ conference }: ConferenceProps) {
  const router = useRouter();
  const { id, title, status, users } = conference;
  const { deleteConferenceMutate } = useDeleteConference();

  return (
    <StyledConferenceContainer>
      <StyledRouterButton onClick={() => router.push(`conference/${id}`)}>
        <span>{status}</span>
        <p>{title}</p>
      </StyledRouterButton>
      {users?.map((user) =>
        user.profileImg && user.name ? (
          <ProfileImage
            width={32}
            height={32}
            src={user.profileImg}
            key={user.profileImg}
            alt={`${user.name} 이미지`}
          />
        ) : null,
      )}

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
