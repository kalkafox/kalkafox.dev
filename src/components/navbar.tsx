import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import {
  errorDecorationAtom,
  navOffsetAtom,
  nerdStatsAtom,
  reducedMotionAtom,
} from '@/util/atom'
import _moonPhase from '@/util/moon-phase'
import { Icon } from '@iconify-icon/react'
import { animated, SpringValue, useSpring } from '@react-spring/web'
import { Link } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

import Image from './image'
import { getUserAvatarURL } from '@/util/gravatar'

function Footer({ links }: { links: JSX.Element[] }) {
  const [open, setOpen] = useState(false)
  const [hoverCardOpen, setHoverCardOpen] = useState(false)

  const [reducedMotion, setReducedMotion] = useAtom(reducedMotionAtom)

  const [nerdStats, _setNerdStats] = useAtom(nerdStatsAtom)

  const [_textRender, setTextRender] = useState(false)

  const [textSpring, textSpringApi] = useSpring(() => ({
    x: 10,
    opacity: 0,
    config: { tension: 200 },
  }))
  const [footerSpring, _footerSpringApi] = useSpring(() => ({ width: 36 }))

  // const foxData = useQuery({
  //   queryKey: ['foxImg'],
  //   queryFn: async () => {
  //     const res = await ky('https://randomfox.ca/floof')

  //     return await res.json<FoxData>()
  //   },
  // })

  useEffect(() => {
    const doAnimation = async () => {
      if (open) {
        setTextRender(true)
        textSpringApi.start({
          x: -30,
          opacity: 1,
        })

        // footerSpringApi.start({
        //   width: 135,
        // })
      } else {
        textSpring.x.start(10)
        //footerSpring.width.start(36)
        await textSpring.opacity.start(0)
        setTextRender(false)
      }
    }

    doAnimation()
  }, [open])

  return (
    <animated.div
      style={footerSpring}
      className="absolute right-0 m-4 flex items-center justify-end gap-x-1 rounded-br-lg rounded-tl-lg bg-stone-900/80 p-2 backdrop-blur-lg"
    >
      {/* <a href='https://github.com/kalkafox/kalkafox.dev' target='_blank'>
        <Icon className='w-5 h-5' icon='ci:hamburger-lg' />
      </a> */}
      <DropdownMenu
        onOpenChange={async (isOpen) => {
          setOpen(isOpen)
        }}
      >
        {/* {window.innerWidth > 850 ? links : links.slice(0, -1)} */}
        <DropdownMenuTrigger>
          <Icon width={18} height={18} icon="ci:hamburger-lg" inline={true} />
        </DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
          {window.innerWidth < 850
            ? links
                .slice(-1)
                .map((el, i) => (
                  <DropdownMenuItem key={i}>{el}</DropdownMenuItem>
                ))
            : null}
          <DropdownMenuItem>
            <a
              className="flex items-center gap-x-2"
              href="https://github.com/kalkafox/kalkafox.dev"
              target="_blank"
            >
              <Icon width={22} icon="mdi:github" inline={true} />
              <span>View project on GitHub</span>
            </a>
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center justify-center gap-x-2">
            <a href="https://www.moongiant.com/phase/today/" target="_blank">
              Current moon phase:{' '}
              <Icon className="inline h-5 w-5" icon={moonPhase()} />
            </a>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="flex items-center gap-x-2"
          >
            <Icon width={22} icon="mdi:motion" inline={true} />
            <span>Reduce motion</span>
            <Switch
              checked={reducedMotion}
              onCheckedChange={(e) => setReducedMotion(e)}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <TooltipProvider>
            <Tooltip
              open={hoverCardOpen}
              onOpenChange={(e) => {
                setHoverCardOpen(e)
              }}
            >
              <TooltipTrigger
                onClick={(e) => e.preventDefault()}
                onSelect={(e) => e.preventDefault()}
              >
                <DropdownMenuItem
                  onClick={(e) => e.preventDefault()}
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                  className="flex items-center gap-x-2"
                >
                  <Icon
                    width={22}
                    icon="material-symbols:info-outline"
                    inline={true}
                  />
                  Nerd stats
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent
                side={'bottom'}
                onSelect={(e) => e.preventDefault()}
              >
                <div>
                  {nerdStats.timeTo3DRender && nerdStats.timeTo3DRender !== 0
                    ? 'time to 3d render: ' + nerdStats.timeTo3DRender + 'ms'
                    : ''}
                </div>
                <div>
                  {nerdStats.timeToReactRender &&
                  nerdStats.timeToReactRender !== 0
                    ? 'time to react render: ' +
                      nerdStats.timeToReactRender +
                      'ms'
                    : ''}
                </div>
                <div>
                  {nerdStats.timeToLoadReact && nerdStats.timeToLoadReact !== 0
                    ? 'time to load react: ' + nerdStats.timeToLoadReact + 'ms'
                    : ''}
                </div>
                <div>
                  {nerdStats.timeToPageLoad && nerdStats.timeToPageLoad !== 0
                    ? 'time to page load: ' + nerdStats.timeToPageLoad + 'ms'
                    : ''}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* {textRender ? (
        <animated.div className="absolute -z-10 w-20" style={textSpring}>
          <DecorateWrapper className="text-sm font-bold">Kalka</DecorateWrapper>
        </animated.div>
      ) : null} */}
    </animated.div>
  )
}

