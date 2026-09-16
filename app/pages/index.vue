<!-- app/pages/index.vue -->
<template>
  <v-overlay
      :model-value="overlay"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <v-fab
      v-if="isSelectMode"
      app
      variant="elevated"
      color="green"
      class="text-primary mr-2"
      :disabled="selectedIds.length === 0"
      @click="openPayDialog"
      icon="mdi-content-save"
  >
  </v-fab>
  <v-container class="max-width-lg">
    <div class="sticky-header bg-background mb-5 px-4 px-sm-0 pt-4 pb-2">
    <v-row>
      <v-col cols="12" class="d-flex align-center">
        <AppLogo :size="256" class="mr-3" />
      </v-col>
    </v-row>
    <!-- Header mit Aktionen -->
    <v-row class="mb-4" align="center" justify="center">
      <v-col cols="auto">
        <v-btn prepend-icon="mdi-account-plus" color="primary" class="mr-2" @click="dialogCreditors = true">
        Creditor
        </v-btn>
        <v-btn prepend-icon="mdi-battery-plus" color="primary" class="mr-2" @click="dialogCharge = true">
        Charge
        </v-btn>
        <v-btn icon="mdi-logout" size="small" color="error" @click="logout">
        </v-btn>
      </v-col>
    </v-row>
    <v-row density="compact" class="my-n4">
      <v-col>
        <v-switch
            v-model="unpaidOnly"
            label="Unpaid"
            color="primary"
            hide-details
            class="mb-4"
        />
      </v-col>
    </v-row>
    <!-- Auswahl-Leiste (Erscheint nur im Select-Modus) -->
    <v-row v-if="isSelectMode" density="compact" >
      <v-col>
        <v-slide-y-transition>
          <v-card  color="primary" class="mb-4 pa-3 d-flex align-center">
            <v-checkbox-btn
                v-model="selectAll"
                color="white"
                class="mr-3"
                label="All"
            />
            <span class="font-weight-bold text-white mr-4">
          Sum: {{ selectedSum.toFixed(2) }} kWh
        </span>
            <v-btn icon outlined variant="text" color="grey" size="small" @click="exitSelectMode">
              Close
            </v-btn>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
      <v-divider class="mx-n4 my-n2 mx-sm-0"></v-divider>
    </div>
    <!-- Liste als Cards -->
    <v-row v-if="charges && charges.length > 0" density="compact">
      <v-col cols="12" v-for="item in charges" :key="item.id">
        <v-card
            :class="{ 'bg-grey-lighten-4 text-grey': !!item.posted_at }"
            @pointerdown="startPress(item, $event)"
            @pointerup="cancelPress"
            @pointerleave="cancelPress"
            @contextmenu="onContextMenu"
            @click="handleCardClick(item)"
            elevation="3"
        >
          <div class="d-flex align-center pa-4">

            <!-- Checkbox (nur im Select-Modus sichtbar) -->
            <v-checkbox-btn
                v-if="isSelectMode"
                v-model="selectedIds"
                :value="item.id"
                :disabled="!!item.posted_at"
                class="mr-4"
                @click.stop
            />

            <!-- Card Inhalt -->
            <div class="flex-grow-1">
              <div class="d-flex justify-space-between align-center mb-1">
                <v-chip variant="outlined">
                  <span class="text-h6 font-weight-bold">{{ item.amount.toFixed(2) }} kWh</span>
                </v-chip>
                <span class="text-subtitle-1">{{ item.creditor_name }}</span>
              </div>
              <div class="text-label-small font-italic">
                Created: {{ item.created_at }}
                <div v-if="item.posted_at">
                  Posted: {{ item.posted_at }}
                </div>
              </div>
            </div>
            <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                color="grey"
                size="small"
                class="ml-2"
                @click.stop="openEditDialog(item)"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-else class="pa-8 text-center text-grey" elevation="0" border>
      No Charges...
    </v-card>

    <!-- Dialog: Bezahldatum wählen -->
    <v-dialog v-model="dialogPayDate" max-width="400">
      <v-card title="Paydate" class="pa-4">
        <v-container>
          <v-row density="compact">
            <v-col>
              <v-text-field
                  v-model="price"
                  label="Price per kWh"
                  type="number"
                  variant="outlined"
                  class="mt-2"
              />
            </v-col>
          </v-row>
          <v-row class="mt-n3 mb-4" density="compact">
            <v-col>
              <div class="font-italic">
                Price: <span class="font-weight-bold">{{ (price * selectedSum).toFixed(2) }} € </span>
              </div>
            </v-col>
          </v-row>
          <v-row density="compact">
            <v-col>
              <v-text-field
                  v-model="payDate"
                  label="Datum"
                  type="date"
                  variant="outlined"
                  class="mt-2"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="px-0 pb-0 mt-2">
          <v-spacer></v-spacer>
          <v-btn color="grey" outlined variant="text" @click="dialogPayDate = false">Close</v-btn>
          <v-btn color="primary" variant="elevated" @click="confirmPayment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCreditors" max-width="500">
      <v-card title="Manage creditors" class="pa-4">

        <div class="d-flex ga-2 mb-4">
          <v-text-field
              v-model="newCreditorName"
              label="Name"
              variant="outlined"
              density="compact"
              hide-details
              @keyup.enter="addCreditor"
          />
          <v-btn color="primary" height="40" @click="addCreditor">
            Add
          </v-btn>
        </div>

        <v-divider class="mb-2" />

        <v-list density="compact">
          <v-list-item
              v-for="c in creditors || []"
              :key="c.id"
              class="px-0"
          >
            <template v-if="editingCreditorId === c.id">
              <div class="d-flex align-center w-100 ga-2">
                <span class="text-caption text-grey">ID {{ c.id }}</span>
                <v-text-field
                    v-model="editingCreditorName"
                    density="compact"
                    variant="outlined"
                    hide-details
                    autofocus
                    @keyup.enter="saveEditCreditor(c.id)"
                />
                <v-btn
                    icon="mdi-check"
                    color="success"
                    variant="text"
                    size="small"
                    @click="saveEditCreditor(c.id)"
                />
                <v-btn
                    icon="mdi-close"
                    color="error"
                    variant="text"
                    size="small"
                    @click="cancelEditCreditor"
                />
              </div>
            </template>

            <template v-else>
              <div class="d-flex align-center justify-space-between w-100">
                <div>
                  <span class="text-caption text-grey mr-3">ID {{ c.id }}</span>
                  <span class="font-weight-medium">{{ c.name }}</span>
                </div>
                <div>
                  <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="grey"
                      size="small"
                      @click="startEditCreditor(c)"
                  />
                  <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click="deleteCreditor(c.id)"
                  />
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn color="grey" outlined variant="text" @click="dialogCreditors = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Neue Ladung -->
    <v-dialog v-model="dialogCharge" max-width="500">
      <v-card title="New Charge" class="pa-4">
        <v-select
            v-model="newCharge.creditor_id"
            :items="creditors || []"
            item-title="name"
            item-value="id"
            label="Creditor"
            variant="outlined"
            class="mt-2"
        />
        <v-text-field
            v-model.number="newCharge.amount"
            label="kWh"
            type="number"
            step="0.01"
            variant="outlined"
        />
        <v-text-field
            v-model="newCharge.created_at"
            label="Date"
            type="date"
            variant="outlined"
        />
        <v-card-actions>
          <v-btn color="grey" outlined variant="text" @click="dialogCharge = false">Close</v-btn>
          <v-btn color="primary" variant="elevated" @click="addCharge">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-dialog v-model="dialogEdit" max-width="500">
    <v-card title="Eintrag bearbeiten" class="pa-4" v-if="editForm">
      <v-select
          v-model="editForm.creditor_id"
          :items="creditors || []"
          item-title="name"
          item-value="id"
          label="Person / Ladepunkt"
          variant="outlined"
          class="mt-2"
      />
      <v-text-field
          v-model.number="editForm.amount"
          label="Betrag in kWh"
          type="number"
          step="0.01"
          min="0"
          variant="outlined"
      />
      <v-text-field
          v-model="editForm.created_at"
          label="Erfasst am"
          type="date"
          variant="outlined"
      />
      <v-text-field
          v-model="editForm.posted_at"
          label="Bezahlt am (optional)"
          type="date"
          clearable
          variant="outlined"
      />
      <v-card-actions class="px-0 pb-0 mt-2">
        <v-spacer />
        <v-btn color="grey" outlined variant="text" @click="dialogEdit = false">Close</v-btn>
        <v-btn color="primary" variant="elevated" @click="saveEditCharge">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CreateChargeInput, ChargeEntry, Creditor } from '#shared/types/types'

