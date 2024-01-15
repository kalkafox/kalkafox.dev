import '@fontsource/fira-mono'
import '@fontsource/urbanist'
import { NotFoundRoute, Router, RouterProvider } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import React, { Suspense, lazy, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { routeTree } from './routeTree.gen.ts'
import { errorDecorationAtom } from './util/atom.ts'

const Cube = lazy(() => import('@/components/cube'))

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => routeTree,
  component: () => <NotFoundComponent />,
})

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

const router = new Router({
  notFoundRoute,
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
)
