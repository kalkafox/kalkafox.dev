import '@fontsource/fira-mono'
import '@fontsource/urbanist'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import React, { Suspense, lazy, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { routeTree } from './routeTree.gen.ts'
import { errorDecorationAtom } from './util/atom.ts'

const Cube = lazy(() => import('@/components/cube'))

function NotFoundComponent() {
  const setDecoration = useSetAtom(errorDecorationAtom)

  useEffect(() => {
    setDecoration(true)
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <p className="font-['Fira_Mono'] text-4xl">404</p>

        <p>Resource not found.</p>
        <Suspense>
          <Cube />
        </Suspense>
      </div>
    </>
  )
}

const router = createRouter({
  defaultNotFoundComponent: NotFoundComponent,
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  const progressBg = document.getElementById('progress-bg')!
  const progressFg = document.getElementById('progress-fg')!

  progressFg.style.width = progressBg.style.width

  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </React.StrictMode>,
  )
}
