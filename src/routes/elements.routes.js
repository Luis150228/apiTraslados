import { Router } from 'express';
import * as ELM from '../controllers/elements.controllers'

const router = Router();

///Mostrar datos
router.get('/multas', ELM.getmultas);
router.get('/umas', ELM.getUmas);
router.get('/valores/:tipo', ELM.getValores);
router.get('/diasInh', ELM.getDiasInhabiles);


//editar datos
router.post('/multas', ELM.postMultas);
router.post('/umas', ELM.postUmas);
router.post('/valores', ELM.postValores);
router.post('/diasInh', ELM.postDiasHabiles);


export default router;