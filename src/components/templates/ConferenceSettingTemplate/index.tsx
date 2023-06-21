import { useRouter } from 'next/router';
import Layout from '../Layout/Layout';
import useModal from '@/hooks/useModal';
import { DefaultButton } from '@/components/atoms/Button';

function ConferenceSettingTemplate() {
  const router = useRouter();
  const { id } = router.query;

  const { openModal } = useModal();
  const onOpenModal = () => openModal('conferenceCreate');

  return (
    <Layout>
      <div>
        <div>{id}</div>

        <DefaultButton type="button" buttonText="생성" onClick={onOpenModal} />
      </div>
    </Layout>
  );
}

export default ConferenceSettingTemplate;
