import { db } from '#server/utils/db'
import {charge_t, creditor_t} from '#server/db/schema'
import {eq} from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = (session.user as any).id

    return await db.select().from(creditor_t).where(eq(creditor_t.user_id, userId))
})
