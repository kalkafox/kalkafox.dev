import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { ThemeProvider } from './components/theme-provider'

import { animated, useSpring } from '@react-spring/web'
import { useAtom } from 'jotai'
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

function FakeError() {
  return (
    <>
      <div className="flex items-center">
        {/* <Icon className='w-5 h-5' icon='material-symbols:error' /> */}
        Oh no! The dom encountered an error!
      </div>
      <AlertDialog>
        <AlertDialogTrigger className="absolute right-4 rounded-lg bg-stone-900 p-2">
          Show more
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>haha</AlertDialogTitle>
            <AlertDialogDescription>
              just kidding lol
              <img
                className="my-4 rounded-lg"
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
    toast.warning(<FakeError />)
  }, [])

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
      <animated.div
        className="fixed top-0 h-[110%] w-[110%] bg-cover opacity-80"
        style={{ backgroundImage: 'url(bg.jpg)', ...backgroundSpring }}
      />
      <div
        className={`fixed top-0 h-full w-full bg-stone-950/80 ${
          errorDecoration
            ? 'heropattern-circuitboard-red-900/50'
            : 'heropattern-circuitboard-stone-900/50'
        }`}
      />
      <ScrollRestoration />
      <Navbar />
      <div className="relative flex justify-center">
        <div className="w-[50%] rounded-lg bg-stone-900/30 p-4 backdrop-blur-lg transition-all portrait:w-[90%]">
          <Outlet />
        </div>
      </div>
      {/* <TanStackRouterDevtools /> */}
      <Toaster theme={'dark'} position="bottom-right" richColors />
    </ThemeProvider>
  )
}

export default App
