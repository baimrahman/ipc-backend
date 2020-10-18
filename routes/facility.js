var express = require("express");
var router = express.Router();
var conn = require("../services/database");
var oracledb = require("oracledb");

/* GET users listing. */
router.get("/overview/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_FACILITY WHERE UNITKERJA_ID=${req.params.uk_id}`;
  req.params.uk_id == "9999"
    ? (sql = "SELECT * FROM IPC_FACILITY")
    : console.log(sql);
  if (req.query.type && req.params.uk_id === "9999") {
    sql = sql.concat(` WHERE TYPE='${req.query.type}'`);
  } else if (req.query.type) {
    sql = sql.concat(` AND TYPE='${req.query.type}'`);
  }
  console.log(sql);
  const facility = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!facility) return res.status(400).send("Data Error");
  res.send(facility.rows);
});

router.get("/details/:fid", async (req, res) => {
  let sql = `SELECT * FROM IPC_FACILITY WHERE FC_ID=${req.params.fid}`;
  const facility = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  res.send(facility.rows);
});

router.delete("/:fid", async (req, res) => {
  let sql = `DELETE FROM IPC_FACILITY WHERE FC_ID=${req.params.fid}`;
  const facility = await conn.exe(sql, [], { autoCommit: true });
  res.send(facility.rows);
});

router.put("/:fid", async (req, res) => {
  let sql = `UPDATE IPC_FACILITY SET CONTENT='${JSON.stringify(
    req.body.content
  )}',COVER='${JSON.stringify(req.body.cover)}',NAME='${
    req.body.name
  }',TIMESTAMP=${req.body.timestamp},OVERVIEW='${req.body.overview}',TYPE=${
    req.body.type
  } WHERE FC_ID=${req.params.fid}`;
  const facility = await conn.exe(sql, [], { autoCommit: true });
  res.send(facility.rows);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const cover = JSON.stringify(req.body.cover),
    content = JSON.stringify(req.body.content);
  let sql = `INSERT INTO IPC_FACILITY VALUES (fc_id.nextval,${req.body.unit},'${cover}','${req.body.name}',${req.body.timestamp},'${req.body.overview}','${content}',${req.body.type})`;
  console.log(sql);
  const facility = await conn.exe(sql, [], { autoCommit: true });
  if (!facility) return res.status(400).send("Data Error");
  res.send(facility);
});

router.get("/list-type", async (req, res) => {
  console.log("oooyy");
  let sql = `SELECT * FROM IPC_FACILITYTYPE`;
  const facility = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  res.send(facility.rows);
});

router.post("/list-type", async (req, res) => {
  let sql = `INSERT INTO IPC_FACILITYTYPE VALUES (tfc_id.nextval,'${req.body.name}')`;
  const facility = await conn.exe(sql, [], { autoCommit: true });
  if (!facility) return res.status(400).send("Data Error");
  res.send(facility);
});

router.put("/list-type/:id", async (req, res) => {
  let sql = `UPDATE IPC_FACILITYTYPE SET NAME='${req.body.name}' WHERE ID=${req.params.id}`;
  const facility = await conn.exe(sql, [], { autoCommit: true });
  res.send(facility);
});

router.delete("/list-type/:id", async (req, res) => {
  let sql = `DELETE FROM IPC_FACILITYTYPE WHERE ID=${req.params.id}`;
  const facility = await conn.exe(sql, [], { autoCommit: true });
  res.send(facility);
});

module.exports = router;
