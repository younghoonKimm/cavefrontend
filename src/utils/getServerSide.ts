import { getNewTokenAPI } from '@/api/auth/auth';
import axiosInstance from '@/api/axios';
import { DehydratedState } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';

export const setAxiosDefaultHeaderCookie = (cookie: string) => {
  axiosInstance.defaults.headers.cookie = cookie;
};

export const setAxiosDefaultForServerSide = (cookie: string) => {
  setAxiosDefaultHeaderCookie(cookie);
  axiosInstance.defaults.baseURL = 'http://localhost:3001/api';
};

export function withAuth(
  gssp: (
    context?: GetServerSidePropsContext,
  ) => Promise<{ props: { dehydratedState: DehydratedState } }>,
) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res, resolvedUrl } = context;
    const { CAV_ACC, CAV_RFS } = req.cookies;
    const { cookie } = req.headers;
    const hasCookies = cookie && CAV_ACC && CAV_RFS;

    let gsspData;

    if (hasCookies) {
      try {
        setAxiosDefaultForServerSide(cookie);
        const { headers, data: token } = await getNewTokenAPI();

        if (headers['set-cookie'] && token) {
          res.setHeader('set-cookie', headers['set-cookie']);
          res.setHeader('Access-Control-Allow-Origin', '*');

          setAxiosDefaultHeaderCookie(
            `CAV_RFS=${token.refreshToken}; CAV_ACC=${token.accessToken}`,
          );

          gsspData = await gssp(context);
        }

        // else {
        //   throw new Error();
        // }
      } catch (error) {
        console.log(error);
        res.setHeader('set-cookie', [
          `CAV_ACC=""; Max-Age=0`,
          `CAV_RFS=""; Max-Age=0`,
        ]);
      } finally {
        setAxiosDefaultHeaderCookie('');
      }
    } else if (resolvedUrl !== '/') {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    return {
      props: {
        ...gsspData,
      },
    };
  };
}
