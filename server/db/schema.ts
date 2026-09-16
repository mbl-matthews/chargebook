import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'

export const user_t = sqliteTable('user_t', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
})

export const creditor_t = sqliteTable('creditor_t', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: integer('user_id').notNull().references(() => user_t.id),
    name: text('name').notNull()
})

export const charge_t = sqliteTable('charge_t', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: integer('user_id').notNull().references(() => user_t.id),
    creditor_id: integer('creditor_id').notNull().references(() => creditor_t.id),
    amount: real('amount').notNull(),
    created_at: text('created_at').notNull(),
    posted_at: text('posted_at')
})
