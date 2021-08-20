import express from 'express';
// import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { options } from './swaggerOptions';
import trasladosRoutes from './routes/traslados.routes';
import authRoutes from './routes/auth.routes';
import elementsRoutes from './routes/elements.routes'

const specs = swaggerJSDoc(options);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({
    author: 'Rangel Diaz Luis Fernando',
    name: 'Sistema de Traslados',
    version: '0.1.0',
  });
});

app.use('/api/traslados', trasladosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/elements', elementsRoutes);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

export default app;
