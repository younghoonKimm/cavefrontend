import { SortableHandle } from 'react-sortable-hoc';

interface SortHandleType {
  children: React.ReactNode;
}

const SortHandle = SortableHandle(({ children }: SortHandleType) => (
  <button type="button">{children}</button>
));

export default SortHandle;
