import { db } from '#server/utils/db'
import { user_t } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    const { username, password, secret } = await readBody(event)

    if (!secret || secret !== process.env.ADMIN_PASSWORD) {
        throw createError({ statusCode: 403, statusMessage: 'Nicht autorisiert' })
    }

    if (!username || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Name und Passwort erforderlich' })
    }

    const password_hash = await hashPassword(password)

    await db.insert(user_t).values({
        username: username,
        password: password_hash
    })

    return { success: true, message: `User '${username}' created!` }
})
