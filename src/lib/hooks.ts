import { useState } from 'react'
import { splashes } from './splashes'

export function useSplash() {
  const getRandomSplash = () =>
    splashes[Math.floor(Math.random() * splashes.length)]

  const [splash, setSplash] = useState(splashes[0])

  const changeSplash = () => {
    let newSplash
    do {
      newSplash = getRandomSplash()
    } while (newSplash === splash) // Ensures a different splash text
    setSplash(newSplash)
  }

  return [splash, changeSplash] as const
}
