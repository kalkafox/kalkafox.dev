import {
  Outlet,
  ScrollRestoration,
  useRouterState,
} from '@tanstack/react-router'
import { Suspense, lazy, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'

import { SpeedInsights } from '@vercel/speed-insights/react'

import { animated, useSpring } from '@react-spring/web'
import { useAtom, useAtomValue } from 'jotai'
import {
  errorDecorationAtom,
  navOffsetAtom,
  nerdStatsAtom,
  reducedMotionAtom,
  renderReadyAtom,
} from './util/atom'
import range from 'lodash.range'

const Navbar = lazy(() => import('./components/navbar'))
const Toaster = lazy(() => import('./components/toast'))

function App() {
  const [errorDecoration, _errorDecoration] = useAtom(errorDecorationAtom)
  const [reducedMotion, _setReducedMotion] = useAtom(reducedMotionAtom)
  const routerState = useRouterState()

  const [nerdStats, setNerdStats] = useAtom(nerdStatsAtom)

  const navOffset = useAtomValue(navOffsetAtom)

  const [frontSpring, frontSpringApi] = useSpring(() => ({
    scale: 1,
    opacity: 0,
  }))

  const [backgroundSpring, backgroundSpringApi] = useSpring(() => ({
    x: 0,
    y: 0,
  }))

  const [renderReady, setRenderReady] = useAtom(renderReadyAtom)

  useEffect(() => {
    if (reducedMotion) return
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
    // const elementsToRemove = ['fox', 'preload', 'progress-fg', 'progress-bg']

    // elementsToRemove.forEach((val) => {
    //   const elem = document.getElementById(val)

    //   if (!elem) {
    //     return
    //   }

    //   elem.remove()
    // })

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseout', mouseLeave)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (routerState.status === 'idle') {
      const preloadElem = document.getElementById('preload')!

      if (preloadElem) {
        preloadElem.remove()
      }

      setNerdStats((e) => ({
        ...e,
        timeToPageLoad: Date.now() - nerdStats.initialTime,
      }))
    }
  }, [routerState.status])

  useEffect(() => {
    const reducedMotion = window.localStorage.getItem('reducedMotion')

    if (reducedMotion && reducedMotion === 'true') {
      frontSpringApi.set({
        opacity: 1,
        scale: 1,
      })
    } else {
      if (renderReady) {
        frontSpringApi.set({ scale: 0.95 })
        frontSpringApi.start({
          opacity: 1,
          scale: 1,
        })
      }
    }
  }, [renderReady])

  useEffect(() => {
    if (window.location.pathname !== '/') {
      setRenderReady(true)
    }
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <animated.div
        className="fixed top-0 h-[110%] w-[110%] overflow-x-hidden bg-cover opacity-80"
        style={{
          backgroundImage: 'url(bg2.jpg)',
          ...backgroundSpring,
          ...frontSpring,
        }}
      >
        <div
          className={`fixed left-0 top-0 h-[110%] w-[110%] overflow-x-hidden bg-stone-950/80 ${
            errorDecoration
              ? 'heropattern-circuitboard-red-900/50'
              : 'heropattern-circuitboard-stone-900/50'
          }`}
        />
      </animated.div>
      <animated.div
        //style={frontSpring}
        className="absolute left-0 top-0 h-full w-full"
      >
        <ScrollRestoration />
        <Suspense
          fallback={
            <animated.nav
              style={frontSpring}
              className="relative left-0 right-0 m-auto my-2 flex w-[60%] items-center gap-x-1 rounded-lg bg-neutral-900/50 p-2 backdrop-blur-sm transition-all heropattern-floatingcogs-stone-900/50 portrait:w-[90%]"
            >
              <div className="h-12 w-12 animate-pulse rounded-lg bg-stone-900" />
              {range(3).map((i) => (
                <div
                  key={i}
                  className="h-6 w-20 animate-pulse rounded-lg bg-stone-900"
                />
              ))}
            </animated.nav>
          }
        >
          <Navbar style={frontSpring} />
        </Suspense>
        <div
          className="relative flex justify-center"
          style={{ top: navOffset > 0 ? navOffset + 20 : 0 }}
        >
          <animated.div
            style={frontSpring}
            className="w-[90%] rounded-lg bg-stone-900/30 p-4 backdrop-blur-lg sm:w-[90%] md:w-[50%] portrait:w-[90%]"
          >
            <Outlet />
          </animated.div>
        </div>
        {/* <TanStackRouterDevtools /> */}
        <Suspense>
          <Toaster />
        </Suspense>
        <SpeedInsights />
      </animated.div>
    </ThemeProvider>
  )
}

export default App
