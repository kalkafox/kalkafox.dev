import { Icon } from '@iconify/react'
import {
  animated as a,
  useSpring,
  useSprings,
  useTransition,
} from '@react-spring/web'
import { useAtom, useSetAtom } from 'jotai'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

import images from '@/data/images.json'
import links from '@/data/links.json'
import splashes from '@/data/splashes.json'

import {
  bgImageAtom,
  loadedImagesAtom,
  previousPageAtom,
  showLoadSpinnerAtom,
  splashTextAtom,
} from '@/util/atom'
import ReactMarkdown from 'react-markdown'

import { trpc } from '@/util/trpc'
import { useRouter } from 'next/router'
import CountUp from 'react-countup'

import { poppins } from '@/util/font'

export default function Home() {
  const [loadedImages, setLoadedImages] = useAtom(loadedImagesAtom)

  const [previousPage, setPreviousPage] = useAtom(previousPageAtom)

  const [showLoadSpinner, setShowLoadSpinner] = useAtom(showLoadSpinnerAtom)

  const setBgImage = useSetAtom(bgImageAtom)

  const [spinBuffer, setSpinBuffer] = useState(0)

  const [splashText, setSplashText] = useAtom(splashTextAtom)

  const router = useRouter()

  const [linkSprings, setLinkSprings] = useSprings(links.length, () => ({
    opacity: 1,
    y: 5,
    color: '#f0f0f0',
    scale: 1,
  }))

  const splashTransition = useTransition(splashText, {
    from: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -10 },
  })

  const [mainMenuSpring, setMainMenuSpring] = useSpring(() => ({
    opacity: 0,
    config: {
      friction: 20,
    },
  }))

  const [contentSpring, setContentSpring] = useSpring(() => ({
    opacity: 0,
    scale: 0.9,
    config: {
      friction: 20,
    },
  }))

  useEffect(() => {
    if (
      previousPage.startsWith('/akunda') ||
      previousPage.startsWith('/mcremote')
    ) {
      setContentSpring.start({ scale: 1.2 })
    } else if (previousPage.startsWith('/')) {
      setContentSpring.start({ scale: 0.9 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousPage])

  const [avatarSpring, setAvatarSpring] = useSpring(() => ({
    rotateZ: 0,
    scale: 1,
    config: {
      friction: 10,
    },
  }))

  // const { data: userData } = useQuery<GitHubUser>({
  //   queryKey: ['github-user'],
  //   queryFn: async () => {
  //     const res = await fetch('https://api.github.com/users/kalkafox')
  //     return res.json() as Promise<GitHubUser>
  //   },
  // })

  const { data: userData } = trpc.fetchGithub.useQuery()

  useEffect(() => {
    if (userData) {
      splashes.push(userData.bio)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  return (
    <>
      <a.div
        style={contentSpring}
        className="absolute left-0 right-0 top-20 m-auto h-auto w-[40%] rounded-xl bg-zinc-900/75 backdrop-blur-lg portrait:w-[80%]"
      >
        <div className="m-4 text-center">
          <a.div className="inline-block" style={avatarSpring}>
            <Image
              src={images.avatar}
              alt="avatar"
              width="128"
              height="128"
              priority
              quality={100}
              onLoadingComplete={(e) => {
                setSpinBuffer((prev) => {
                  const ret = prev + 360
                  setAvatarSpring.start({
                    rotateZ: ret,
                    onRest: () => {
                      setAvatarSpring.set({
                        rotateZ: 0,
                      })
                      setSpinBuffer(0)
                    },
                  })
                  return ret
                })

                setContentSpring.start({
                  opacity: 1,
                  scale: 1,
                })
                setLoadedImages((prev) => {
                  return [...prev, images.avatar]
                })
              }}
              className="left-0 right-0 m-auto inline select-none rounded-full"
            />
          </a.div>
          <span
            onContextMenu={(e) => {
              e.preventDefault()
            }}
            onAuxClick={() => {
              let newRandText =
                splashes[Math.floor(Math.random() * splashes.length)]
              while (newRandText === splashText) {
                newRandText =
                  splashes[Math.floor(Math.random() * splashes.length)]
              }
              setSplashText(newRandText)
              setSpinBuffer((prev) => prev - 360)

              setAvatarSpring.start({
                rotateZ: spinBuffer - 360,
                onRest: () => {
                  setAvatarSpring.set({ rotateZ: 0 })
                  setSpinBuffer(0)
                },
              })
            }}
            onClick={() => {
              let newRandText =
                splashes[Math.floor(Math.random() * splashes.length)]
              while (newRandText === splashText) {
                newRandText =
                  splashes[Math.floor(Math.random() * splashes.length)]
              }
              setSplashText(newRandText)
              setSpinBuffer((prev) => prev + 360)
              setAvatarSpring.start({
                rotateZ: spinBuffer + 360,
                onRest: () => {
                  setAvatarSpring.set({ rotateZ: 0 })
                  setSpinBuffer(0)
                },
              })
            }}
            className="fixed left-0 right-0 m-auto h-[128px] w-[128px] rounded-full border-2 border-zinc-300"
          />
          {splashTransition((style, item) => (
            <a.div
              style={style}
              className="h-0 text-xl text-zinc-300"
              key={item}
            >
              <ReactMarkdown>{item}</ReactMarkdown>
            </a.div>
          ))}
          <div className="my-8 mb-8 grid grid-flow-col-dense justify-center gap-4 text-3xl">
            {linkSprings.map(
              (props, index) =>
                links[index].active && (
                  <a.a
                    style={linkSprings[index]}
                    rel="noreferrer"
                    target="_blank"
                    href={links[index].link}
                    key={links[index].icon}
                    onMouseEnter={() => {
                      // @ts-ignore: Type error
                      //e.target.style.color = links[index].color
                      props.color.start(links[index].color)
                      props.scale.start(1.15)
                    }}
                    onMouseLeave={(e) => {
                      // @ts-ignore: Type error
                      //e.target.style.color = link.active ? "rgb(212,212,216)" : "rgb(82,82,86)"
                      props.color.start('#f0f0f0')
                      props.scale.start(1)
                    }}
                  >
                    <Icon icon={links[index].icon} />
                  </a.a>
                ),
            )}
          </div>
          <hr className="mb-4 border-zinc-500" />
          <div className="grid grid-flow-col grid-rows-1 justify-center space-x-2">
            {userData && (
              <>
                <span className="text-zinc-300">
                  <Icon
                    icon="codicon:gist"
                    inline={true}
                    className="inline text-zinc-300"
                  />
                  <CountUp
                    start={0}
                    end={userData.public_gists}
                    useEasing={true}
                    delay={0}
                  >
                    {({ countUpRef }) => <span ref={countUpRef} />}
                  </CountUp>
                </span>
                <span className="text-zinc-300">
                  <Icon
                    icon="mdi:location-enter"
                    inline={true}
                    className="inline text-zinc-300"
                  />
                  <CountUp
                    start={0}
                    end={userData.followers}
                    delay={0}
                    useEasing={true}
                  >
                    {({ countUpRef }) => <span ref={countUpRef} />}
                  </CountUp>
                </span>
                <span className="text-zinc-300">
                  <Icon
                    icon="mdi:location-exit"
                    inline={true}
                    className="inline text-zinc-300"
                  />
                  <CountUp
                    start={0}
                    end={userData.following}
                    delay={0}
                    useEasing={true}
                  >
                    {({ countUpRef }) => <span ref={countUpRef} />}
                  </CountUp>
                </span>
                <span className="text-zinc-300">
                  <Icon
                    icon="mdi:source-repository-multiple"
                    inline={true}
                    className="inline text-zinc-300"
                  />
                  <CountUp
                    start={0}
                    end={userData.public_repos}
                    delay={0}
                    useEasing={true}
                  >
                    {({ countUpRef }) => <span ref={countUpRef} />}
                  </CountUp>
                </span>
              </>
            )}
          </div>
          <p className={`text-lg font-bold text-zinc-300 ${poppins.className}`}>
            Projects
          </p>
          <div className="grid grid-flow-col grid-rows-1 justify-center">
            <div className="text-zinc-300">
              <button
                onClick={() => {
                  setShowLoadSpinner(true)
                  setBgImage(images.bg_2)
                  setContentSpring.start({
                    opacity: 0,
                    scale: 1.2,
                    onChange: (e, ctrl) => {
                      if (e.value.opacity < 0.4) {
                        router.push('/akunda')
                        ctrl.set({
                          opacity: 0,
                          scale: 1.2,
                        })
                      }
                    },
                  })
                }}
              >
                <Icon
                  icon="material-symbols:lock"
                  inline={true}
                  className="inline text-zinc-300"
                />
              </button>
              <button
                onClick={() => {
                  setContentSpring.start({
                    opacity: 0,
                    scale: 1.2,
                    onChange: (e, ctrl) => {
                      if (e.value.opacity < 0.4) {
                        setPreviousPage('/')
                        router.push('/mcremote')
                        ctrl.set({
                          opacity: 0,
                          scale: 1.2,
                        })
                      }
                    },
                  })
                }}
              >
                <Icon
                  icon="clarity:block-line"
                  inline={true}
                  className="inline text-zinc-300"
                />
              </button>
              <button
                onClick={() => {
                  setContentSpring.start({
                    opacity: 0,
                    scale: 1.2,
                    onChange: (e, ctrl) => {
                      if (e.value.opacity < 0.2) {
                        setPreviousPage('/')
                        router.push('/terminal')
                        ctrl.set({
                          opacity: 0,
                          scale: 1.2,
                        })
                      }
                    },
                  })
                }}
              >
                <Icon
                  icon="material-symbols:terminal"
                  inline={true}
                  className="inline text-zinc-300"
                />
              </button>
            </div>
          </div>
        </div>
      </a.div>
    </>
  )
}
