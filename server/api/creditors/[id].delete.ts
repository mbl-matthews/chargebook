import { eq } from 'drizzle-orm'
import { db } from '#server/utils/db'
import { creditor_t } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Ungültige ID' })

    await db.delete(creditor_t)
        .where(eq(creditor_t.id, Number(id)))

    return { success: true }
})
