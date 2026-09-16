import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'

export const creditor_t = sqliteTable('creditor_t', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
})

export const charge_t = sqliteTable('charge_t', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    creditor_id: integer('creditor_id').notNull().references(() => creditor_t.id),
    amount: real('amount').notNull(),
    created_at: text('created_at').notNull(),
    posted_at: text('posted_at'),
})
