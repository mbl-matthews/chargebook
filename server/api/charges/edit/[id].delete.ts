import { eq } from 'drizzle-orm'
import { db } from '#server/utils/db'
import { charge_t } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Unknown ID' })
    }

    await db.delete(charge_t)
        .where(eq(charge_t.id, Number(id)))

    return { success: true }
})