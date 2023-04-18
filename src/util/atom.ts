import { atom } from 'jotai'
import images from '@/data/images.json'
import splashes from '@/data/splashes.json'

export const loadedImagesAtom = atom<string[]>([])

export const bgImageAtom = atom<string>(images.bg_1)

export const splashTextAtom = atom<string>(splashes[0])
