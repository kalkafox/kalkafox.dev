import '@fontsource/fira-mono'
import '@fontsource/urbanist'
import { NotFoundRoute, Router, RouterProvider } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { routeTree } from './routeTree.gen.ts'
import { errorDecorationAtom } from './util/atom.ts'

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => routeTree,
  component: () => <NotFoundComponent />,
})

function NotFoundComponent() {
  const setDecoration = useSetAtom(errorDecorationAtom)

  useEffect(() => {
    setDecoration(true)
  }, [])

  return <h1>page not found</h1>
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
