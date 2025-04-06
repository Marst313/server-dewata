"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pelangganModel = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.pelangganModel = (0, pg_core_1.pgTable)('pelanggan', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    namaPemilik: (0, pg_core_1.varchar)('nama_pemilik', { length: 255 }).notNull(),
    namaHewan: (0, pg_core_1.varchar)('nama_hewan', { length: 255 }).notNull(),
    jenisHewan: (0, pg_core_1.varchar)('jenis_hewan', { length: 100 }).notNull(),
    jenisKelamin: (0, pg_core_1.varchar)('jenis_kelamin', { length: 10 }).notNull(),
    umur: (0, pg_core_1.integer)('umur').notNull(),
    tipeUmur: (0, pg_core_1.varchar)('tipe_umur', { length: 50 }).notNull(),
    anamnesa: (0, pg_core_1.text)('anamnesa').notNull(),
    tanggalPeriksa: (0, pg_core_1.date)('tanggal_periksa').notNull(),
    terapi: (0, pg_core_1.text)('terapi').notNull(),
    dokter: (0, pg_core_1.varchar)('dokter', { length: 100 }).notNull(),
});
