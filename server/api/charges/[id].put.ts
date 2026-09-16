import { eq } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { charge_t } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody<{ posted_at: string | null }>(event)

    return await db.update(charge_t)
        .set({ posted_at: body.posted_at })
        .where(eq(charge_t.id, Number(id)))
        .returning()
})
