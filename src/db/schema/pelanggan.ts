import { pgTable, serial, varchar, integer, date, text } from 'drizzle-orm/pg-core';

export const pelangganModel = pgTable('pelanggan', {
  id: serial('id').primaryKey(),
  namaPemilik: varchar('nama_pemilik', { length: 255 }).notNull(),
  namaHewan: varchar('nama_hewan', { length: 255 }).notNull(),
  jenisHewan: varchar('jenis_hewan', { length: 100 }).notNull(),
  jenisKelamin: varchar('jenis_kelamin', { length: 10 }).notNull(),
  umur: integer('umur').notNull(),
  tipeUmur: varchar('tipe_umur', { length: 50 }).notNull(),
  anamnesa: text('anamnesa').notNull(),
  tanggalPeriksa: date('tanggal_periksa').notNull(),
  terapi: text('terapi').notNull(),
  dokter: varchar('dokter', { length: 100 }).notNull(),
});

export type Pelanggan = typeof pelangganModel.$inferSelect;
export type NewPelanggan = typeof pelangganModel.$inferInsert;
