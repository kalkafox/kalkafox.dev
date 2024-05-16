import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return <p>WIP</p>
}
