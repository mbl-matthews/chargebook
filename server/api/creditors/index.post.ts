import { db } from '../../utils/db'
import { creditor_t } from '../../db/schema'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = (session.user as any).id

    const body = await readBody<{ name: string }>(event)
    const inserted = await db.insert(creditor_t).values({ name: body.name, user_id: userId }).returning()
    return inserted[0]
})
