<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4" elevation="3">
          <AppLogo :size="64" class="mb-2" />
          <v-form @submit.prevent="login" class="mt-4">
            <v-text-field v-model="username" label="Benutzername" variant="outlined" />
            <v-text-field v-model="password" label="Passwort" type="password" variant="outlined" :error-messages="error"/>
            <v-btn type="submit" color="primary" block size="large" class="mt-2">
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const password = ref('')
const username = ref('')
const error = ref('')
const { fetch: refreshSession } = useUserSession()

async function login() {
  try {
    await $fetch('/api/login', { method: 'POST', body: { username: username.value, password: password.value } })
    await refreshSession()
    navigateTo('/')
  } catch (e) {
    error.value = 'Falsches Passwort'
  }
}
</script>