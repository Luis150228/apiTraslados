import { Router } from 'express';
import * as fnTraslados from '../controllers/traslados.controllers';
// import { authToken } from '../middlewares';

const router = Router();

router.get('/', fnTraslados.getTraslados);

router.get('/count', fnTraslados.getTrasladoCount);

router.get('/:id', fnTraslados.getTraslado);

router.post('/', fnTraslados.setTraslado);

router.delete('/:id', fnTraslados.deleteTraslado);

router.put('/:id', fnTraslados.updateTraslado);

export default router;
