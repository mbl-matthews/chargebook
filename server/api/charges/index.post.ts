import { db } from '../../utils/db'
import { charge_t } from '../../db/schema'
import type { CreateChargeInput } from '#shared/types/types.ts'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = (session.user as any).id
    const body = await readBody<CreateChargeInput>(event)

    const newCharge = await db.insert(charge_t).values({
        user_id: userId,
        creditor_id: body.creditor_id,
        amount: body.amount,
        created_at: body.created_at,
        posted_at: body.posted_at ?? null,
    }).returning()

    return newCharge[0]
})
