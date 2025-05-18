import { Request, Response } from "express";
import { db } from "../config/database";
import { handleError, handleSuccess } from "../utils/responseHandler";

// GET ALL PELANGGAN (Distinct based on nama_pemilik and nama_hewan, with latest tanggal_periksa)
export async function getAllPelanggan(req: Request, res: Response) {
  try {
    const result = await db.query(`
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
        diagnosa,
        dokter,
        tanggal_periksa AS "tanggalPeriksa"
      FROM pelanggan
      ORDER BY nama_pemilik, nama_hewan, tanggal_periksa DESC;
    `);

    const pelanggan = result.rows;
    const statusMessage = pelanggan.length === 0 ? "Data pelanggan masih kosong" : "Data pelanggan berhasil diambil";

    return handleSuccess(res, 200, statusMessage, {
      result: pelanggan.length,
      data: pelanggan,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Internal Server Error");
  }
}

// GET PELANGGAN BY ID
export async function getPelangganById(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return handleError(res, 400, "ID pelanggan tidak boleh kosong");

  try {
    const result = await db.query(`SELECT * FROM pelanggan WHERE id = $1 LIMIT 1`, [id]);
    const pelanggan = result.rows[0];

    if (!pelanggan) return handleError(res, 404, "Pelanggan tidak ditemukan");

    return handleSuccess(res, 200, "Data pelanggan berhasil diambil", pelanggan);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Internal Server Error");
  }
}

// CREATE PELANGGAN
export async function createPelanggan(req: Request, res: Response) {
  const { namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, diagnosa, dokter } = req.body;

  if (!namaPemilik || !namaHewan || !jenisHewan || !jenisKelamin || !umur || !tipeUmur || !anamnesa || !tanggalPeriksa) {
    return handleError(res, 400, "Semua field harus terisi");
  }

  try {
    const result = await db.query(
      `INSERT INTO pelanggan (
        nama_pemilik, nama_hewan, jenis_hewan, jenis_kelamin, umur,
        tipe_umur, anamnesa, tanggal_periksa, terapi, diagnosa, dokter
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, diagnosa, dokter]
    );

    return handleSuccess(res, 201, "Pelanggan berhasil dibuat", result.rows);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Internal Server Error");
  }
}

// UPDATE PELANGGAN
export async function updatePelanggan(req: Request, res: Response) {
  const { id } = req.params;
  const { namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, diagnosa, dokter } = req.body;

  if (!id) return handleError(res, 400, "ID pelanggan tidak boleh kosong");
  if (!namaPemilik || !namaHewan || !jenisHewan || !jenisKelamin || !umur || !tipeUmur || !anamnesa || !tanggalPeriksa || !diagnosa) {
    return handleError(res, 400, "Semua field harus terisi");
  }

  try {
    const result = await db.query(
      `UPDATE pelanggan SET
        nama_pemilik = $1,
        nama_hewan = $2,
        jenis_hewan = $3,
        jenis_kelamin = $4,
        umur = $5,
        tipe_umur = $6,
        anamnesa = $7,
        tanggal_periksa = $8,
        terapi = $9,
        diagnosa = $10,
        dokter = $11
      WHERE id = $12
      RETURNING *`,
      [namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, diagnosa, dokter, id]
    );

    if (!result.rows.length) return handleError(res, 404, "Pelanggan tidak ditemukan");

    return handleSuccess(res, 200, "Pelanggan berhasil diupdate", result.rows);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Internal Server Error");
  }
}

// DELETE PELANGGAN
export async function deletePelanggan(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return handleError(res, 400, "ID pelanggan tidak boleh kosong");

  try {
    await db.query(`DELETE FROM pelanggan WHERE id = $1`, [id]);
    return handleSuccess(res, 200, "Pelanggan berhasil dihapus");
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Internal Server Error");
  }
}

// SEARCH PELANGGAN DETAIL
export async function searchPelangganDetail(req: Request, res: Response) {
  const { namaPemilik, namaHewan } = req.query;
  if (!namaPemilik || !namaHewan) {
    return handleError(res, 400, "Query namaPemilik dan namaHewan wajib diisi");
  }

  try {
    const result = await db.query(
      `SELECT id,
        nama_pemilik AS "namaPemilik",
        nama_hewan AS "namaHewan",
        jenis_hewan AS "jenisHewan",
        jenis_kelamin AS "jenisKelamin",
        umur,
        tipe_umur AS "tipeUmur",
        anamnesa,
        terapi,
        diagnosa,
        dokter,
        tanggal_periksa AS "tanggalPeriksa" 
        FROM pelanggan WHERE nama_pemilik ILIKE $1 AND nama_hewan ILIKE $2`,
      [`%${namaPemilik}%`, `%${namaHewan}%`]
    );

    return handleSuccess(res, 200, "Data pelanggan detail berhasil ditemukan", {
      result: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Internal Server Error");
  }
}

export async function recapPelangganDetail(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return handleError(res, 400, "Tanggal awal dan tanggal akhir harus diisi!");
    }

    const result = await db.query(
      `
      SELECT 
        id,
        nama_pemilik AS "namaPemilik",
        nama_hewan AS "namaHewan",
        jenis_hewan AS "jenisHewan",
        jenis_kelamin AS "jenisKelamin",
        umur,
        tipe_umur AS "tipeUmur",
        anamnesa,
        terapi,
        diagnosa,
        dokter,
        tanggal_periksa AS "tanggalPeriksa"
      FROM pelanggan
      WHERE tanggal_periksa BETWEEN $1 AND $2
      ORDER BY tanggal_periksa ASC;
    `,
      [startDate, endDate]
    );

    return handleSuccess(res, 200, "Data recap pelanggan berhasil ditemukan", {
      result: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Internal Server Error");
  }
}
