import Background from '@/components/Background'
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'

import 'xterm/css/xterm.css'

const queryClient = new QueryClient()

import { trpc } from '@/util/trpc'
import { Icon } from '@iconify/react'
import Head from 'next/head'

import Meta from '@/components/Meta'
import meta from '@/data/meta.json'
import { Provider } from 'jotai'

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="absolute -z-20 h-full w-full bg-zinc-900">
      <Provider>
        <QueryClientProvider client={queryClient}>
          <Head>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#597056"
            />
            <meta name="msapplication-TileColor" content="#79BC71" />
            <meta name="theme-color" content="#79BC71" />
            <meta name="description" content={meta.description} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:image" content={meta.image} />
            <meta property="og:url" content={meta.url} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="kalkafox" />
            <meta property="og:locale" content="en_US" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@kalkafox" />
            <meta name="twitter:creator" content="@kalkafox" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={meta.image} />
          </Head>
          <Meta />
          <Background doResize={false} mod={5000} amp={20} />
          <Component {...pageProps} />
          <div className="fixed bottom-0 left-0 m-2 grid h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/50 backdrop-blur-lg">
            <span>
              <a
                href="https://github.com/kalkafox/kalkafox.dev"
                rel="noreferrer"
                target="_blank"
              >
                <Icon
                  className=" text-zinc-300"
                  icon="mdi:github"
                  width="24"
                  height="24"
                  inline={true}
                />
              </a>
            </span>
          </div>
          <Analytics />
        </QueryClientProvider>
      </Provider>
    </div>
  )
}

export default trpc.withTRPC(App)
