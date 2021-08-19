import { connect } from './dataBase';
import bcrypt from 'bcryptjs';
import jsntoken from 'jsonwebtoken';
import secrword from '../secrWord';

const passHash = async (textPass) => {
  const level = await bcrypt.genSalt(9);
  return await bcrypt.hash(textPass, level);
};

const passValidate = (pswNow, pswSave) => {
  return bcrypt.compareSync(pswNow, pswSave);
};

const usrExist = async (user) => {
  const connection = await connect();
  const [rows] = await connection.query(
    'SELECT COUNT(username) as total from t_users WHERE username = ?',
    [user]
  );

  return rows[0]['total'];
};

/**Crear un usuario y validar que no se repita*/
export const singUp = async (req, res) => {
  const connection = await connect();
  const { usrname, username, pass, userlevel, image, status, area } =
    await req.body;
  const asExist = await usrExist(username);

  if (asExist != 0) {
    res.status(400);
    res.json({
      menssage: 'Usuario ya existe',
      confirm: 'Duplicado',
    });
  } else {
    const psw = await passHash(pass);
    const [result] = await connection.query(
      'INSERT INTO t_users (name, username, password, user_level, image, status, area) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usrname, username, psw, userlevel, image, status, area]
    );

    const token = jsntoken.sign({ id: result.insertId }, secrword.SECRET, {
      expiresIn: 86400,
    });
    res.status(201);
    res.json({
      menssage: 'Usuario Registrado',
      id: result.insertId,
      token: token,
      confirm: 'Creado',
    });
  }
};

/**Validar el inicio de sesion y generar token*/
export const singIn = async (req, res) => {
  const connection = await connect();
  const { username, pass } = await req.body;
  const [rows] = await connection.query(
    'SELECT COUNT(username) as total from t_users WHERE username = ?',
    [username]
  );

  // res.json(rows[0]['total']);

  if (rows[0]['total'] == 1) {
    const [usrow] = await connection.query(
      'SELECT id, name, username, password from t_users WHERE username = ?',
      [username]
    );

    // const matchPassword = bcrypt.compareSync('amore', usrow[0]['password']);
    const matchPassword = passValidate(pass, usrow[0]['password']);

    if (!matchPassword)
      return res.status(400).json({
        token: null,
        menssage: 'Contraseña Invalida',
        match: matchPassword,
      });

    const token = jsntoken.sign({ id: usrow[0]['id'] }, secrword.SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      token: token,
      menssage: `Bienvenido ${usrow[0]['name']}`,
      match: matchPassword,
      confirm: 'singIn',
    });
  } else {
    res.status(400).json({
      menssage: 'No existe el usuario',
      res: rows[0]['total'],
      usr: username,
    });
  }
};

export const authUser = (req, res) => {
  res.json('Auth!!');
};

export const getUsers = async (req, res) => {
  const connection = await connect();
  const [rows] = await connection.query(
    'SELECT id, name, username, user_level, image, status, area, last_login, f_usr_create FROM t_users where status = 1'
  );
  // console.log(rows);
  // res.send('Sistema de traslados');
  res.json(rows);
};

export const getUser = async (req, res) => {
  const connection = await connect();
  const [rows] = await connection.query(
    'SELECT id, name, username, user_level, image, status, area, last_login, f_usr_create FROM t_users where username = ?',
    [req.params.user]
  );

  res.json(rows[0]);
};

export const updateUser = async (req, res) => {
  const connection = await connect();
  const { name, pass, userlevel, image, status, area, id } = await req.body;

  const psw = await passHash(pass);
  const [result] = await connection.query(
    'UPDATE t_users SET name = ?, password = ?, user_level = ?, image = ?, status = ?, area = ? WHERE id = ?',
    [name, psw, userlevel, image, status, area, id]
  );

  res.status(200);
  res.json({
    menssage: `Se modifico el usuario`,
    confirm: 'modificado',
  });
};
