import app from './app';
// import './controllers/dataBase';

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Server on port ${port}`);
