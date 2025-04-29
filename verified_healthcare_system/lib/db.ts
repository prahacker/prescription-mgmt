import mysql from 'mysql2/promise';

export async function queryDB(query: string, values: any[] = []) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 55000,
    user: 'root',
    password: 'root',
    database: 'healthcare'
  });

  const [results] = await connection.execute(query, values);
  await connection.end();
  return results;
}
