import Conference from '@/components/molecules/Conference/Conference';
import useAuth from '@/hooks/api/useAuth';
import { useGetConferences } from '@/hooks/api/useConference';
import { Suspense } from 'react';
import Layout from '../Layout/Layout';
import styled from 'styled-components';

function ConferenceListTemplate() {
  const { user } = useAuth();
  const { conferences } = useGetConferences(user);

  return (
    <Layout>
      <Suspense fallback={<div>loadign</div>}>
        <StyledContainer>
          <StyledTitle>
            <h2>TITLE AREA</h2>
          </StyledTitle>

          {user?.categories && (
            <div>
              {user?.categories.map((category) => (
                <div key={category.id}>{category.title}</div>
              ))}
            </div>
          )}
          <StyledListContainer>
            <div>
              <div>예약된 회의</div>

              <div>n건</div>
            </div>
            {conferences?.map((conference) => (
              <Conference key={conference.id} conference={conference} />
            ))}
          </StyledListContainer>
        </StyledContainer>
      </Suspense>
    </Layout>
  );
}

const StyledTitle = styled.div`
  margin: 98px 0 24px;
  font-size: 32px;
  font-weight: bold;
`;

const StyledContainer = styled.div`
  padding: 0 44px;
`;

const StyledListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0px;
  background-color: #f7cb46;
  width: 400px;
  justify-content: center;
  align-items: center;
  padding: 16px 20px;
  border-radius: 30px;
`;

export default ConferenceListTemplate;
