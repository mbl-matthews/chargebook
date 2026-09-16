import { defineNuxtRouteMiddleware } from "nuxt/app"

export default defineNuxtRouteMiddleware((to) => {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value && to.path !== '/login') {
        return navigateTo('/login')
    }
})
