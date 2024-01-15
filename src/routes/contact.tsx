import { FileRoute } from '@tanstack/react-router'

export const Route = new FileRoute('/contact').createRoute({
  component: Contact,
})

function Contact() {
  return <p>WIP</p>
}
