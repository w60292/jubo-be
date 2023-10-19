const pg = require("pg");

// postgres client settings
const pool = new pg.Pool({
  host: "localhost",
  user: "admin",
  database: "jubo",
  password: "jubopwd",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * The common postgres query function.
 * @param {string} queryString - The postgreSQL query syntax.
 */
const queryPostgre = async (queryString) => {
  const client = await pool.connect();
  let result = null;

  try {
    result = await client.query(queryString);

    if (!result) {
      console.error("Query result is undefined or null.");
    } else {
      return result;
    }
  } catch (error) {
    console.error(error.stack);
  } finally {
    client.release();
  }
};

/**
 * Check if the tableName exists in the postgreSQL.
 * @param {string} tableName
 * @return {boolean}
 */
const checkTableExist = async (tableName) => {
  const checkExistSQL = `
    SELECT EXISTS (
      SELECT 1
      FROM   information_schema.tables 
      WHERE  table_schema = 'public'
      AND    table_name = '${tableName}'
    );`;

  try {
    const { rows } = await queryPostgre(checkExistSQL);
    if (rows && rows[0]) {
      return rows[0].exists;
    }
  } catch (error) {
    console.error(error.stack);
  }
};

/**
 * Create table "t_patients" and give initial data.
 */
const initialPatientsTable = async () => {
  const createTableSQL = `
    CREATE TABLE "t_patients" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(50)NOT NULL,
      "telephone" VARCHAR(20)NOT NULL,
      "address" VARCHAR(100)NOT NULL
    );`;
  const initDataSQL = `
    INSERT INTO "t_patients"
      ("name", "telephone", "address")
    VALUES
      ('王大明', '0911999888', '新北市新店區民權路99號'),
      ('林小華', '0937199347', '新北市新店區中正路29號5樓'),
      ('方大同', '0912389108', '新北市新店區建國路299號之1'),
      ('李小龍', '0936635151', '新北市新店區北新路三段60巷47號'),
      ('包不同', '0921384448', '新北市新店區建國路199號');`;

  try {
    const tableName = "t_patients";
    const exists = await checkTableExist(tableName);

    if (!exists) {
      await queryPostgre(createTableSQL);
      await queryPostgre(initDataSQL);
    }
  } catch (error) {
    console.error(error.stack);
  }
};

/**
 * Create table "t_orders" and give initial data.
 */
const initialOrdersTable = async () => {
  const createTableSQL = `
    CREATE TABLE "t_orders" (
      "id" SERIAL PRIMARY KEY,
      "patient_id" INT NOT NULL,
      "message" VARCHAR(200)NOT NULL,
      "create_time" TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_patient
      FOREIGN KEY(patient_id) 
        REFERENCES t_patients(id)
    );`;

  const initDataSQL = `
    INSERT INTO "t_orders"
      ("patient_id", "message", "create_time")
    VALUES
      (1, '超過120請施打8u', '2023-10-15 16:30:00'),
      (2, '就寢時間，臨睡前大劑量給藥', '2023-10-16 14:09:00'),
      (3, '繼續同樣治療', '2023-10-15 19:47:00'),
      (4, '靜脈注射含5%葡萄糖的生理鹽水', '2023-10-13 20:16:00'),
      (5, '禁食，禁飲水', '2023-10-18 15:53:00');
    `;

  try {
    const tableName = "t_orders";
    const exists = await checkTableExist(tableName);

    if (!exists) {
      await queryPostgre(createTableSQL);
      await queryPostgre(initDataSQL);
    }
  } catch (error) {
    console.error(error.stack);
  }
};

/**
 * Initialize table schema and data once the service boots in the first time.
 */
const initialDatabase = async () => {
  await initialPatientsTable();
  await initialOrdersTable();
};

/**
 * Get all patients information from table.
 * @returns {array} patient list
 */
const getAllPatients = async () => {
  const query = "SELECT * FROM t_patients";
  try {
    const { rows } = await queryPostgre(query);
    return rows;
  } catch (error) {
    console.error(error.stack);
  }
};

/**
 * Get order list by patient_id
 * @param {int} patientId
 * @return {array} order list
 */
const getAllOrdersFromPatientId = async (patientId) => {
  const query = `
    SELECT id, row_number() over() as sno, message 
    FROM t_orders 
    WHERE patient_id = ${patientId} 
    ORDER BY create_time`;

  try {
    const { rows } = await queryPostgre(query);
    return rows;
  } catch (error) {
    console.error(error.stack);
  }
};

/**
 * Add an order into the table.
 * @param {int} patientId - patient ID
 * @param {string} message - order message
 */
const insertOrderByPatientId = async (patientId, message) => {
  const now = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
  const query = `
    INSERT INTO "t_orders"
      ("patient_id", "message", "create_time")
    VALUES
      (${patientId}, '${message}', '${now}');`;

  try {
    await queryPostgre(query);
  } catch (error) {
    console.error(error.stack);
  }
};

/**
 * Update an exists order with order ID and order message.
 * @param {int} orderId - order ID
 * @param {string} message - order message
 */
const updateOrderById = async (orderId, message) => {
  const query = `UPDATE t_orders SET message='${message}' WHERE id='${orderId}';`;

  try {
    await queryPostgre(query);
  } catch (error) {
    console.error(error.stack);
  }
};

/**
 * Remove an exists order from the table.
 * @param {int} orderId
 */
const deleteOrderById = async (orderId) => {
  const query = `DELETE FROM t_orders WHERE id=${orderId}`;

  try {
    await queryPostgre(query);
  } catch (error) {
    console.error(error.stack);
  }
};

module.exports = {
  initialDatabase,
  getAllPatients,
  getAllOrdersFromPatientId,
  insertOrderByPatientId,
  updateOrderById,
  deleteOrderById,
};
