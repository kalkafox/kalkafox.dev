import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Suspense, lazy, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'

import { SpeedInsights } from '@vercel/speed-insights/react'

import { animated, useSpring } from '@react-spring/web'
import { useAtom } from 'jotai'
import { errorDecorationAtom } from './util/atom'
import range from 'lodash.range'

const Navbar = lazy(() => import('./components/navbar'))
const Toaster = lazy(() => import('./components/toast'))

function App() {
  const [errorDecoration, _] = useAtom(errorDecorationAtom)

  const [backgroundSpring, backgroundSpringApi] = useSpring(() => ({
    x: 0,
    y: 0,
  }))

  useEffect(() => {
    const mult = 0.005

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

    // Delete the preload elements once we're ready
    const elementsToRemove = ['fox', 'preload', 'progress-fg', 'progress-bg']

    elementsToRemove.forEach((val) => {
      const elem = document.getElementById(val)

      if (!elem) {
        return
      }

      elem.remove()
    })

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
      <Suspense
        fallback={
          <nav className="relative left-0 right-0 m-auto my-2 flex w-[60%] items-center gap-x-1 rounded-lg bg-neutral-900/50 p-2 backdrop-blur-sm transition-all heropattern-floatingcogs-stone-900/50 portrait:w-[90%]">
            <div className="h-12 w-12 animate-pulse rounded-lg bg-stone-900" />
            {range(3).map((i) => (
              <div
                key={i}
                className="h-6 w-20 animate-pulse rounded-lg bg-stone-900"
              />
            ))}
          </nav>
        }
      >
        <Navbar />
      </Suspense>
      <div className="relative flex justify-center">
        <div className="w-[50%] rounded-lg bg-stone-900/30 p-4 backdrop-blur-lg transition-all portrait:w-[90%]">
          <Outlet />
        </div>
      </div>
      {/* <TanStackRouterDevtools /> */}
      <Suspense>
        <Toaster />
      </Suspense>
      <SpeedInsights />
    </ThemeProvider>
  )
}

export default App
