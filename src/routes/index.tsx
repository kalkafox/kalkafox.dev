import { FileRoute } from '@tanstack/react-router'

import { Icon } from '@iconify/react'
import { PrideFlag } from '@/components/pride-flag'

export const Route = new FileRoute('/').createRoute({
  component: Index,
})

function Index() {
  return (
    <div className="font-['Urbanist']">
      <div className="flex flex-1 flex-col items-start">
        <div className="flex items-center gap-x-2 py-4 text-4xl">
          <Icon icon="mdi:paw" className="inline -rotate-12" />
          <p>Hi there!</p>
          <PrideFlag />
        </div>
        <p className="text-lg">
          I make things go beep boop. This site serves as a placeholder for some
          of my web dev practice, as well as any projects I intend to showcase.
        </p>
        <p className="my-2 text-lg">
          I am a self-taught developer. For the most part, I find myself
          sketching out ideas or writing prototypes in many different areas.
          Thanks to many open source libraries, I am able to experiment and
          tinker around with things that pique my interest.
        </p>
        <p className="my-2 text-lg">
          My future plans involve integrating some sort of blog where I can post
          stuff (and work out some different designs too!)
        </p>
        <p className="my-2 text-lg">
          Most of what you see will probably be barren or otherwise works in
          progress, but feel free to look around!
        </p>
      </div>
    </div>
  )
}
