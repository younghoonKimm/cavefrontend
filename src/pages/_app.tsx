import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </SessionProvider>
  );
}
