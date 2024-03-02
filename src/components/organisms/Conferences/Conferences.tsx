import { IConference } from '@/types/conference';
import styled from 'styled-components';
import Conference from '@/components/molecules/Conference/Conference';
import useAuth from '@/hooks/api/useAuth';
import { useGetConferences } from '@/hooks/api/useConference';
import { Suspense } from 'react';
import { flexStyle } from '@/styles/common';
import { VideoIcon } from '@/components/atoms/Svg/Index';
import { ConferenceStatus } from '@/types/common/common';

interface ConferencesType {
  conferences?: IConference[];
  type: ConferenceStatus;
}

function Conferences({ conferences, type }: ConferencesType) {
  const { user } = useAuth();

  return (
    <StyledListContainer type={type}>
      <StyledTitleContainer>
        <StyledTitle>
          <VideoIcon width={24} color="black" />
          <p>
            {type === ConferenceStatus.Reserve
              ? '예약된 회의'
              : type === ConferenceStatus.Proceed
              ? '진행중인 회의'
              : '종료된 회의'}
          </p>
        </StyledTitle>

        <StyledCount type={type}>{conferences?.length ?? 0}건</StyledCount>
      </StyledTitleContainer>
      <Suspense fallback={<div>loadign</div>}>
        {conferences?.map((conference) => (
          <Conference key={conference.id} conference={conference} />
        ))}
      </Suspense>
    </StyledListContainer>
  );
}

const StyledTitleContainer = styled.div`
  ${flexStyle}
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 11px 0 10px;
`;

const StyledTitle = styled.div`
  ${flexStyle}
  gap: 0 10px;
  p {
    font-size: 20px;
    font-weight: 600;
  }
`;
// Reserve = 'R',
// Proceed = 'P',
// Done = 'D',
const StyledCount = styled.div<{ type: ConferenceStatus }>`
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) =>
    props.type === 'R'
      ? '#EA6200'
      : props.type === 'D'
      ? 'rgba(0,0,0,0.4)'
      : 'rgba(0,0,0,0.4)'};
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
`;

const StyledListContainer = styled.div<{ type: ConferenceStatus }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px 0px;

  min-width: 400px;
  flex: 1;
  /* justify-content: center; */
  align-items: center;
  padding: 16px 20px;
  border-radius: 30px;
  /* todo 분기 */
  /* background-color: #f7cb46; */

  background-color: ${(props) =>
    props.type === 'R'
      ? '#f7cb46'
      : props.type === 'D'
      ? '#6478FF'
      : '#DBFC66'};
  background-image: ${(props) =>
    `url('/background/conference/${
      props.type === 'R' ? 'pause' : props.type === 'D' ? 'done' : 'proceed'
    }.png')`};
  background-position: center 120%;
  background-repeat: no-repeat;
  background-size: cover;
`;

export default Conferences;
