import { motion } from 'motion/react'
import { PrideFlag } from './components/pride-flag'
import { Separator } from './components/ui/separator'
import { Icon } from '@iconify/react'
import { lazy } from 'react'

const Avatar = lazy(() => import('@/components/avatar'))

function App() {
  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 w-[500px] rounded-lg bg-neutral-900/20 p-2 font-['Overpass_Variable'] backdrop-blur-sm"
      >
        <div className="my-4 flex items-center justify-between">
          <motion.div className="w-38 text-center font-['VT323'] text-5xl">
            kalkafox
          </motion.div>

          <Avatar />

          <motion.div className="p-4">
            <PrideFlag />
          </motion.div>
        </div>
        <Separator />
        <p className="p-4">
          Huge nerd of everything. Self-taught developer and mostly doing things
          as a hobby.
        </p>

        <p className="p-4">
          I barely complete projects and mostly tinker and experiment with
          things when I do feel like it. I did complete one web project (mostly)
          but I often spend time learning other languages. You can see that{' '}
          <a
            className="text-neutral-500"
            href="https://kalkafox.github.io/mengenlehreuhr"
            target="_blank"
          >
            here.
          </a>
        </p>

        <div className="flex flex-col gap-2 p-4 text-xl text-neutral-400">
          <div className="flex items-center gap-2 transition-colors hover:text-neutral-300">
            <Icon icon="line-md:github-loop" />
            <a target="_blank" href="https://github.com/kalkafox">
              kalkafox
            </a>
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-neutral-300">
            <Icon icon="line-md:discord" />
            kalkafox.dev
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-neutral-300">
            <Icon icon="line-md:telegram" />
            <a target="_blank" href="https://t.me/kalkaio">
              @kalkaio
            </a>
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-neutral-300">
            <Icon icon="line-md:youtube-filled" />
            <a target="_blank" href="https://youtube.com/Wielder432">
              Kalka
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default App
