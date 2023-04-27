import { Comp } from '@/types/common/common';
import { createPortal } from 'react-dom';

interface ReactPortalProps extends Comp {
  children: React.ReactElement;
  elemId: string;
}

function Portal({ children, elemId }: ReactPortalProps) {
  const element =
    typeof window !== 'undefined' && document.querySelector(elemId);

  return element ? createPortal(children, element) : null;
}
export default Portal;
