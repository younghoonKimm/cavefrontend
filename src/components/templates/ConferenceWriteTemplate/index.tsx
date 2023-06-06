import { useRouter } from 'next/router';
import Layout from '../Layout/Layout';

function ConferenceWriteTemplate() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <div>{id}</div>
    </Layout>
  );
}

export default ConferenceWriteTemplate;
