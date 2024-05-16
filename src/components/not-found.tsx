import { errorDecorationAtom } from '@/util/atom'
import { Progress } from '@radix-ui/react-progress'
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
        <Suspense fallback={<Progress value={100} />}>
          <Cube />
        </Suspense>
      </div>
    </>
  )
}
