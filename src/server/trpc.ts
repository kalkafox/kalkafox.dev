import { initTRPC } from '@trpc/server'
import { Context } from './context'

import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

// const isAuthed = t.middleware(({ next, ctx }) => {
//   if (!ctx.userId) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' })
//   }

//   return next({
//     ctx: {
//       auth: ctx.userId,
//     },
//   })
// })

export const router = t.router
export const procedure = t.procedure
//export const protectedProcedure = procedure.use(isAuthed)
