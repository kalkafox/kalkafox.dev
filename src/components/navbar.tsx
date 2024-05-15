import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { errorDecorationAtom } from '@/util/atom'
import moonPhase from '@/util/moon-phase'
import { Icon } from '@iconify/react'
import { animated, useSpring } from '@react-spring/web'
import { Link } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'

import Image from './image'

function Footer({ links }: { links: JSX.Element[] }) {
  const [open, setOpen] = useState(false)

  const [textRender, setTextRender] = useState(false)

  const [textSpring, textSpringApi] = useSpring(() => ({
    x: 10,
    opacity: 0,
    config: { tension: 200 },
  }))
  const [footerSpring, footerSpringApi] = useSpring(() => ({ width: 36 }))

  useEffect(() => {
    const doAnimation = async () => {
      if (open) {
        setTextRender(true)
        textSpringApi.start({
          x: -30,
          opacity: 1,
        })

        footerSpringApi.start({
          width: 135,
        })
      } else {
        textSpring.x.start(10)
        footerSpring.width.start(36)
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
        <DropdownMenuTrigger className="relative">
          <Icon className="h-5 w-5" icon="ci:hamburger-lg" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
              <Icon className="h-5 w-5" icon="mdi:github" />
              <span>View project on GitHub</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center justify-center gap-x-2">
            <a href="https://www.moongiant.com/phase/today/" target="_blank">
              Current moon phase:{' '}
              <Icon className="inline h-5 w-5" icon={moonPhase()} />
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {textRender ? (
        <animated.div className="absolute -z-10 w-20" style={textSpring}>
          <DecorateWrapper className="text-sm font-bold">Kalka</DecorateWrapper>
        </animated.div>
      ) : null}
    </animated.div>
  )
}

function Navbar() {
  const [smolNav, setSmolNav] = useState(false)

  const [errorDecoration, setErrorDecoration] = useAtom(errorDecorationAtom)

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const imageSpring = useSpring({
    width: 48,
    height: 48,
  })

  const linkSpring = useSpring({
    x: 0,
  })

  useEffect(() => {
    const bSmolNav = smolNav && window.scrollY > 0
    const imgSize = bSmolNav ? 24 : 48
    imageSpring.width.start(imgSize)
    imageSpring.height.start(imgSize)
  }, [smolNav])

  useEffect(() => {
    const navFunc = () => {
      setSmolNav(window.scrollY > 0)
    }

    window.addEventListener('scroll', navFunc)

    return () => {
      window.removeEventListener('scroll', navFunc)
    }
  }, [])

  const links = [
    <Link
      to="/"
      className="transition-all"
      activeProps={{
        className: '',
      }}
      onClick={() => {
        setErrorDecoration(false)
      }}
      activeOptions={{ exact: true }}
    >
      {({ isActive }) => {
        return (
          <DecorateWrapper
            isActive={isActive}
            className={` transition-all max-lg:text-sm max-sm:text-sm portrait:text-sm ${
              smolNav ? 'max-2xl:text-lg' : 'max-2xl:text-3xl'
            }`}
          >
            Kalka
          </DecorateWrapper>
        )
      }}
    </Link>,
    <Link
      to={'/projects'}
      onClick={() => {
        setErrorDecoration(false)
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
        setErrorDecoration(false)
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
      <nav className="relative left-0 right-0 m-auto my-2 flex w-[60%] items-center gap-x-1 rounded-lg bg-neutral-900/50 p-2 backdrop-blur-sm transition-all heropattern-floatingcogs-stone-900/50 portrait:w-[90%]">
        <animated.div style={imageSpring} className="h-12 w-12 rounded-lg">
          <Image
            className="rounded-lg"
            src={'https://avatars.githubusercontent.com/u/9144208?s=48'}
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
              <div key={i}>{el}</div>
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
      </nav>
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
