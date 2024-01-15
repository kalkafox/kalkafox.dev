import { FileRoute } from '@tanstack/react-router'

import IndexContent from '@/mdx/index.mdx'

export const Route = new FileRoute('/').createRoute({
  component: Index,
})

function Index() {
  return (
    <div className="font-['Urbanist']">
      <IndexContent />
    </div>
  )
}
