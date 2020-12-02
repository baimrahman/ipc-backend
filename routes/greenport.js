var express = require("express");
var router = express.Router();
var conn = require("../services/database");
var oracledb = require("oracledb");
var moment = require("moment");
const { Console } = require("console");

router.get("/dash/:time", async (req, res) => {
  const uklist = await conn.exe("SELECT * FROM IPC_UNITKERJA", [], {
    outFormat: oracledb.OBJECT,
  });
  let dataSendGP = [];
  const keyNames = [
    "KP",
    "PG",
    "PL",
    "MK",
    "KU",
    "KL",
    "AT",
    "DP",
    "DK",
    "EM",
    "AI",
    "HS",
    "ML",
    "LB",
    "SB",
  ];
  const lengthNames = [23, 16, 14, 12, 26, 11, 6, 17, 4, 17, 12, 8, 17, 32, 6];
  for (let i = 0; i < uklist.rows.length; i++) {
    const sql = `SELECT * FROM IPC_GREENPORT JOIN IPC_UNITKERJA USING (unitkerja_id) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID} AND GP_PERIODE='${req.params.time}'`;
    const gp = await conn.exe(sql, [], {
      outFormat: oracledb.OBJECT,
    });

    if (gp.rows[0]) {
      dataSendGP.push(gp.rows[0]);
    } else {
      let dataEmp = { UK_NAME: uklist.rows[i].UK_NAME };
      for (let i = 0; i < keyNames.length; i++) {
        dataEmp[keyNames[i]] = "";
        for (let a = 0; a < lengthNames[i]; a++) {
          const tes = dataEmp[keyNames[i]];
          dataEmp[keyNames[i]] = tes.concat("0&%");
        }
      }
      dataSendGP.push(dataEmp);
    }
  }
  let dataKirim = dataSendGP;
  function tes(a) {
    let b = a.split("&%");
    b.pop();

    for (let i = 0; i < b.length; i++) {
      b[i] = Number(b[i]);
    }
    return b;
  }

  for (let a = 0; a < dataKirim.length; a++) {
    for (let i = 0; i < keyNames.length; i++) {
      dataKirim[a][keyNames[i]] = tes(dataKirim[a][keyNames[i]]);
    }
  }
  res.send(dataKirim);
});
/* GET users listing. */
router.get("/get-all-rating/:id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_GREENPORT JOIN IPC_UNITKERJA USING (unitkerja_id) WHERE UNITKERJA_ID=${req.params.id}`;

  req.query.periode !== undefined
    ? (sql = sql.concat(` AND GP_PERIODE='${req.query.periode}'`))
    : console.log("skip");
  if (req.params.id == "9999") {
    sql = `SELECT * FROM IPC_GREENPORT JOIN IPC_UNITKERJA USING (unitkerja_id)`;
    if (req.query.periode) {
      sql = sql.concat(` WHERE GP_PERIODE='${req.query.periode}'`);
    }
  }

  const dataGp = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataGp) return res.status(400).send("Data Error");
  let dataKirim = dataGp.rows;
  function tes(a) {
    let b = a.split("&%");
    b.pop();

    for (let i = 0; i < b.length; i++) {
      b[i] = Number(b[i]);
    }
    return b;
  }
  const keyNames = [
    "KP",
    "PG",
    "PL",
    "MK",
    "KU",
    "KL",
    "AT",
    "DP",
    "DK",
    "EM",
    "AI",
    "HS",
    "ML",
    "LB",
    "SB",
  ];
  for (let a = 0; a < dataKirim.length; a++) {
    for (let i = 0; i < keyNames.length; i++) {
      dataKirim[a][keyNames[i]] = tes(dataKirim[a][keyNames[i]]);
    }
  }

  res.send(dataKirim);
});

router.get("/get-last-rating/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM (SELECT * FROM IPC_GREENPORT JOIN IPC_UNITKERJA USING (UNITKERJA_ID) ORDER BY CREATEDAT DESC) WHERE UNITKERJA_ID=${req.params.uk_id} AND ROWNUM=1`;
  const dataGp = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });

  if (dataGp.rows.length === 0) return res.status(400).send("Data Error");
  let dataKirim = dataGp.rows[0];
  function tes(a) {
    let b = a.split("&%");
    b.pop();

    for (let i = 0; i < b.length; i++) {
      b[i] = Number(b[i]);
    }
    return b;
  }
  const keyNames = [
    "KP",
    "PG",
    "PL",
    "MK",
    "KU",
    "KL",
    "AT",
    "DP",
    "DK",
    "EM",
    "AI",
    "HS",
    "ML",
    "LB",
    "SB",
  ];
  for (let i = 0; i < keyNames.length; i++) {
    dataKirim[keyNames[i]] = tes(dataKirim[keyNames[i]]);
  }
  res.send(dataKirim);
});

