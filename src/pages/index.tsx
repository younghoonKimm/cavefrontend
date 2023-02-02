import Head from 'next/head';
import Image from 'next/image';

import { useRouter } from 'next/router';

import { GetServerSideProps, NextPage } from 'next';

import { getMe, getProfileAPI, logOutAPI } from '@/api/auth';
import useAuth from '@/hooks/useAuth';
import axiosInstance from '@/api/axios';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { QUERYKEY_USER } from 'constants/queryKeys';
import { Suspense, useEffect, useState } from 'react';
import useSocket from '@/hooks/useSocket';

const Home: NextPage = () => {
  const router = useRouter();
  const [showComponent, setShowComponent] = useState(false);
  const { user, userLoading, clearUserQuery } = useAuth();
  const [mes, setMes] = useState<any>(null);
  const [socket, disconnect] = useSocket('1');
  useEffect(() => {
    setShowComponent(true);
  }, []);

  useEffect(() => {
    socket?.emit('login', {
      id: 'ds',
      conference: ['1', '2', '3'],
    });
  }, [socket]);

  useEffect(() => {
    socket?.on('messaged', (data) => {
      console.log(data);
      setMes(data);
    });
    return () => {
      socket?.off('messaged', (data) => setMes(data));
    };
  }, [socket, mes]);

  console.log(mes);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const onSubmit = () => {
    console.log(socket);
    socket?.emit('message', 'ㄴㄴㅇㅇㄴㄴㅇ');
  };

  // const { data: user } = useQuery([QUERYKEY_USER], () => getMe(), {});

  const signOut = async () => {
    try {
      const res = await logOutAPI();

      if (res) {
        clearUserQuery();
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          {showComponent && (
            <Suspense fallback={<div></div>}>
              {user ? (
                <div>
                  {/* <p>님 반갑습니다</p> */}
                  <button type="button" onClick={() => signOut()}>
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <div>
                  {/* <p>로그인 해주세요</p> */}
                  <button type="button" onClick={() => router.push('/login')}>
                    <span>로그인</span>
                  </button>
                </div>
              )}
            </Suspense>
          )}
          <p>
            <button type="button" onClick={() => onSubmit()}>
              wpcnf
            </button>
            Get started by editing&nbsp;
            <code>pages/index.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const queryClient = new QueryClient();

  const accessToken = req.cookies['CAV_ACC'];

  if (accessToken) {
    await queryClient.prefetchQuery([QUERYKEY_USER], getProfileAPI);
  }

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

export default Home;
