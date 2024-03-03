import CustomCalendar from '@/components/atoms/Calendar/CustomCalendar';
import useRnbInfo from '@/hooks/useRnb';
import { ConferenceStatus, IConference } from '@/types/conference';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import styled from 'styled-components';

interface RNBType {
  conferences?: IConference[];
}

function RNB({ conferences }: RNBType) {
  const { rnbDateState, setRnb } = useRnbInfo();

  const todayConference = useMemo(() => {
    return conferences?.filter(
      (conference) =>
        dayjs(new Date(conference.date)).format('YYYY-MM-DD') ===
        dayjs(rnbDateState.rnbDate).format('YYYY-MM-DD'),
    );
  }, [rnbDateState.rnbDate]);

  return (
    <StyledRNBContainer>
      <CustomCalendar date={rnbDateState.rnbDate} setDate={setRnb} />
      <StyledReserveInfoContainer>
        <StyledReserveInfoTitle>예약된 회의</StyledReserveInfoTitle>
        {todayConference?.map(
          (conference) =>
            conference.status === ConferenceStatus.Reserve && (
              <StyledReserveInfo key={conference.id}>
                <p>{conference.title}</p>
                <span>{conference.location}</span>
              </StyledReserveInfo>
            ),
        )}
        <StyledBorder />
        <StyledReserveInfoTitle>Action item</StyledReserveInfoTitle>
        {/* {todayConference?.map((conference) => (
          <div key={conference.id}>
            {conference.status === ConferenceStatus.Reserve && conference.title}
          </div>
        ))} */}
      </StyledReserveInfoContainer>
    </StyledRNBContainer>
  );
}

const StyledRNBContainer = styled.div`
  padding: 37px 28px 0;
  min-width: 336px;
  background-color: red;
`;

const StyledReserveInfoContainer = styled.div`
  margin-top: 36px;
`;

const StyledReserveInfo = styled.div<{ children: React.ReactNode }>`
  margin-bottom: 20px;

  p {
    font-size: 16px;
    font-weight: 600;
  }

  span {
    display: block;
    margin-top: 8px;
    font-size: 18px;
  }
`;

const StyledBorder = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 1px;
  background-color: black;
`;

const StyledReserveInfoTitle = styled.p`
  display: inline-flex;
  margin: 24px 0 16px;
  padding: 10px 16px;
  border: 1px solid #000;
  border-radius: 20px;
  font-size: 14px;
`;

export default RNB;
