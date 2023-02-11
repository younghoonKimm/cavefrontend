import { IConference } from '@/types/conference';
import Conference from '@/components/molecules/Conference/Conference';

interface ConferencesProps {
  conferences: IConference[];
}

function Conferences({ conferences }: ConferencesProps) {
  return (
    <>
      {conferences.map((conference) => (
        <div key={conference.id}>
          <Conference conference={conference} />
        </div>
      ))}
    </>
  );
}

export default Conferences;
