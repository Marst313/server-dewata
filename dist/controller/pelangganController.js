"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPelanggan = getAllPelanggan;
exports.getPelangganById = getPelangganById;
exports.createPelanggan = createPelanggan;
exports.updatePelanggan = updatePelanggan;
exports.deletePelanggan = deletePelanggan;
exports.searchPelangganDetail = searchPelangganDetail;
const database_1 = require("../config/database");
const pelanggan_1 = require("../db/schema/pelanggan");
const drizzle_orm_1 = require("drizzle-orm");
const responseHandler_1 = require("../utils/responseHandler");
// GET ALL PELANGGAN (Distinct based on nama_pemilik and nama_hewan, with latest tanggal_periksa)
function getAllPelanggan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield database_1.db.execute((0, drizzle_orm_1.sql) `
      SELECT DISTINCT ON (nama_pemilik, nama_hewan)
        id,
        nama_pemilik AS "namaPemilik",
        nama_hewan AS "namaHewan",
        jenis_hewan AS "jenisHewan",
        jenis_kelamin AS "jenisKelamin",
        umur,
        tipe_umur AS "tipeUmur",
        anamnesa,
        terapi,
        dokter,
        tanggal_periksa AS "tanggalPeriksa"
      FROM pelanggan
      ORDER BY nama_pemilik, nama_hewan, tanggal_periksa DESC;
    `);
            const pelanggan = result.rows;
            const statusMessage = pelanggan.length === 0 ? 'Data pelanggan masih kosong' : 'Data pelanggan berhasil diambil';
            return (0, responseHandler_1.handleSuccess)(res, 200, statusMessage, {
                result: pelanggan.length,
                data: pelanggan,
            });
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Internal Server Error');
        }
    });
}
// GET PELANGGAN BY ID
function getPelangganById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id)
            return (0, responseHandler_1.handleError)(res, 400, 'ID pelanggan tidak boleh kosong');
        try {
            const pelanggan = yield database_1.db
                .select()
                .from(pelanggan_1.pelangganModel)
                .where((0, drizzle_orm_1.sql) `${pelanggan_1.pelangganModel.id} = ${id}`)
                .limit(1)
                .then((result) => result[0]);
            if (!pelanggan)
                return (0, responseHandler_1.handleError)(res, 404, 'Pelanggan tidak ditemukan');
            return (0, responseHandler_1.handleSuccess)(res, 200, 'Data pelanggan berhasil diambil', pelanggan);
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Internal Server Error');
        }
    });
}
// CREATE PELANGGAN
function createPelanggan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, dokter } = req.body;
        if (!namaPemilik || !namaHewan || !jenisHewan || !jenisKelamin || !umur || !tipeUmur || !anamnesa || !tanggalPeriksa) {
            return (0, responseHandler_1.handleError)(res, 400, 'Semua field harus terisi');
        }
        try {
            const pelanggan = yield database_1.db
                .insert(pelanggan_1.pelangganModel)
                .values({
                namaPemilik,
                namaHewan,
                jenisHewan,
                jenisKelamin,
                umur,
                tipeUmur,
                anamnesa,
                tanggalPeriksa,
                terapi,
                dokter,
            })
                .returning();
            return (0, responseHandler_1.handleSuccess)(res, 201, 'Pelanggan berhasil dibuat', pelanggan);
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Internal Server Error');
        }
    });
}
// UPDATE PELANGGAN
function updatePelanggan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, dokter } = req.body;
        if (!id)
            return (0, responseHandler_1.handleError)(res, 400, 'ID pelanggan tidak boleh kosong');
        if (!namaPemilik || !namaHewan || !jenisHewan || !jenisKelamin || !umur || !tipeUmur || !anamnesa || !tanggalPeriksa) {
            return (0, responseHandler_1.handleError)(res, 400, 'Semua field harus terisi');
        }
        try {
            const pelanggan = yield database_1.db
                .update(pelanggan_1.pelangganModel)
                .set({
                namaPemilik,
                namaHewan,
                jenisHewan,
                jenisKelamin,
                umur,
                tipeUmur,
                anamnesa,
                tanggalPeriksa,
                terapi,
                dokter,
            })
                .where((0, drizzle_orm_1.sql) `${pelanggan_1.pelangganModel.id} = ${id}`)
                .returning();
            if (!pelanggan.length)
                return (0, responseHandler_1.handleError)(res, 404, 'Pelanggan tidak ditemukan');
            return (0, responseHandler_1.handleSuccess)(res, 200, 'Pelanggan berhasil diupdate', pelanggan);
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Internal Server Error');
        }
    });
}
// DELETE PELANGGAN
function deletePelanggan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id)
            return (0, responseHandler_1.handleError)(res, 400, 'ID pelanggan tidak boleh kosong');
        try {
            yield database_1.db.delete(pelanggan_1.pelangganModel).where((0, drizzle_orm_1.sql) `${pelanggan_1.pelangganModel.id} = ${id}`);
            return (0, responseHandler_1.handleSuccess)(res, 200, 'Pelanggan berhasil dihapus');
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Internal Server Error');
        }
    });
}
// SEARCH PELANGGAN DETAIL
function searchPelangganDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { namaPemilik, namaHewan } = req.query;
        if (!namaPemilik || !namaHewan) {
            return (0, responseHandler_1.handleError)(res, 400, 'Query namaPemilik dan namaHewan wajib diisi');
        }
        try {
            const pelanggan = yield database_1.db
                .select()
                .from(pelanggan_1.pelangganModel)
                .where((0, drizzle_orm_1.sql) `nama_pemilik ILIKE ${`%${namaPemilik}%`} AND nama_hewan ILIKE ${`%${namaHewan}%`}`);
            return (0, responseHandler_1.handleSuccess)(res, 200, 'Data pelanggan detail berhasil ditemukan', {
                result: pelanggan.length,
                data: pelanggan,
            });
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Internal Server Error');
        }
    });
}
