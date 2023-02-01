import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import axios from 'axios';

export const getTokens = async (session: any) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    session.userProfile,
  );

  return res.headers['set-cookie'];
};
