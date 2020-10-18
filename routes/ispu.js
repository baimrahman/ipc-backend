var express = require("express");
var router = express.Router();
var conn = require("../services/database");
var oracledb = require("oracledb");
var moment = require("moment");
/* GET users listing. */
router.get("/map", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_LISTSENSOR`;
  // req.params.uk_id == "9999"
  //   ? (sql = `SELECT UK_NAME, UK_LAT, UK_LONG FROM IPC_UNITKERJA`)
  //   : (sql = sql);
  const dataPin = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataPin) return res.status(400).send("Data Error");
  res.send(dataPin.rows);
});
router.post("/record", async function (req, res, next) {
  let cekUk = await conn.exe(
    `SELECT * FROM IPC_LISTSENSOR WHERE SENSOR_ID='${req.body.sensor_id}'`,
    [],
    { outFormat: oracledb.OBJECT }
  );

  if (cekUk.rows.length === 0) return res.status(400).send("ID doesn't exist!");
  let sql = `INSERT INTO IPC_DATASENSOR VALUES (datasensor_id.nextval,'${
    req.body.sensor_id
  }',${req.body.co},
  ${req.body.pm2dot5},${req.body.pm10},${req.body.tsp},${req.body.no2},${
    req.body.so2
  },
  ${req.body.o3},${moment().unix()},${req.body.timestamp})`;
  const dataSensor = await conn.exe(sql, [], { autoCommit: true });
  if (!dataSensor) return res.status(400).send("Data Error");
  res.send(dataSensor);
});
router.get("/data/:sensor_id", async function (req, res, next) {
  let sql = `SELECT * 
  FROM (SELECT * FROM IPC_DATASENSOR ORDER BY CREATEDAT_LOGGER DESC )
  WHERE SENSOR_ID='${req.params.sensor_id}' AND ROWNUM=1`;
  const dataSensor = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataSensor) return res.status(400).send("Data Error");
  res.send(dataSensor.rows);
});
module.exports = router;
