import { Comp } from '@/types/common/common';

interface ConferenceMyVideoProps extends Comp {}

function ConferenceMyVideo({ children }: ConferenceMyVideoProps) {
  return <div>{children}</div>;
}

export default ConferenceMyVideo;
