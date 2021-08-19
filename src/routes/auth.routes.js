import { Router } from 'express';
import {
  authUser,
  singIn,
  singUp,
  getUsers,
  getUser,
  updateUser,
} from '../controllers/auth.controllers';
// import { authToken } from '../middlewares';
const router = Router();

// router.post('/signup', [authToken.verifyToken, authToken.isAdmin], singUp);
router.post('/signup', singUp);
router.post('/signin', singIn);
router.get('/listUsers', getUsers);
router.get('/:user', getUser);
router.post('/updateUsr', updateUser);

router.post('/', authUser);

export default router;
