import GlobalStyle from '@/styles/GlobalStyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRef, useState } from 'react';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from './ErrorBoundary';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          suspense: true,
        },
      },
    });
  }
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClientRef.current}>
        <RecoilRoot>
          <ErrorBoundary fallback={<div></div>}>
            <GlobalStyle />
            <Component {...pageProps} />
          </ErrorBoundary>
        </RecoilRoot>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
