import { eq } from 'drizzle-orm'
import { db } from '#server/utils/db'
import { creditor_t } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Ungültige ID' })

    const body = await readBody(event)
    if (!body.name || !body.name.trim()) {
        throw createError({ statusCode: 400, statusMessage: 'Name ist erforderlich' })
    }

    await db.update(creditor_t)
        .set({ name: body.name.trim() })
        .where(eq(creditor_t.id, Number(id)))

    return { success: true }
})
