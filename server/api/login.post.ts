export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (body.password === process.env.ADMIN_PASSWORD) {
        await setUserSession(event, { user: { role: 'admin' } })
        return { success: true }
    }
    throw createError({ statusCode: 401, statusMessage: 'Wrong Password' })
})
