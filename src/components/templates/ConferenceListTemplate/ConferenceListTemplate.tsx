import Conference from '@/components/molecules/Conference/Conference';
import useAuth from '@/hooks/api/useAuth';
import { useGetConferences } from '@/hooks/api/useConference';
import { Suspense, useMemo } from 'react';
import Layout from '../Layout/Layout';
import styled from 'styled-components';
import Conferences from '@/components/organisms/Conferences/Conferences';
import { ConferenceStatus, IConference } from '@/types/conference';

function ConferenceListTemplate() {
  const { user } = useAuth();
  const { conferences } = useGetConferences(user);

  const categorizedconferences = useMemo(
    () =>
      conferences?.reduce(
        (acc: any, cur: IConference) => {
          acc = { ...acc, [cur.status]: [...acc[cur.status], cur] };
          return acc;
        },
        { P: [], R: [], D: [] },
      ),
    [conferences],
  );

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

          {/* <div>
              <div>예약된 회의</div>

              <div>n건</div>
            </div>
            {conferences?.map((conference) => (
              <Conference key={conference.id} conference={conference} />
            ))} */}
          {categorizedconferences && (
            // todo object val
            <StyledListContainer>
              <Conferences
                type={ConferenceStatus.Reserve}
                conferences={categorizedconferences[ConferenceStatus.Reserve]}
              />
              <Conferences
                type={ConferenceStatus.Proceed}
                conferences={categorizedconferences[ConferenceStatus.Proceed]}
              />
              <Conferences
                type={ConferenceStatus.Done}
                conferences={categorizedconferences[ConferenceStatus.Done]}
              />
            </StyledListContainer>
          )}
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
  gap: 0 20px;
`;

export default ConferenceListTemplate;
