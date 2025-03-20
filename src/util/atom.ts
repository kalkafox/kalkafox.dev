import { WritableAtom, atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { RefObject } from 'react'

export function atomWithToggleAndStorage(
  key: string,
  initialValue?: boolean,
  storage?: any,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atomWithStorage(key, initialValue, storage)
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue?: boolean) => {
      const update = nextValue ?? !get(anAtom)
      void set(anAtom, update)
    },
  )

  return derivedAtom as WritableAtom<boolean, [boolean?], void>
}

export const mainStore = createStore()

export const errorDecorationAtom = atom(false)

export const nerdStatsAtom = atom<NerdStats>({ initialTime: Date.now() })

export const navOffsetAtom = atom(0)

export const renderReadyAtom = atom(false)

export const reducedMotionAtom = atomWithToggleAndStorage(
  'reducedMotion',
  false,
)

export const docRefAtom = atom<RefObject<HTMLCanvasElement>>()