type LoadingCallback = () => any;

// --- Globale Zustände ---
const overlay = ref(false)
const unpaidOnly = ref(false)
const dialogCharge = ref(false)
const newCreditorName = ref('')
const price = ref(0.3)
const dialogEdit = ref(false)
const editForm = ref<{
  id: number
  creditor_id: number
  amount: number
  created_at: string
  posted_at: string | null
}>({
  id: -1,
  creditor_id: -1,
  amount: -1,
  created_at: "1970-01-01",
  posted_at: null,
})
const dialogCreditors = ref(false)
const editingCreditorId = ref<number | null>(null)
const editingCreditorName = ref('')
const dialogPayDate = ref(false)
const payDate = ref(new Date().toISOString().split('T')[0])

const newCharge = ref<CreateChargeInput>({
  creditor_id: 0,
  amount: 0,
  created_at: new Date().toISOString().split('T')[0]
})

// --- API Daten abrufen ---
const { data: creditors, refresh: refreshCreditors } = await useFetch<Creditor[]>('/api/creditors')
const { data: charges, refresh: refreshCharges } = await useFetch<ChargeEntry[]>('/api/charges', {
  query: { unpaidOnly }
})
const { clear } = useUserSession()

watch(creditors, (list) => {
  if (list && list.length > 0) {
    newCharge.value.creditor_id = list[0].id
  }
}, { immediate: true })

