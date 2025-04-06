import { Request, Response } from 'express';
import { db } from '../config/database';
import { pelangganModel } from '../db/schema/pelanggan';
import { sql } from 'drizzle-orm';
import { handleError, handleSuccess } from '../utils/responseHandler';

// GET ALL PELANGGAN (Distinct based on nama_pemilik and nama_hewan, with latest tanggal_periksa)
export async function getAllPelanggan(req: Request, res: Response) {
  try {
    const result = await db.execute(sql`
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

    return handleSuccess(res, 200, statusMessage, {
      result: pelanggan.length,
      data: pelanggan,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Internal Server Error');
  }
}

// GET PELANGGAN BY ID
export async function getPelangganById(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return handleError(res, 400, 'ID pelanggan tidak boleh kosong');

  try {
    const pelanggan = await db
      .select()
      .from(pelangganModel)
      .where(sql`${pelangganModel.id} = ${id}`)
      .limit(1)
      .then((result) => result[0]);

    if (!pelanggan) return handleError(res, 404, 'Pelanggan tidak ditemukan');

    return handleSuccess(res, 200, 'Data pelanggan berhasil diambil', pelanggan);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Internal Server Error');
  }
}

// CREATE PELANGGAN
export async function createPelanggan(req: Request, res: Response) {
  const { namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, dokter } = req.body;

  if (!namaPemilik || !namaHewan || !jenisHewan || !jenisKelamin || !umur || !tipeUmur || !anamnesa || !tanggalPeriksa) {
    return handleError(res, 400, 'Semua field harus terisi');
  }

  try {
    const pelanggan = await db
      .insert(pelangganModel)
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

    return handleSuccess(res, 201, 'Pelanggan berhasil dibuat', pelanggan);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Internal Server Error');
  }
}

// UPDATE PELANGGAN
export async function updatePelanggan(req: Request, res: Response) {
  const { id } = req.params;
  const { namaPemilik, namaHewan, jenisHewan, jenisKelamin, umur, tipeUmur, anamnesa, tanggalPeriksa, terapi, dokter } = req.body;

  if (!id) return handleError(res, 400, 'ID pelanggan tidak boleh kosong');
  if (!namaPemilik || !namaHewan || !jenisHewan || !jenisKelamin || !umur || !tipeUmur || !anamnesa || !tanggalPeriksa) {
    return handleError(res, 400, 'Semua field harus terisi');
  }

  try {
    const pelanggan = await db
      .update(pelangganModel)
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
      .where(sql`${pelangganModel.id} = ${id}`)
      .returning();

    if (!pelanggan.length) return handleError(res, 404, 'Pelanggan tidak ditemukan');

    return handleSuccess(res, 200, 'Pelanggan berhasil diupdate', pelanggan);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Internal Server Error');
  }
}

// DELETE PELANGGAN
export async function deletePelanggan(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return handleError(res, 400, 'ID pelanggan tidak boleh kosong');

  try {
    await db.delete(pelangganModel).where(sql`${pelangganModel.id} = ${id}`);
    return handleSuccess(res, 200, 'Pelanggan berhasil dihapus');
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Internal Server Error');
  }
}

// SEARCH PELANGGAN DETAIL
export async function searchPelangganDetail(req: Request, res: Response) {
  const { namaPemilik, namaHewan } = req.query;
  if (!namaPemilik || !namaHewan) {
    return handleError(res, 400, 'Query namaPemilik dan namaHewan wajib diisi');
  }

  try {
    const pelanggan = await db
      .select()
      .from(pelangganModel)
      .where(sql`nama_pemilik ILIKE ${`%${namaPemilik}%`} AND nama_hewan ILIKE ${`%${namaHewan}%`}`);

    return handleSuccess(res, 200, 'Data pelanggan detail berhasil ditemukan', {
      result: pelanggan.length,
      data: pelanggan,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Internal Server Error');
  }
}
