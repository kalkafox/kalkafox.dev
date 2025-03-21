import { atom } from 'jotai'

export const modelReadyAtom = atom(false)

export const boundingClientRectAtom = atom<DOMRect>()