watch(unpaidOnly, () => refreshCharges())

// --- SELECTION / LONG-PRESS LOGIK ---
const isSelectMode = ref(false)
const selectedIds = ref<number[]>([])

let pressTimer: any = null
let selectModeJustActivated = false

const startPress = (item: ChargeEntry, event: PointerEvent | TouchEvent) => {
  if (isSelectMode.value) return
  if ('button' in event && event.button !== 0) return

  pressTimer = setTimeout(() => {
    isSelectMode.value = true
    selectModeJustActivated = true

    if (!item.posted_at) {
      selectedIds.value.push(item.id)
    }

    if (navigator.vibrate) navigator.vibrate(50)
  }, 500)
}

const cancelPress = () => {
  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
}

const onContextMenu = (e: Event) => {
  if (isSelectMode.value) e.preventDefault()
}

const handleCardClick = (item: ChargeEntry) => {
  cancelPress()

  if (selectModeJustActivated) {
    selectModeJustActivated = false
    return
  }

  if (isSelectMode.value && !item.posted_at) {
    const index = selectedIds.value.indexOf(item.id)
    if (index > -1) selectedIds.value.splice(index, 1)
    else selectedIds.value.push(item.id)
  }
}

const exitSelectMode = () => {
  isSelectMode.value = false
  selectedIds.value = []
}

// --- COMPUTED PROPERTIES ---
const unpaidChargeIds = computed(() => {
  if (!charges.value) return []
  return charges.value.filter(c => !c.posted_at).map(c => c.id)
})

const selectAll = computed({
  get: () => selectedIds.value.length > 0 && selectedIds.value.length === unpaidChargeIds.value.length,
  set: (val) => {
    if (val) {
      selectedIds.value = [...unpaidChargeIds.value]
    } else {
      selectedIds.value = []
    }
  }
})

