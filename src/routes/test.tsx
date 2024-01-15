import { FileRoute } from '@tanstack/react-router'

import Test from '@/mdx/test.mdx'

export const Route = new FileRoute('/test').createRoute({
  component: TestComponent,
})

function TestComponent() {
  return (
    <>
      <h3>owo</h3>
      <Test />
      {Array.from({ length: 512 ^ 2 }).map((_, i) => {
        return <div key={i}>ow</div>
      })}
    </>
  )
}
