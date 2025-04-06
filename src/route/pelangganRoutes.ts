import { Router } from 'express';
import { Protect } from '../middleware/authMiddleware';
import { createPelanggan, deletePelanggan, getAllPelanggan, getPelangganById, searchPelangganDetail, updatePelanggan } from '../controller/pelangganController';

const router = Router();

router.use(Protect);

router.get('/search-detail', searchPelangganDetail);
router.get('/', getAllPelanggan);
router.post('/', createPelanggan);
router.get('/:id', getPelangganById);
router.delete('/:id', deletePelanggan);
router.put('/:id', updatePelanggan);

export default router;
