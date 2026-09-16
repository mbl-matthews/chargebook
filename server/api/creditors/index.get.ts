import { db } from '#server/utils/db'
import { creditor_t } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    return await db.select().from(creditor_t)
})
