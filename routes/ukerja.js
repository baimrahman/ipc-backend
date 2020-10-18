var express = require("express");
var router = express.Router();
const conn = require("../services/database");
var oracledb = require("oracledb");
var bcrypt = require("bcryptjs");
var moment = require("moment");
var jwt = require("jsonwebtoken");
/* GET users listing. */
router.get("/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_UNITKERJA WHERE UNITKERJA_ID='${req.params.uk_id}'`;
  req.params.uk_id == "9999"
    ? (sql = `SELECT * FROM IPC_UNITKERJA`)
    : (sql = sql);
  const ukList = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!ukList) return res.status(400).send("Data Error");
  res.send(ukList.rows);
});

router.post("/register", async function (req, res, next) {
  const cekUser = await conn.exe(
    `SELECT * FROM ipc_unitkerja WHERE uk_email='${req.body.email}'`,
    [],
    { outFormat: oracledb.OBJECT }
  );

  if (cekUser.rows.length > 0)
    return res.status(400).send("Email already used!");

  const newUser = await conn.exe(
    `INSERT INTO IPC_UNITKERJA (unitkerja_id,uk_name,uk_address,uk_tlp,uk_email,uk_website,uk_fasilitas,uk_lat,uk_long)
    VALUES (unitkerja_id.nextval,'${req.body.uk_name}','${req.body.uk_address}','${req.body.uk_tlp}','${req.body.uk_email}','${req.body.uk_website}','${req.body.uk_fasilitas}','${req.body.uk_lat}','${req.body.uk_long}')`,
    [],
    { autoCommit: true }
  );
  if (!newUser) return res.status(400).send("Data Error");
  res.send("User resgistered!");
});

// router.get("/:uk_id", async function (req, res, next) {
//   const ukList = await conn.exe(
//     `SELECT * FROM ipc_unitkerja WHERE unitkerja_id='${req.params.uk_id}'`,
//     [],
//     {
//       outFormat: oracledb.OBJECT,
//     }
//   );
//   if (!ukList) return res.status(400).send("Data Error");
//   res.send(ukList.rows);
// });
module.exports = router;
