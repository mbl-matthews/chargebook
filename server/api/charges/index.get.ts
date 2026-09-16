import { eq, isNull, desc } from 'drizzle-orm'
import { db } from '../../utils/db'
import { charge_t, creditor_t } from '../../db/schema'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const query = getQuery(event)

    const baseQuery = db.select({
        id: charge_t.id,
        creditor_id: charge_t.creditor_id,
        creditor_name: creditor_t.name,
        amount: charge_t.amount,
        created_at: charge_t.created_at,
        posted_at: charge_t.posted_at,
    })
        .from(charge_t)
        .innerJoin(creditor_t, eq(charge_t.creditor_id, creditor_t.id))
        .orderBy(desc(charge_t.created_at), desc(charge_t.id))

    if (query.unpaidOnly === 'true') {
        return await baseQuery.where(isNull(charge_t.posted_at))
    }

    return await baseQuery
})