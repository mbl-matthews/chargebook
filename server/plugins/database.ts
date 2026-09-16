import { sqlite } from '../utils/db'

export default defineNitroPlugin(() => {
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS creditor_t (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS charge_t (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      creditor_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      created_at TEXT NOT NULL,
      posted_at TEXT,
      FOREIGN KEY (creditor_id) REFERENCES creditor_t(id)
    );
  `)
})
