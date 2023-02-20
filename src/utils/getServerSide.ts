import { getNewTokenAPI } from '@/api/auth/auth';
import axiosInstance from '@/api/axios';
import { DehydratedState } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';

export const setAxiosDefaultHeaderCookie = (cookie: string) => {
  axiosInstance.defaults.headers.cookie = cookie;
};

export const setAxiosDefaultForServerSide = (cookie: string) => {
  setAxiosDefaultHeaderCookie(cookie);
  axiosInstance.defaults.baseURL = 'http://backend:3001/api';
};

export function withAuth(
  gssp: () => Promise<{ props: { dehydratedState: DehydratedState } }>,
  isHome?: boolean,
) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res } = context;
    const { CAV_ACC, CAV_RFS } = req.cookies;
    const { cookie } = req.headers;

    let gsspData;

    if (cookie && CAV_ACC && CAV_RFS) {
      try {
        setAxiosDefaultForServerSide(cookie);
        const { headers, data: token } = await getNewTokenAPI();

        if (headers['set-cookie'] && token) {
          res.setHeader('set-cookie', headers['set-cookie']);
          setAxiosDefaultHeaderCookie(
            `CAV_RFS=${token.refreshToken}; CAV_ACC=${token.accessToken}`,
          );

          gsspData = await gssp();
        } else {
          throw new Error();
        }
      } catch (error) {
        res.setHeader('set-cookie', [
          `CAV_ACC=""; Max-Age=0`,
          `CAV_RFS=""; Max-Age=0`,
        ]);
      } finally {
        setAxiosDefaultHeaderCookie('');
      }
    } else {
    }

    return {
      props: {
        ...gsspData,
      },
    };
  };
}
