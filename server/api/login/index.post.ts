import { eq } from 'drizzle-orm'
import { db } from '#server/utils/db'
import { user_t } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody(event)

    if (!username || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Benutzername und Passwort erforderlich' })
    }

    const user = db.select().from(user_t).where(eq(user_t.username, username)).get()

    if (!(await verifyPassword(user.password, password))) {
        throw createError({ statusCode: 401, statusMessage: 'Ungültige Anmeldedaten' })
    }

    await setUserSession(event, {
        user: { id: user.id, username: user.username }
    }, {
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true }
})

