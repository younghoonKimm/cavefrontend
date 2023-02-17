import { getNewTokenAPI } from '@/api/auth/auth';
import axiosInstance from '@/api/axios';
import { DehydratedState } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const setAxiosDefaultHeaderCookie = (cookie: string) => {
  axiosInstance.defaults.headers.cookie = cookie;
};

export const setAxiosDefaultForServerSide = (cookie: string) => {
  setAxiosDefaultHeaderCookie(cookie);
  axiosInstance.defaults.baseURL = 'http://backend:3001/api';
};

export function withAuth(
  gssp: () => Promise<{ props: { dehydratedState: DehydratedState } }>,
) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res, params } = context;
    const { CAV_ACC, CAV_RFS } = req.cookies;
    const { cookie } = req.headers;

    if (cookie && CAV_ACC && CAV_RFS) {
      try {
        setAxiosDefaultForServerSide(cookie);
        const { headers, data: token } = await getNewTokenAPI();

        if (headers['set-cookie']) {
          res.setHeader('set-cookie', headers['set-cookie']);
          setAxiosDefaultHeaderCookie(
            `CAV_RFS=${token.refreshToken}; CAV_ACC=${token.accessToken}`,
          );
        }
      } catch (e) {
        return {
          redirect: {
            permanent: false,
            destination: '/login',
          },
        };
      } finally {
        setAxiosDefaultHeaderCookie('');
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }

    // const gsspData = await gssp();

    // return {
    //   props: {
    //     ...gsspData.props,
    //   },
    // };
  };
}
