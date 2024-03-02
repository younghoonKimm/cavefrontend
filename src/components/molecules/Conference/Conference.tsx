import styled from 'styled-components';

import { flexStyle } from '@/styles/common';
import { IConference } from '@/types/conference';
import { useRouter } from 'next/router';
import { useDeleteConference } from '@/hooks/api/useConference';
import ProfileImage from '../Images/ProfileImage/ProfileImage';
import Image from 'next/image';
import useAuth from '@/hooks/api/useAuth';

interface ConferenceProps {
  conference: IConference;
}

function Conference({ conference }: ConferenceProps) {
  const router = useRouter();
  const { user } = useAuth();

  const { id, title, status, users, date, settingTime } = conference;

  const { deleteConferenceMutate } = useDeleteConference();

  return (
    <StyledConferenceContainer>
      <StyledRouterButton onClick={() => router.push(`conference/${id}`)}>
        <StyledInfoContainer>
          x<StyledTitle>{title}</StyledTitle>
          <StyledDate>{date}</StyledDate>
          <StyledDetailContainer>
            <StyledInfo>Timer {settingTime}:00</StyledInfo>
            <StyledLocation>회의실</StyledLocation>
          </StyledDetailContainer>
        </StyledInfoContainer>
        <StyledUserContainer>
          {/* {users?.map((user) =>
            user.profileImg && user.name ? (
              <ProfileImage
                width={32}
                height={32}
                src={user.profileImg}
                key={user.profileImg}
                alt={`${user.name} 이미지`}
              />
            ) : null,
          )} */}
          <StyledProfileImg>
            {user?.profileImg && (
              <Image src={user.profileImg} alt="image" width="40" height="40" />
            )}
          </StyledProfileImg>
        </StyledUserContainer>
      </StyledRouterButton>
      {/* <button onClick={() => deleteConferenceMutate(id)}>삭제</button> */}
    </StyledConferenceContainer>
  );
}

const StyledRouterButton = styled.button`
  ${flexStyle}
  gap:0 10px;
  width: 100%;
  text-align: left;
  padding: 16px 20px;
  background-color: rgba(19, 19, 19, 0.8);
  color: #fff;
  border-radius: 24px;
`;

const StyledConferenceContainer = styled.div`
  position: relative;
  width: 360px;
  ${flexStyle}
  justify-content: space-between;
`;

const StyledTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
`;

const StyledDate = styled.p`
  margin-top: 4px;
  font-size: 14px;
`;

const StyledInfoContainer = styled.div`
  width: 215px;
`;

const StyledInfo = styled.div`
  background-color: rgba(198, 162, 56, 0.2);
  border-radius: 8px;
  display: flex;
  padding: 6px 10px;
  font-size: 12px;
`;

const StyledLocation = styled(StyledInfo)`
  background-color: rgba(255, 255, 255, 0.1);
`;

const StyledDetailContainer = styled.div`
  margin-top: 22px;
  display: flex;
  gap: 0 4px;
`;

const StyledUserContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  width: 115px;
  top: 16px;
  right: 16px;
`;

const StyledProfileImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
  }
`;

export default Conference;
