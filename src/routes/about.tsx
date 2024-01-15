import { FileRoute } from '@tanstack/react-router'

export const Route = new FileRoute('/about').createRoute({
  component: AboutComponent,
})

function AboutComponent() {
  return <h3>About</h3>
}
