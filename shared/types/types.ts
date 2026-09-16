export interface Creditor {
    id: number
    name: string
}

export interface CreateChargeInput {
    creditor_id: number
    amount: number
    created_at: string
    posted_at?: string | null
}

export interface ChargeEntry {
    id: number
    creditor_id: number
    creditor_name: string
    amount: number
    created_at: string
    posted_at: string | null
}
