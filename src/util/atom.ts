import { atom } from 'jotai'
import images from '@/data/images.json'

export const loadedImagesAtom = atom<string[]>([])

export const bgImageAtom = atom<string>(images.bg_1)
