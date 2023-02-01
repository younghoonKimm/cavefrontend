import GlobalStyle from '@/styles/GlobalStyle';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRef, useState } from 'react';
import { RecoilRoot } from 'recoil';
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
  // const queryClientRef = useRef<QueryClient>();
  // if (!queryClientRef.current) {
  //   queryClientRef.current = new QueryClient({
  //     defaultOptions: {
  //       queries: {
  //         // onError: queryErrorHandler,
  //         staleTime: 600000,
  //         cacheTime: 900000,
  //         refetchOnMount: false,
  //         suspense: true,
  //       },
  //       mutations: {
  //         // onError: queryErrorHandler,
  //       },
  //     },
  //   });
  // }

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ErrorBoundary fallback={<div></div>}>
            <GlobalStyle />
            <Component {...pageProps} />
          </ErrorBoundary>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}
