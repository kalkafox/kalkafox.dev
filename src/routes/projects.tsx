import { FileRoute } from '@tanstack/react-router'

export const Route = new FileRoute('/projects').createRoute({
  component: Projects,
})

function Projects() {
  return <p>WIP</p>
}
