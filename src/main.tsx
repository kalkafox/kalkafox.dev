import '@fontsource/fira-mono'
import '@fontsource/urbanist'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { routeTree } from './routeTree.gen.ts'

const NotFoundComponent = lazy(() => import('@/components/not-found.tsx'))

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
