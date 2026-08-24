import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "anti388ann741",
  database: "sukolilo_db",
});

export default pool;