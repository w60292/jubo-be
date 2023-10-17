const { Client } = require("pg");
var express = require("express");
var app = express();

const client = new Client({
  host: "localhost",
  user: "admin",
  database: "jubo",
  password: "jubopwd",
  port: 5432,
});

const CHECK_TABLE_EXISTS = `
SELECT EXISTS (
  SELECT 1
  FROM   information_schema.tables 
  WHERE  table_schema = 'public'
  AND    table_name = 't_patients'
  );
`;
const CREATE_PATIENTS_TABLE = `
CREATE TABLE "t_patients" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50)NOT NULL,
  "telephone" VARCHAR(20)NOT NULL,
  "address" VARCHAR(100)NOT NULL
);
`;
const INIT_PATIENTS = `
INSERT INTO "t_patients"
    ("name", "telephone", "address")
VALUES
    ('王大明', '0911999888', '新北市新店區民權路99號'),
    ('林小華', '0937199347', '新北市新店區中正路29號5樓'),
    ('方大同', '0912389108', '新北市新店區建國路299號之1'),
    ('李小龍', '0936635151', '新北市新店區北新路三段60巷47號'),
    ('包不同', '0921384448', '新北市新店區建國路199號');
`;

const startPgClient = async () => {
  await client.connect(); // gets connection
};

const endPgClient = async () => {
  await client.end(); // gets connection
};

const initialDatabase = async () => {
  try {
    const { rows } = await client.query(CHECK_TABLE_EXISTS);
    if (rows && rows[0]) {
      const { exists } = rows[0];

      if (!exists) {
        await client.query(CREATE_PATIENTS_TABLE);
        await client.query(INIT_PATIENTS);
      } else {
        await getAllPatients();
      }
    }
  } catch (error) {
    console.error(error.stack);
  }
};

const getAllPatients = async () => {
  const query = "SELECT * from t_patients";
  try {
    const { rows } = await client.query(query);
    return rows;
  } catch (error) {
    console.error(error.stack);
  }
};

app.get("/getPatients", async (req, res) => {
  const results = await getAllPatients();
  console.log("getPatients");
  res.status(200).json(results);
});

app.listen(8081, () => {
  console.log("http://localhost:8081/");
});

(async () => {
  await startPgClient();
  await initialDatabase();
})();
