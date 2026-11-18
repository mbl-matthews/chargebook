import { eq, and, like, isNotNull } from 'drizzle-orm'
import { db } from './../../../../server/utils/db'
import { charge_t, creditor_t } from './../../../../server/db/schema'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const query = getQuery(event)

    if (!query.creditor_id || !query.year) {
        throw createError({ statusCode: 400, statusMessage: 'Parameter fehlen' })
    }

    // Namen des Creditors abrufen
    const creditor = await db.select().from(creditor_t)
        .where(and(
            eq(creditor_t.id, Number(query.creditor_id)),
            eq(creditor_t.user_id, (session.user as any).id)
        )).get()

    if (!creditor) {
        throw createError({ statusCode: 404, statusMessage: 'Person/Ladepunkt nicht gefunden' })
    }

    // Alle bezahlten Einträge des Jahres abrufen
    const charges = await db.select()
        .from(charge_t)
        .where(and(
            eq(charge_t.user_id, (session.user as any).id),
            eq(charge_t.creditor_id, Number(query.creditor_id)),
            isNotNull(charge_t.posted_at),
            like(charge_t.created_at, `${query.year}-%`) // Filtert nach YYYY
        ))
        .orderBy(charge_t.created_at)

    return { creditor, charges }
})
