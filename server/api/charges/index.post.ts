import { db } from '../../utils/db'
import { charge_t } from '../../db/schema'
import type { CreateChargeInput } from '#shared/types/types.ts'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const body = await readBody<CreateChargeInput>(event)

    const newCharge = await db.insert(charge_t).values({
        creditor_id: body.creditor_id,
        amount: body.amount,
        created_at: body.created_at,
        posted_at: body.posted_at ?? null,
    }).returning()

    return newCharge[0]
})
