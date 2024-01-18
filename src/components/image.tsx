import { animated, useSpring } from '@react-spring/web'
import { Progress } from './ui/progress'
import ky, { DownloadProgress } from 'ky'
import { useState, useEffect } from 'react'

const Image = ({ src, className }: { src: string; className?: string }) => {
  const [data, setData] = useState('')

  const [imageSpring, imageSpringApi] = useSpring(() => ({
    opacity: 0,
    scale: 0.9,
    config: {
      tension: 400,
    },
  }))

  const [progress, setProgress] = useState<DownloadProgress>({
    percent: 0,
    totalBytes: 0,
    transferredBytes: 0,
  })

  useEffect(() => {
    const setImage = async () => {
      const res = await ky(src, {
        onDownloadProgress: (progress, _) => {
          if (progress.percent === 1) {
            imageSpringApi.start({
              opacity: 1,
              scale: 1,
            })
          }
          setProgress(progress)
        },
      })

      setData(window.URL.createObjectURL(await res.blob()))
    }

    setImage()
  }, [])

  if (progress.percent < 1)
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <Progress value={progress.percent * 100} />
      </div>
    )

  return <animated.img style={imageSpring} className={className} src={data} />
}

export default Image
