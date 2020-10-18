var express = require("express");
var router = express.Router();
const conn = require("../services/database");
var oracledb = require("oracledb");
var bcrypt = require("bcryptjs");
var moment = require("moment");
var jwt = require("jsonwebtoken");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/login", async function (req, res, next) {
  console.log(req.body);
  const cekUser = await conn.exe(
    `SELECT * FROM ipc_user WHERE email='${req.body.email}'`,
    [],
    { outFormat: oracledb.OBJECT }
  );
  console.log(cekUser);
  if (cekUser.rows.length === 0)
    return res.status(400).send("Email or Password is invalid!");
  const validPass = await bcrypt.compare(
    req.body.password,
    cekUser.rows[0].PASSWORD
  );
  if (!validPass) return res.status(400).send("Email or Password is invalid!");

  const sendData = {
    idUK: cekUser.rows[0].UNITKERJA_ID,
    token: "",
    name: cekUser.rows[0].USERNAME,
  };
  if (cekUser.rows[0].UNITKERJA_ID === 9999) {
    sendData.isAdmin = true;
  } else {
    sendData.isAdmin = false;
  }
  res.send(sendData);
});
router.post("/register", async function (req, res, next) {
  const cekUser = await conn.exe(
    `SELECT * FROM ipc_user WHERE email='${req.body.email}'`,
    [],
    { outFormat: oracledb.OBJECT }
  );

  if (cekUser.rows.length > 0)
    return res.status(400).send("Email already used!");
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);
  const newUser = await conn.exe(
    `INSERT INTO IPC_USER (user_id,unitkerja_id,username,email,password,createdat,useraccess,isadmin) 
    VALUES (user_id.nextval,'${req.body.unitkerja_id}','${
      req.body.username
    }','${req.body.email}','${hashPass}','${moment().unix()}','${
      req.body.useraccess
    }','${req.body.isadmin}')`,
    [],
    { autoCommit: true }
  );
  if (!newUser) return res.status(400).send("Data Error");
  res.send("User resgistered!");
});
router.get("/:user_id", function (req, res, next) {
  res.send("respond with a resource");
});
module.exports = router;
