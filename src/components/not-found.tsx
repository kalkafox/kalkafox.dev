import { errorDecorationAtom } from '@/util/atom'
import { useSetAtom } from 'jotai'
import { Suspense, lazy, useEffect } from 'react'

const Cube = lazy(() => import('@/components/cube'))

export default function NotFoundComponent() {
  const setDecoration = useSetAtom(errorDecorationAtom)

  useEffect(() => {
    setDecoration(true)
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <p className="font-['Fira_Mono'] text-4xl">404</p>
        <p>Resource not found.</p>
        <Suspense
          fallback={
            <div className="relative flex h-full w-full items-center justify-center py-10">
              <img src="cube.png" />
            </div>
          }
        >
          <Cube />
        </Suspense>
      </div>
    </>
  )
}
