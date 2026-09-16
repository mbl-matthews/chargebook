import { db } from '../../utils/db'
import { creditor_t } from '../../db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    const body = await readBody<{ name: string }>(event)
    const inserted = await db.insert(creditor_t).values({ name: body.name }).returning()
    return inserted[0]
})
