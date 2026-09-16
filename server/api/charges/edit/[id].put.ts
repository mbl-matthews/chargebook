import { eq } from 'drizzle-orm'
import { db } from '#server/utils/db'
import { charge_t } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Unknown ID' })
    }

    const body = await readBody(event)

    await db.update(charge_t)
        .set({
            creditor_id: Number(body.creditor_id),
            amount: Number(body.amount),
            created_at: body.created_at,
            posted_at: body.posted_at || null,
        })
        .where(eq(charge_t.id, Number(id)))

    return { success: true }
})
