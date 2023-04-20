import Background from '@/components/Background'
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'

const queryClient = new QueryClient()

import { Icon } from '@iconify/react'
import { trpc } from '@/util/trpc'
import Head from 'next/head'
import { useAtomValue } from 'jotai'
import { splashTextAtom } from '@/util/atom'

import meta from '@/data/meta.json'

function App({ Component, pageProps }: AppProps) {
  const splashText = useAtomValue(splashTextAtom)
  return (
    <div className='w-full h-full absolute bg-zinc-900 -z-20'>
      <QueryClientProvider client={queryClient}>
        <Head>
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#597056' />
          <meta name='msapplication-TileColor' content='#79BC71' />
          <meta name='theme-color' content='#79BC71' />
          <meta name='description' content={meta.description} />
          <meta property='og:title' content={meta.title} />
          <meta property='og:description' content={meta.description} />
          <meta property='og:image' content={meta.image} />
          <meta property='og:url' content={meta.url} />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='kalkafox' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@kalkafox' />
          <meta name='twitter:creator' content='@kalkafox' />
          <meta name='twitter:title' content={meta.title} />
          <meta name='twitter:description' content={meta.description} />
          <meta name='twitter:image' content={meta.image} />
          <title>{`${splashText.replaceAll('`', '')} | kalkafox.dev`}</title>
        </Head>
        <Background doResize={false} mod={5000} amp={20} />
        <Component {...pageProps} />
        <div className='fixed left-0 bottom-0 h-7 w-full bg-zinc-900/50 backdrop-blur-lg'>
          <span className='fixed inline-block'>
            <a
              href='https://github.com/kalkafox/kalkafox.github.io'
              rel='noreferrer'
              target='_blank'>
              <Icon
                className='top-0 bottom-0 inline h-7 text-zinc-300'
                icon='mdi:github'
                width='22'
                height='22'
                inline={true}
              />
            </a>
          </span>
          <a href='https://nextjs.org' rel='noreferrer' target='_blank'>
            <Icon
              className='right-2 top-1 absolute fill-zinc-300'
              onClick={() => {}}
              icon='tabler:brand-nextjs'
              color='#eee'
              width='24'
              inline={true}
            />
          </a>
          <a href='https://vercel.com' rel='noreferrer' target='_blank'>
            <Icon
              className='right-8 top-1 absolute fill-zinc-300'
              onClick={() => {}}
              icon='tabler:brand-vercel'
              color='#eee'
              width='24'
              inline={true}
            />
          </a>
        </div>
      </QueryClientProvider>
      <Analytics />
    </div>
  )
}

export default trpc.withTRPC(App)