function Navbar({
  style,
}: {
  style: {
    opacity: SpringValue<number>
    scale: SpringValue<number>
  }
}) {
  const navRef = useRef<HTMLDivElement>(null)

  const [errorDecoration, setErrorDecoration] = useAtom(errorDecorationAtom)

  const [imageSize, setImageSize] = useState({ width: 48, height: 48 })

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const [imageSpring, imageSpringApi] = useSpring(() => ({
    width: imageSize.width,
    height: imageSize.height,
  }))

  const linkSpring = useSpring({
    x: 0,
  })

  const [_navOffset, setNavOffset] = useAtom(navOffsetAtom)

  const [smolNav, setSmolNav] = useState(false)

  const postLinkClick = () => {
    console.log('hi')

    setImageSize({ width: 48, height: 48 })

    window.scrollTo({ top: 0 })

    if (smolNav) {
      imageSpringApi.set({
        width: 48,
        height: 48,
      })
    }

    setSmolNav(false)

    setErrorDecoration(false)
  }

  const links = [
    <Link
      to="/"
      className="transition-all"
      activeProps={{
        className: '',
      }}
      onClick={() => {
        postLinkClick()
      }}
      activeOptions={{ exact: true }}
    >
      {({ isActive }) => {
        return (
          <DecorateWrapper
            isActive={isActive}
            className={`transition-all max-lg:text-sm max-sm:text-sm portrait:text-sm`}
          >
            Kalka
          </DecorateWrapper>
        )
      }}
    </Link>,
    <Link
      to={'/projects'}
      onClick={() => {
        postLinkClick()
      }}
      className="transition-all portrait:text-sm"
      activeProps={{
        className: '',
      }}
    >
      {({ isActive }) => {
        return <DecorateWrapper isActive={isActive}>Projects</DecorateWrapper>
      }}
    </Link>,
    <Link
      to={'/contact'}
      className=""
      onClick={() => {
        postLinkClick()
      }}
      activeProps={{
        className: '',
      }}
    >
      {({ isActive }) => {
        return (
          <DecorateWrapper className={`portrait:text-sm`} isActive={isActive}>
            Contact
          </DecorateWrapper>
        )
      }}
    </Link>,
  ]

  useEffect(() => {
    const bSmolNav = smolNav

    const imgSize = bSmolNav ? 24 : 48
    // imageSpring.width.start(imgSize)
    // imageSpring.height.start(imgSize)

    if (bSmolNav) {
      setNavOffset(navRef.current?.clientHeight!)
      imageSpringApi.start({
        width: 24,
        height: 24,
        // onChange: () => {
        //   setNavOffset(navRef.current?.clientHeight!)
        // },
      })
      setImageSize({
        width: 24,
        height: 24,
      })
    } else {
      imageSpringApi.start({
        width: 48,
        height: 48,
        // onStart: () => {
        //   console.log('hi this happened')
        // },
      })
      // setImageSize({
      //   width: 48,
      //   height: 48,
      // })
    }

    setImageSize({ width: imgSize, height: imgSize })
  }, [smolNav])

  useEffect(() => {
    setNavOffset(navRef.current?.clientHeight!)

    const navFunc = () => {
      if (window.scrollY > 0) {
        setImageSize({
          width: 24,
          height: 24,
        })
        setSmolNav(true)
      }
      if (window.scrollY === 0) {
        setImageSize({
          width: 48,
          height: 48,
        })
        setSmolNav(false)
      }
    }

    window.addEventListener('scroll', navFunc)

    return () => {
      window.removeEventListener('scroll', navFunc)
    }
  }, [])

  useEffect(() => {
    const setSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    setSize()

    window.onresize = setSize
  }, [])

  return (
    <>
      <animated.nav
        style={style}
        ref={navRef}
        className={`fixed left-0 right-0 z-10 m-auto my-6 flex w-[60%] items-center gap-x-1 rounded-lg transition-colors ${smolNav ? 'bg-neutral-900/80' : 'bg-neutral-900/50'} p-2 heropattern-floatingcogs-stone-900/50 portrait:w-[90%]`}
      >
        <animated.div style={imageSpring} className="h-12 w-12 rounded-lg">
          <Image
            className="rounded-lg"
            //src={'https://avatars.githubusercontent.com/u/9144208?s=48'}
            src={getUserAvatarURL('kalka2088@gmail.com')}
          />
        </animated.div>
        {/* <div className='text-xs w-0'>does the font look different?</div> */}
        {/* <SyntaxHighlighter language='tsx'>{'<Kalka />'}</SyntaxHighlighter> */}
        <animated.div
          style={linkSpring}
          className="mx-2 flex items-center gap-x-2"
        >
          {/* {windowSize.width < 800 ? links.slice(0, -1) : links.map((e) => e)} */}
          {(windowSize.width > 850 ? links : links.slice(0, -1)).map(
            (el, i) => (
              <div key={i} className="font-bold">
                {el}
              </div>
            ),
          )}
          {/* <Link
            to='/'
            className='transition-all'
            activeProps={{
              className: 'font-bold',
            }}
            onClick={() => {
              setErrorDecoration(false)
            }}
            activeOptions={{ exact: true }}>
            {({ isActive }) => {
              return (
                <DecorateWrapper
                  isActive={isActive}
                  className={` max-sm:text-sm max-lg:text-sm portrait:text-sm transition-all ${
                    smolNav ? 'text-lg' : 'text-3xl'
                  }`}>
                  Kalka
                </DecorateWrapper>
              )
            }}
          </Link>
          <Link
            to={'/about'}
            className=''
            onClick={() => {
              setErrorDecoration(false)
            }}
            activeProps={{
              className: 'font-bold',
            }}>
            {({ isActive }) => {
              return (
                <DecorateWrapper
                  className={`portrait:text-sm`}
                  isActive={isActive}>
                  About
                </DecorateWrapper>
              )
            }}
          </Link>
          <Link
            to={'/test'}
            onClick={() => {
              setErrorDecoration(false)
            }}
            className='transition-all portrait:text-sm'
            activeProps={{
              className: 'font-bold',
            }}>
            {({ isActive }) => {
              return (
                <DecorateWrapper isActive={isActive}>
                  Test Route
                </DecorateWrapper>
              )
            }}
          </Link> */}
          {errorDecoration ? (
            <span className="text-red-500 underline decoration-wavy">
              <DecorateWrapper>
                {/* this will need to be changed if switching to ssr/next */}
                {window.location.href.split('/').slice(-1)[0]}
              </DecorateWrapper>
            </span>
          ) : null}
        </animated.div>

        <Footer links={links} />
      </animated.nav>
    </>
  )
}

function DecorateWrapper({
  isActive = false,
  style,
  children,
  className,
}: {
  className?: string | undefined
  isActive?: boolean
  children: ReactNode
  style?: CSSProperties
}) {
  // const isLoaded = useAtomValue(fontsLoadedAtom)

  // if (!isLoaded)
  //   return (
  //     <div
  //       style={{
  //         width: typeof children === 'string' ? children.length * 16 : 96,
  //       }}
  //       className='w-24 h-6 bg-stone-800 animate-pulse rounded-lg text-opacity-0'>
  //       <div className='font-["Fira_Mono"] opacity-0 '>a</div>
  //     </div>
  //   )

  return (
    <div style={style} className={`font-["Fira_Mono"] ${className}`}>
      <span
        className={`transition-colors ${
          isActive ? 'text-stone-300' : 'text-stone-700'
        }`}
      >
        {'<'}
      </span>
      <span className="text-red-900">{children}</span>
      <div
        className={`relative inline transition-colors ${
          isActive ? 'text-stone-300' : 'text-stone-700'
        }`}
      >
        {' />'}
      </div>
    </div>
  )
}

export default Navbar
