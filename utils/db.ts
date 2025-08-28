import { ConnectionPool } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME', 'BIGC_DB_USER', 'BIGC_DB_PASSWORD', 'BIGC_DB_SERVER', 'BIGC_DB_NAME'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool: ConnectionPool | null = null;

export async function getConnection() {
  if (!pool) {
    pool = new ConnectionPool(config);
    await pool.connect();
  }
  return pool;
}

export async function query(sql: string, params: any[] = []) {
  const connection = await getConnection();
  const request = connection.request();
  params.forEach((param, index) => {
    request.input(`param${index}`, param);
  });
  return request.query(sql);
}

export async function closeConnection() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

export async function insertEventStatus(data: any): Promise<string> {
  const result = await query(
    'INSERT INTO EventStatus (id, name, price) OUTPUT INSERTED.id VALUES (@param0, @param1, @param2)',
    [data.id, data.name, data.price]
  );
  return result.recordset[0].id;
}

const bigCConfig = {
  user: process.env.BIGC_DB_USER!,
  password: process.env.BIGC_DB_PASSWORD!,
  server: process.env.BIGC_DB_SERVER!,
  database: process.env.BIGC_DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let bigCPool: ConnectionPool | null = null;

export async function getBigCConnection() {
  if (!bigCPool) {
    bigCPool = new ConnectionPool(bigCConfig);
    await bigCPool.connect();
  }
  return bigCPool;
}

export async function transferBigCDataToFinRecon() {
  const bigCConnection = await getBigCConnection();
  const finReconConnection = await getConnection();

  // Retrieve JSON data from devdb-bigC
  const bigCResult = await bigCConnection.request().query('SELECT * FROM BigCData');
  const bigCData = bigCResult.recordset;

  // Insert JSON data into finrecon-dev
  for (const data of bigCData) {
    await finReconConnection.request()
      .input('id', data.id)
      .input('name', data.name)
      .input('price', data.price)
      .query('INSERT INTO FinReconData (id, name, price) VALUES (@id, @name, @price)');
  }
}