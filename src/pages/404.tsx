import { poppins } from '@/util/font'
import { useSpring, animated as a } from '@react-spring/web'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const CubeComponent = dynamic(() => import('@/components/Cube'), {
  ssr: false,
})

function NotFound() {
  const router = useRouter()

  const [cubeVisible, setCubeVisible] = useState(false)

  const [notFoundSpring, setNotFoundSpring] = useSpring(() => ({
    from: {
      scale: 0.8,
      opacity: 0,
      display: 'none',
    },
    to: {
      scale: 1,
      opacity: 1,
      display: 'block',
    },
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  }))

  useEffect(() => {
    setTimeout(() => {
      setCubeVisible(true)
    }, 500)
  }, [])

  return (
    <a.div
      style={notFoundSpring}
      className={`text-center p-2 ${poppins.className} bg-zinc-800/20 backdrop-blur-lg border w-60 rounded-lg text-zinc-300 absolute left-0 right-0 m-auto top-12`}>
      <h1 className='font-bold text-4xl'>404</h1>
      {cubeVisible && <CubeComponent />}
      <p>Whoops, that&apos;s an error.</p>
      <button
        className='bg-zinc-300/20 hover:bg-zinc-300/40 transition-colors rounded-lg p-2 mt-2'
        onClick={() => {
          setNotFoundSpring.start({
            opacity: 0,
            scale: 0.8,
            onChange: (e) => {
              if (e.value.opacity < 0.5) {
                router.push('/')
              }
            },
          })
        }}>
        &gt; Home
      </button>
    </a.div>
  )
}

export default NotFound
