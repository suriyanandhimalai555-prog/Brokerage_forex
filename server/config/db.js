// Development
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "appuser",
  host: "localhost",
  database: "AVG_Forex",
  password: "123456",
  port: 5432,
});



// Production


// import pkg from "pg";
// const { Pool } = pkg;

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,

//   ssl:
//     process.env.NODE_ENV === "production"
//       ? {
//           rejectUnauthorized: false,
//         }
//       : false,
// });