import Head from 'next/head';

import { GetServerSideProps, NextPage } from 'next';
import { getNewTokenAPI } from '@/api/auth/auth';
import useAuth, { getMe } from '@/hooks/api/useAuth';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { QUERYKEY_CONFERENCE, QUERYKEY_USER } from 'constants/queryKeys';
import { Suspense, useEffect } from 'react';
import useSocket from '@/hooks/useSocket';
import Layout from '@/components/templates/Layout/Layout';

import axiosInstance from '@/api/axios';

import { getConference, useGetConference } from '@/hooks/api/useConference';
import Conferences from '@/components/organisms/Conferences/Conferences';
import {
  setAxiosDefaultForServerSide,
  setAxiosDefaultHeaderCookie,
} from '@/utils/getServerSide';

const Home: NextPage = () => {
  const { user } = useAuth();

  // const [socket, disconnect] = useSocket(user?.id);
  const { conferences } = useGetConference(user);

  return (
    <>
      <Head>
        <title>Conference</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          {user && conferences ? (
            <Conferences conferences={conferences} />
          ) : (
            <div></div>
          )}
        </section>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const queryClient = new QueryClient();
  const { CAV_ACC } = req.cookies;
  const { cookie } = req.headers;

  if (cookie && CAV_ACC) {
    try {
      setAxiosDefaultForServerSide(cookie);
      const { headers, data: token } = await getNewTokenAPI();

      if (headers['set-cookie']) {
        res.setHeader('set-cookie', headers['set-cookie']);
        setAxiosDefaultHeaderCookie(
          `CAV_RFS=${token.refreshToken}; CAV_ACC=${token.accessToken}`,
        );
        // axiosInstance.defaults.headers.cookie = `CAV_RFS=${token.refreshToken}; CAV_ACC=${token.accessToken}`;
        await queryClient.prefetchQuery([QUERYKEY_USER], getMe, {
          staleTime: 900,
        });

        await queryClient.prefetchQuery([QUERYKEY_CONFERENCE], getConference, {
          staleTime: 900,
        });
      }
    } catch (e) {
    } finally {
      setAxiosDefaultHeaderCookie('');
    }
    return {
      props: { dehydratedState: dehydrate(queryClient) },
    };
  } else {
    return {
      props: { dehydratedState: dehydrate(queryClient) },
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
};

export default Home;
