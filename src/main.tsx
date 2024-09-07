import '@fontsource/fira-mono'
import '@fontsource/urbanist'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { routeTree } from './routeTree.gen.ts'
import { Provider } from 'jotai'
import { mainStore, nerdStatsAtom } from './util/atom.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const initialTime = Date.now()

mainStore.set(nerdStatsAtom, (e) => ({ ...e, initialTime }))

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
  const progressBg = document.getElementById('progress-bg')!
  const progressFg = document.getElementById('progress-fg')!
  progressFg.style.width = '12px'
  const root = ReactDOM.createRoot(rootElement)

  mainStore.set(nerdStatsAtom, (e) => ({
    ...e,
    timeToLoadReact: Date.now() - initialTime,
  }))

  const reducedMotion = window.localStorage.getItem('reducedMotion')

  if (!reducedMotion || (reducedMotion && reducedMotion === 'false')) {
    //document.getElementById('fox')!.style.opacity = '0'
    document.getElementById('progress-bg')!.style.opacity = '0'
  }

  progressFg.style.width = progressBg.style.width

  const queryClient = new QueryClient()

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={mainStore}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </React.StrictMode>,
  )

  mainStore.set(nerdStatsAtom, (e) => ({
    ...e,
    timeToReactRender: Date.now() - initialTime,
  }))
}