const selectedSum = computed(() => {
  if (!charges.value) return 0
  return charges.value
      .filter(c => selectedIds.value.includes(c.id))
      .reduce((sum, current) => sum + current.amount, 0)
})

function openEditDialog(item: ChargeEntry) {
  editForm.value = {
    id: item.id,
    creditor_id: item.creditor_id,
    amount: item.amount,
    created_at: item.created_at,
    posted_at: item.posted_at || null
  }
  dialogEdit.value = true
}

// Öffnet den Dialog und setzt das Datum zur Sicherheit auf "heute" zurück
function openPayDialog() {
  payDate.value = new Date().toISOString().split('T')[0]
  dialogPayDate.value = true
}

async function saveEditCharge() {
  if (!editForm.value) return

  await loading(async () => {
    await $fetch(`/api/charges/edit/${editForm.value.id}`, {
      method: 'PUT',
      body: {
        creditor_id: editForm.value.creditor_id,
        amount: editForm.value.amount,
        created_at: editForm.value.created_at,
        posted_at: editForm.value.posted_at || null
      }
    })

    dialogEdit.value = false
    refreshCharges()
  })
}

// Wird aufgerufen, wenn im neuen Datum-Dialog auf Speichern geklickt wird
async function confirmPayment() {
  if (selectedIds.value.length === 0) return

  // Nimmt hier das Datum aus dem Dialog (`payDate.value`) statt einem hartcodierten `today`
  await loading(async () => {
    await Promise.all(
        selectedIds.value.map(id =>
            $fetch(`/api/charges/${id}`, {
              method: 'PUT',
              body: { posted_at: payDate.value }
            })
        )
    )

    dialogPayDate.value = false
    exitSelectMode()
    refreshCharges()
  })
}

// Bisherige Funktionen...
async function addCreditor() {
  await loading(async () => {
    if (!newCreditorName.value.trim()) return
    await $fetch('/api/creditors', { method: 'POST', body: { name: newCreditorName.value } })
    newCreditorName.value = ''
    dialogCreditor.value = false
    await refreshCreditors()
  })
}

async function addCharge() {
  await loading(async () => {
    if (!newCharge.value.creditor_id || !newCharge.value.amount) return
    await $fetch('/api/charges', { method: 'POST', body: newCharge.value })
    newCharge.value.amount = 0
    dialogCharge.value = false
    refreshCharges()
  })
}

async function logout() {
  await loading(async () => {
    await clear()
    await navigateTo('/login')
  })

}

async function loading(callback: LoadingCallback) {
  overlay.value = true
  try {
    await callback()
  } finally {
    overlay.value = false
  }
}

// Edit-Modus starten
function startEditCreditor(creditor: Creditor) {
  editingCreditorId.value = creditor.id
  editingCreditorName.value = creditor.name
}

// Edit-Modus abbrechen
function cancelEditCreditor() {
  editingCreditorId.value = null
  editingCreditorName.value = ''
}

// Creditor-Name speichern
async function saveEditCreditor(id: number) {
  if (!editingCreditorName.value.trim()) return

  await loading(async () => {
    await $fetch(`/api/creditors/${id}`, {
      method: 'PUT',
      body: { name: editingCreditorName.value }
    })

    cancelEditCreditor()
    refreshCreditors()
    refreshCharges() // Aktualisiert auch die Namen in der Hauptliste
  })
}

// Creditor löschen
async function deleteCreditor(id: number) {
  if (!confirm('Person/Ladepunkt wirklich löschen?')) return

  await loading(async () => {
    await $fetch(`/api/creditors/${id}`, { method: 'DELETE' })
    refreshCreditors()
    refreshCharges()
  })
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgb(var(--v-theme-background));

  /* Zieht den Header über die Container-Ränder hinaus */
  margin-left: -16px;
  margin-right: -16px;

  /* Hält den Inhalt innen bündig mit den Karten */
  padding-left: 16px;
  padding-right: 16px;
}
</style>