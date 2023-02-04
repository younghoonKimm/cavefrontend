import Modal from '@/components/atoms/Modal';
import GlobalStyle from '@/styles/GlobalStyle';
import theme from '@/styles/theme';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import type { AppContext, AppProps } from 'next/app';
import { useRef, useState } from 'react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import ErrorBoundary from './ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // onError: queryErrorHandler,
      staleTime: 600000,
      cacheTime: 900000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      suspense: true,
    },
    mutations: {
      // onError: queryErrorHandler,
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ErrorBoundary fallback={<Modal />}>
              <Component {...pageProps} />
            </ErrorBoundary>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}

// export const getInitialProps =
//   () =>
//   async ({ Component, ctx }: AppContext) => {
//     let pageProps = {};
//     console.log(Component, 'cp');
//     if (Component.getInitialProps) {
//       pageProps = await Component.getInitialProps(ctx);
//     }

//     return { pageProps };
//   };
