import images from '@/data/images.json'
import splashes from '@/data/splashes.json'
import { atom } from 'jotai'

export const loadedImagesAtom = atom<string[]>([])

export const bgImageAtom = atom<string>(images.bg_1)

export const splashTextAtom = atom<string>(splashes[0])

export const previousPageAtom = atom<string>('')

export const showLoadSpinnerAtom = atom<boolean>(false)

export const fingerprintAtom = atom<string>('')

export const bgPosAtom = atom<Pos>({ x: 0, y: 0 })
