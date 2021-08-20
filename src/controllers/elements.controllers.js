import { connect } from "./dataBase";

export const getmultas = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query(
      'SELECT rango_dias, multas FROM t_multas_recargos WHERE 1'
    );
    // console.log(rows);
    // res.send('Sistema de traslados');
    res.json(rows);
};

export const postMultas = async (req, res) => {
  const connection = await connect();
  const { imp_multa, rango } = await req.body;
  
    const [result] = await connection.query(
      'UPDATE t_multas_recargos SET multas = ? WHERE id >= 1 AND rango_dias = ?',
      [imp_multa, rango]
  );
  
  res.status(200);
  res.json({
    menssage: `Se modifico el valor de la multa`,
    confirm: 'modificado',
    cambios: result.affectedRows,
  });
};
  
export const getUmas = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query(
      'SELECT opcion, descripcion, valor FROM t_uma WHERE 1'
    );
    // console.log(rows);
    // res.send('Sistema de traslados');
    res.json(rows);
};
  
export const postUmas = async (req, res) => {
  const connection = await connect();
  const { valor, opcion } = await req.body;
  
    const [result] = await connection.query(
      'UPDATE t_uma SET valor = ? WHERE idt_uma >= 1 AND opcion = ?',
      [valor, opcion]
  );
  
  res.status(200);
  res.json({
    menssage: `Se modifico el valor del UMA`,
    confirm: 'modificado',
    cambios: result.affectedRows,
  });
};
  
  
export const getValores = async (req, res) => {
  const connection = await connect();
  const tipo = req.params.tipo;
  console.log(tipo)
  
    const [rows] = await connection.query(
      'SELECT descripcion, valor, tipo FROM t_valores WHERE tipo = ?',tipo
    );
    // console.log(rows);
    // res.send('Sistema de traslados');
    res.json(rows);
};

export const postValores = async (req, res) => {
  const connection = await connect();
  const { valor, idv } = await req.body;
  
    const [result] = await connection.query(
      'UPDATE t_valores SET valor = ? WHERE id = ?',
      [valor, idv]
  );
  
  res.status(200);
  res.json({
    menssage: `Se modifico el valor`,
    confirm: 'modificado',
    cambios: result.affectedRows,
  });
};
  
export const getDiasInhabiles = async (req, res) => {
  const connection = await connect();
  const tipo = req.params.tipo;
  console.log(tipo)
  
    const [rows] = await connection.query(
      'SELECT fecha_text, fecha_inicio, fecha_fin FROM t_diasInhabiles WHERE anhio = YEAR(NOW())'
    );
    // console.log(rows);
    // res.send('Sistema de traslados');
    res.json(rows);
};
  
export const postDiasHabiles = async (req, res) => {
  const connection = await connect();
  const { id, descripcion, fecha_inicio, fecha_fin} = await req.body;
  
  const [rows] = await connection.query(
    'SELECT COUNT(*) AS total FROM t_diasInhabiles WHERE fecha_inicio = ? AND fecha_fin = ?', [req.body.fecha_inicio, req.body.fecha_fin]
  );
    const exist = rows[0]['total']
  if (exist == 0)
  {
    const [result] = await connection.query('INSERT INTO t_diasInhabiles (fecha_text, fecha_inicio, fecha_fin, anhio) VALUES (?, ?, ?, YEAR(?))', [descripcion, fecha_inicio, fecha_fin, fecha_fin])
    
    result.affectedRows == 0 ? (
      res.status(400),
      res.json({
      menssage: `Falla al ingresar el dia inhabil`,
      confirm: 'Sin cambios',
      cambios: result.affectedRows
    })
    ) : (
        res.status(200),
        res.json({
          menssage: `Se agrego el dia habil`,
          confirm: 'agregado',
          cambios: result.affectedRows,
          newId:result.insertId
        }));
     
   } else
   {
     const [result] = await connection.query(
       'UPDATE t_diasInhabiles SET fecha_text = ?, fecha_inicio = ?, fecha_fin = ?, anhio = YEAR(?)  WHERE idt_diasInhabiles = ?',
       [descripcion, fecha_inicio, fecha_fin, fecha_fin, id]);
     
       result.affectedRows == 0 ? (
        res.status(400),
        res.json({
        menssage: `NO se modifico el dia habil`,
        confirm: 'Sin cambios',
        cambios: result.affectedRows,
      })
      ) : (
          res.status(200),
          res.json({
            menssage: `Se modifico el dia habil`,
            confirm: 'modificado',
            cambios: result.affectedRows,
          }));
   }  
};