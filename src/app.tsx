import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { ThemeProvider } from './components/theme-provider'

import { animated, useSpring } from '@react-spring/web'
import { useAtom } from 'jotai'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/navbar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/ui/alert-dialog'
import { errorDecorationAtom } from './util/atom'

import meta from '@/data/meta.json'

function FakeError() {
  return (
    <>
      <div className="flex items-center">
        {/* <Icon className='w-5 h-5' icon='material-symbols:error' /> */}
        Oh no! The dom encountered an error!
      </div>
      <AlertDialog>
        <AlertDialogTrigger className="bg-stone-900 p-2 right-4 rounded-lg absolute">
          Show more
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>haha</AlertDialogTitle>
            <AlertDialogDescription>
              just kidding lol
              <img
                className="rounded-lg my-4"
                src="https://t4.ftcdn.net/jpg/04/20/82/69/360_F_420826948_FtEDTDts86umKGz9Zpybad5XTe4Wmo1s.jpg"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function App() {
  const [errorDecoration, _] = useAtom(errorDecorationAtom)

  useEffect(() => {
    if (!errorDecoration) {
      toast(<FakeError />)
    }
  }, [errorDecoration])

  const [backgroundSpring, backgroundSpringApi] = useSpring(() => ({
    x: 0,
    y: 0,
  }))

  useEffect(() => {
    const mult = 0.01

    const mouseMove = (e: MouseEvent) => {
      if (window.scrollY > 0) return
      backgroundSpringApi.start({
        x: -e.clientX * mult,
        y: -e.clientY * mult,
      })
    }

    const mouseLeave = () => {
      backgroundSpringApi.start({
        x: 0,
        y: 0,
      })
    }

    window.addEventListener('mousemove', mouseMove)

    window.addEventListener('mouseout', mouseLeave)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseout', mouseLeave)
    }
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Helmet>
        <meta name="msapplication-TileColor" content="#171717" />
        <meta name="theme-color" content="#171717" />
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
        <link rel="manifest" href="/manifest.json" />
      </Helmet>
      <animated.div
        className="fixed w-[110%] h-[110%] bg-cover opacity-80 top-0"
        style={{ backgroundImage: 'url(bg.jpg)', ...backgroundSpring }}
      />
      <div
        className={`fixed w-full h-full heropattern-circuitboard-${
          errorDecoration ? 'red' : 'stone'
        }-900/50 bg-stone-950/80 top-0`}
      />
      <ScrollRestoration />
      <Navbar />
      <div className="relative flex justify-center">
        <div className="bg-stone-900/30 backdrop-blur-lg p-4 w-[50%] rounded-lg portrait:w-[90%] transition-all">
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
      <Toaster theme={'dark'} position="top-right" richColors />
    </ThemeProvider>
  )
}

export default App