router.get("/get-rating/:gp_id", async (req, res) => {
  let sql = `SELECT * FROM IPC_GREENPORT JOIN IPC_UNITKERJA USING (UNITKERJA_ID) WHERE GP_ID='${req.params.gp_id}'`;
  const dataGp = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  let dataKirim = dataGp.rows[0];
  function tes(a) {
    let b = a.split("&%");
    b.pop();

    for (let i = 0; i < b.length; i++) {
      b[i] = Number(b[i]);
    }
    return b;
  }
  const keyNames = [
    "KP",
    "PG",
    "PL",
    "MK",
    "KU",
    "KL",
    "AT",
    "DP",
    "DK",
    "EM",
    "AI",
    "HS",
    "ML",
    "LB",
    "SB",
  ];
  for (let i = 0; i < keyNames.length; i++) {
    dataKirim[keyNames[i]] = tes(dataKirim[keyNames[i]]);
  }
  if (!dataGp) return res.status(400).send("Data Error");
  res.send(dataKirim);
});

router.post("/post-rating", async function (req, res, next) {
  let data = {};
  const keyNames = [
    "kp",
    "pg",
    "pl",
    "mk",
    "ku",
    "kl",
    "at",
    "dp",
    "dk",
    "em",
    "ai",
    "hs",
    "ml",
    "lb",
    "sb",
  ];

  for (let i = 0; i < keyNames.length; i++) {
    const z = req.body[keyNames[i]];
    data[keyNames[i]] = "";
    for (let a = 0; a < z.length; a++) {
      data[keyNames[i]] += req.body[keyNames[i]][a] + "&%";
    }
  }
  let sql = `INSERT INTO IPC_GREENPORT VALUES (gp_id.nextval,${req.body.uk_id},${req.body.timestamp},'${data.kp}',
  '${data.pg}','${data.pl}','${data.mk}','${data.ku}','${data.kl}','${data.at}','${data.dp}',
  '${data.dk}','${data.em}','${data.ai}','${data.hs}','${data.ml}','${data.lb}','${data.sb}','${req.body.periode}')`;
  const dataGp = await conn.exe(sql, [], { autoCommit: true });
  if (!dataGp) return res.status(400).send("Data Error");
  res.send(dataGp);
});

router.put("/put-rating/:gp_id", async function (req, res, next) {
  let data = {};
  const keyNames = [
    "kp",
    "pg",
    "pl",
    "mk",
    "ku",
    "kl",
    "at",
    "dp",
    "dk",
    "em",
    "ai",
    "hs",
    "ml",
    "lb",
    "sb",
  ];

  for (let i = 0; i < keyNames.length; i++) {
    const z = req.body[keyNames[i]];
    data[keyNames[i]] = "";
    for (let a = 0; a < z.length; a++) {
      data[keyNames[i]] += req.body[keyNames[i]][a] + "&%";
    }
  }

  let sql = `UPDATE IPC_GREENPORT SET CREATEDAT=${req.body.timestamp},KP='${data.kp}',
  PG='${data.pg}',PL='${data.pl}',MK='${data.mk}',KU='${data.ku}',KL='${data.kl}',AT='${data.at}',DP='${data.dp}',
  DK='${data.dk}',EM='${data.em}',AI='${data.ai}',HS='${data.hs}',ML='${data.ml}',LB='${data.lb}',SB='${data.sb}',GP_PERIODE='${req.body.periode}'
  WHERE GP_ID='${req.params.gp_id}'`;

  const dataGp = await conn.exe(sql, [], { autoCommit: true });
  if (!dataGp) return res.status(400).send("Data Error");
  res.send(dataGp);
});
router.delete("/:id", async (req, res) => {
  let sql = `DELETE FROM IPC_GREENPORT WHERE GP_ID='${req.params.id}'`;
  const deleteGP = await conn.exe(sql, [], { autoCommit: true });
  res.send(deleteGP.rows);
});
module.exports = router;

// router.get("/get-all-rating-periode/:id", async function (req, res, next) {
//   let sql = `SELECT * FROM IPC_GREENPORT JOIN IPC_UNITKERJA USING (unitkerja_id) WHERE GP_PERIODE='${req.params.id}'`;
//   // req.params.id == "9999"
//   //   ? (sql = `SELECT * FROM IPC_GREENPORT JOIN IPC_UNITKERJA USING (unitkerja_id)`)
//   //   : (sql = sql);
//   const dataGp = await conn.exe(sql, [], {
//     outFormat: oracledb.OBJECT,
//   });
//   console.log(dataGp);
//   if (!dataGp) return res.status(400).send("Data Error");
//   let dataKirim = dataGp.rows;
//   function tes(a) {
//     let b = a.split("&%");
//     b.pop();

//     for (let i = 0; i < b.length; i++) {
//       b[i] = Number(b[i]);
//     }
//     return b;
//   }
//   const keyNames = [
//     "KP",
//     "PG",
//     "PL",
//     "MK",
//     "KU",
//     "KL",
//     "AT",
//     "DP",
//     "DK",
//     "EM",
//     "AI",
//     "HS",
//     "ML",
//     "LB",
//     "SB",
//   ];
//   for (let a = 0; a < dataKirim.length; a++) {
//     for (let i = 0; i < keyNames.length; i++) {
//       dataKirim[a][keyNames[i]] = tes(dataKirim[a][keyNames[i]]);
//     }
//   }

//   res.send(dataKirim);
// });
