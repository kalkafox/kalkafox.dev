import { z } from 'zod'
import { procedure, router } from '@/server/trpc'
import redis from '@/util/upstash'
import { GitHubUser } from '@/types/github'

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
})

export type AppRouter = typeof appRouter
