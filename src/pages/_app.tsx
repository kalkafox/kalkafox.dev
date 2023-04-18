import Background from '@/components/Background'
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

import { Icon } from '@iconify/react'
import { trpc } from '@/util/trpc'

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
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
  )
}

export default trpc.withTRPC(App)
