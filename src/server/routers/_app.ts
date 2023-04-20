import { procedure, router } from '@/server/trpc'
import { GitHubUser } from '@/types/github'
import redis from '@/util/upstash'
import 'xterm/css/xterm.css'
import { z } from 'zod'

export const appRouter = router({
  fetchGithub: procedure.query(async ({ ctx }) => {
    const now = new Date()
    const a = (await redis.incr('github_cache_hits')) - 1

    if (a % 100 === 0) {
      const res = await fetch('https://api.github.com/users/kalkafox')
      const json = (await res.json()) as GitHubUser
      await redis.set('github_user', JSON.stringify(json))
    }

    const b = await redis.get('github_user')
    console.log(
      `Redis cache hit took ${new Date().getTime() - now.getTime()}ms`,
    )
    return b as GitHubUser
  }),
  incrementSpin: procedure.input(z.string()).mutation(async ({ input }) => {
    const a = await redis.incr(input)
    return a
  }),
})

export type AppRouter = typeof appRouter
