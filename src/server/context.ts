//import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server'
import { inferAsyncReturnType } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
export const createContext = (opts: CreateNextContextOptions) => {
  //const { userId } = getAuth(opts.req)
  return {}
}

export type Context = inferAsyncReturnType<typeof createContext>
