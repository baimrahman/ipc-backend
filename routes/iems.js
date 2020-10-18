var express = require("express");
var router = express.Router();
var conn = require("../services/database");
var oracledb = require("oracledb");
var multer = require("multer");
var moment = require("moment");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/storage/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
var upload = multer({ storage });

router.get("/dash-rkl/:time", async (req, res) => {
  const uklist = await conn.exe("SELECT * FROM IPC_UNITKERJA", [], {
    outFormat: oracledb.OBJECT,
  });
  let dataSendRKL = [];
  for (let i = 0; i < uklist.rows.length; i++) {
    const test = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_DATARKL JOIN IPC_MATRIKSRKL USING (MATRIKSRKL_ID) WHERE DATAPERIODE='${req.params.time}' ) JOIN IPC_IZINLINGKUNGAN USING (IL_ID)) JOIN IPC_UNITKERJA USING (UNITKERJA_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}`;
    const matriks = await conn.exe(test, [], {
      outFormat: oracledb.OBJECT,
    });
    console.log(matriks);
    // const ildateq = `SELECT * FROM (SELECT * FROM IPC_IZINLINGKUNGAN ORDER BY IL_DATE DESC) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID} AND ROWNUM=1`;
    // const ildate = await conn.exe(ildateq, [], {
    //   outFormat: oracledb.OBJECT,
    // });
    // const sql = `SELECT * FROM (SELECT * FROM IPC_MATRIKSRKL JOIN IPC_IZINLINGKUNGAN USING (IL_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}) AND IL_DATE=${ildate.rows[0].IL_DATE}`;
    // const matriks = await conn.exe(sql, [], {
    //   outFormat: oracledb.OBJECT,
    // });
    let jumlahParam = 0;
    let jumlahParamRep = 0;
    for (let index = 0; index < matriks.rows.length; index++) {
      const a = JSON.parse(matriks.rows[0].MRKL_UPENGELOLAAN);
      const b = JSON.parse(matriks.rows[0].DATACAPAI);
      jumlahParam += a.length;
      for (let i = 0; i < b.length; i++) {
        if (b !== "") {
          jumlahParamRep += 1;
        }
      }
    }

    dataSendRKL.push({
      name: uklist.rows[i].UK_NAME,
      rkl: jumlahParam,
      rklRep: jumlahParamRep,
    });
  }
  res.send(dataSendRKL);
});
router.get("/dash-rpl/:time", async (req, res) => {
  const uklist = await conn.exe("SELECT * FROM IPC_UNITKERJA", [], {
    outFormat: oracledb.OBJECT,
  });
  let dataSendRPL = [];
  for (let i = 0; i < uklist.rows.length; i++) {
    const test = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_DATARPL JOIN IPC_MATRIKSRPL USING (MATRIKSRPL_ID) WHERE DATAPERIODE='${req.params.time}' ) JOIN IPC_IZINLINGKUNGAN USING (IL_ID)) JOIN IPC_UNITKERJA USING (UNITKERJA_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}`;
    const matriks = await conn.exe(test, [], {
      outFormat: oracledb.OBJECT,
    });
    console.log(matriks);
    // const ildateq = `SELECT * FROM (SELECT * FROM IPC_IZINLINGKUNGAN ORDER BY IL_DATE DESC) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID} AND ROWNUM=1`;
    // const ildate = await conn.exe(ildateq, [], {
    //   outFormat: oracledb.OBJECT,
    // });
    // const sql = `SELECT * FROM (SELECT * FROM IPC_MATRIKSRKL JOIN IPC_IZINLINGKUNGAN USING (IL_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}) AND IL_DATE=${ildate.rows[0].IL_DATE}`;
    // const matriks = await conn.exe(sql, [], {
    //   outFormat: oracledb.OBJECT,
    // });
    let jumlahParam = 0;
    let jumlahParamRep = 0;
    for (let index = 0; index < matriks.rows.length; index++) {
      const a = JSON.parse(matriks.rows[0].MRPL_UPENGELOLAAN);
      const b = JSON.parse(matriks.rows[0].DATACAPAI);
      jumlahParam += a.length;
      for (let i = 0; i < b.length; i++) {
        if (b !== "") {
          jumlahParamRep += 1;
        }
      }
    }

    dataSendRPL.push({
      name: uklist.rows[i].UK_NAME,
      rpl: jumlahParam,
      rplRep: jumlahParamRep,
    });
  }
  res.send(dataSendRPL);
});
router.get("/dash", async (req, res) => {
  const uklist = await conn.exe("SELECT * FROM IPC_UNITKERJA", [], {
    outFormat: oracledb.OBJECT,
  });
  let dataSendRKL = [];
  let dataSendRPL = [];
  for (let i = 0; i < uklist.rows.length; i++) {
    const rkl = await conn.exe(
      `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_MATRIKSRKL JOIN IPC_IZINLINGKUNGAN USING (IL_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}) ORDER BY IL_DATE DESC) WHERE ROWNUM=1`,
      [],
      {
        outFormat: oracledb.OBJECT,
      }
    );

    const rklLapor = await conn.exe(
      `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_MATRIKSRKL JOIN IPC_IZINLINGKUNGAN USING (IL_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}) JOIN IPC_DATARKL USING (MATRIKSRKL_ID) ORDER BY IL_DATE DESC) WHERE ROWNUM=1`,
      [],
      {
        outFormat: oracledb.OBJECT,
      }
    );
    // console.log(rkl);
    const rpl = await conn.exe(
      `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_MATRIKSRPL JOIN IPC_IZINLINGKUNGAN USING (IL_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}) ORDER BY IL_DATE DESC) WHERE ROWNUM=1`,
      [],
      {
        outFormat: oracledb.OBJECT,
      }
    );
    const rplLapor = await conn.exe(
      `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_MATRIKSRPL JOIN IPC_IZINLINGKUNGAN USING (IL_ID) WHERE UNITKERJA_ID=${uklist.rows[i].UNITKERJA_ID}) JOIN IPC_DATARPL USING (MATRIKSRPL_ID) ORDER BY IL_DATE DESC) WHERE ROWNUM=1`,
      [],
      {
        outFormat: oracledb.OBJECT,
      }
    );

    if (rpl.rows[0]) {
      const mrplUPengelolaan = JSON.parse(rpl.rows[0].MRPL_UPENGELOLAAN);
      const mrplParam = JSON.parse(rpl.rows[0].MRPL_PARAMPEMANTAUAN);
      let dataRepCapaiRPL = 0;
      let dataRepParamRPL = 0;
      if (rplLapor.rows[0]) {
        const rplRepDataCapai = JSON.parse(rplLapor.rows[0].DATACAPAI);
        const rplRepParam = JSON.parse(rplLapor.rows[0].DATAPARAM);

        for (let a = 0; a < rplRepDataCapai.length; a++) {
          if (rplRepDataCapai[a] === true) {
            dataRepCapaiRPL++;
          }
        }

        for (let a = 1; a < rplRepParam[0].length; a++) {
          if (rplRepParam[0][a] != "") {
            dataRepParamRPL++;
          }
        }
      }
      dataSendRPL.push({
        name: `${uklist.rows[i].UK_NAME}`,

        rpl: mrplUPengelolaan.length + mrplParam.length,
        rplRep: dataRepCapaiRPL + dataRepParamRPL,
      });
    } else {
      dataSendRPL.push({ name: uklist.rows[i].UK_NAME, rpl: 0, rplRep: 0 });
    }
    if (rkl.rows[0]) {
      const mrklUPengelolaan = JSON.parse(rkl.rows[0].MRKL_UPENGELOLAAN);

      let dataRepRKL = 0;
      if (rklLapor.rows[0]) {
        const rklRepDataCapai = JSON.parse(rklLapor.rows[0].DATACAPAI);
        for (let a = 0; a < rklRepDataCapai.length; a++) {
          if (rklRepDataCapai[a] === true) {
            dataRepRKL++;
          }
        }
      }

      dataSendRKL.push({
        name: `${uklist.rows[i].UK_NAME}`,
        rkl: mrklUPengelolaan.length,
        rklRep: dataRepRKL,
      });
    } else {
      dataSendRKL.push({ name: uklist.rows[i].UK_NAME, rkl: 0, rklRep: 0 });
    }
  }
  res.send({ rkl: dataSendRKL, rpl: dataSendRPL });
});
router.post("/img", upload.single("picture"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send({ path: file.path.slice(6) });
});
router.get("/map", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_UNITKERJA`;
  // req.params.uk_id == "9999"
  //   ? (sql = `SELECT UK_NAME, UK_LAT, UK_LONG FROM IPC_UNITKERJA`)
  //   : (sql = sql);
  const dataPin = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataPin) return res.status(400).send("Data Error");
  res.send(dataPin.rows);
});
router.get("/list-periode", async (req, res) => {
  const sql = "SELECT * FROM IPC_PERIODE ORDER BY PERIODE ASC";
  const periode = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  res.send(periode.rows);
});
router.get("/bukti/:uk_id", async function (req, res, next) {
  let sql;
  req.params.uk_id == "9999"
    ? (sql =
        "SELECT * FROM IPC_BUKTIPELAPORAN JOIN IPC_IZINLINGKUNGAN USING (il_id)")
    : (sql = `SELECT * FROM IPC_IZINLINGKUNGAN JOIN IPC_BUKTIPELAPORAN USING (il_id)
  WHERE UNITKERJA_ID=${req.params.uk_id}`);
  const dataBukti = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataBukti) return res.status(400).send("Data Error");
  res.send(dataBukti.rows);
});
router.post("/bukti", async function (req, res, next) {
  let sql = `INSERT INTO IPC_BUKTIPELAPORAN VALUES (bp_id.nextval,${req.body.il_id},'${req.body.bp_doclink}','${req.body.bp_periode}','${req.body.bp_instansi}')`;
  const dataBukti = await conn.exe(sql, [], { autoCommit: true });
  if (!dataBukti) return res.status(400).send("Data Error");
  res.send(dataBukti);
});
router.get("/bukti-view/:bukti_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_BUKTIPELAPORAN WHERE BP_ID=${req.params.bukti_id}`;
  const dataBukti = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataBukti) return res.status(400).send("Data Error");
  res.send(dataBukti.rows);
});
router.put("/bukti/:bukti_id", async function (req, res, next) {
  let sql = `UPDATE IPC_BUKTIPELAPORAN SET BP_DOCLINK='${req.body.bp_doclink}', BP_PERIODE='${req.body.bp_periode}', BP_INSTANSI='${req.body.bp_instansi}' WHERE BP_ID=${req.params.bukti_id}`;
  const dataBukti = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataBukti) return res.status(400).send("Data Error");
  res.send(dataBukti.rows);
});
router.post("/il", async function (req, res, next) {
  console.log(req.body.uk_id);
  console.log(req.body);
  let sql = `INSERT INTO IPC_IZINLINGKUNGAN VALUES (il_id.nextval,${req.body.uk_id},'${req.body.il_name}','${req.body.il_mapzonasi_link}','${req.body.il_mapbaswil_link}','${req.body.il_maprkl_link}','${req.body.il_maprpl_link}',${req.body.date},'${req.body.il_nomorizin}','${req.body.il_content}')`;
  const dataIzinLing = await conn.exe(sql, [], { autoCommit: true });
  if (!dataIzinLing) return res.status(400).send("Data Error");
  res.send(dataIzinLing);
});
router.get("/il/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_IZINLINGKUNGAN JOIN IPC_UNITKERJA USING (unitkerja_id) WHERE UNITKERJA_ID='${req.params.uk_id}'`;
  req.params.uk_id == "9999"
    ? (sql =
        "SELECT * FROM IPC_IZINLINGKUNGAN JOIN IPC_UNITKERJA USING (unitkerja_id)")
    : (sql = sql);
  const dataIzinLing = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataIzinLing) return res.status(400).send("Data Error");
  res.send(dataIzinLing.rows);
});
router.get("/il-view/:il_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_IZINLINGKUNGAN WHERE IL_ID='${req.params.il_id}'`;
  const dataIzinLing = await conn.exe(sql, [], {
    outFormat: oracledb.OBJECT,
  });
  if (!dataIzinLing) return res.status(400).send("Data Error");
  res.send(dataIzinLing.rows);
});
router.put("/il/:il_id", async function (req, res, next) {
  console.log(req.body);
  let sql = `UPDATE IPC_IZINLINGKUNGAN SET UNITKERJA_ID='${req.body.uk_id}',IL_DATE='${req.body.il_date}',IL_NAME='${req.body.il_name}',IL_CONTENT='${req.body.il_content}',IL_MAPZONASI_LINK='${req.body.il_mapzonasi_link}',IL_MAPBASWIL_LINK='${req.body.il_mapbaswil_link}',IL_MAPRKL_LINK='${req.body.il_maprkl_link}',IL_MAPRPL_LINK='${req.body.il_maprpl_link}',IL_NOMORIZIN='${req.body.il_nomorizin}' 
  WHERE IL_ID='${req.params.il_id}'`;
  const dataIzinLing = await conn.exe(sql, [], { autoCommit: true });
  if (!dataIzinLing) return res.status(400).send("Data Error");
  res.send(dataIzinLing.rows);
});
router.get("/il-latest/:uk_id", async function (req, res, next) {
  let sql = `SELECT * 
  FROM (SELECT * FROM IPC_IZINLINGKUNGAN ORDER BY IL_DATE DESC )
  WHERE UNITKERJA_ID='${req.params.uk_id}' AND ROWNUM=1`;
  req.params.uk_id == "9999"
    ? (sql = `SELECT * 
      FROM (SELECT * FROM IPC_IZINLINGKUNGAN ORDER BY IL_DATE DESC )
      WHERE ROWNUM=1`)
    : (sql = sql);
  const dataIzinLing = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataIzinLing) return res.status(400).send("Data Error");
  res.send(dataIzinLing.rows);
});
router.get("/rkl/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (unitkerja_id)) JOIN IPC_MATRIKSRKL USING (il_id) WHERE UNITKERJA_ID='${req.params.uk_id}'`;
  req.params.uk_id == "9999"
    ? (sql = `SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (unitkerja_id)) JOIN IPC_MATRIKSRKL USING (il_id)`)
    : (sql = sql);
  const dataRKL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL.rows);
});
router.get("/rkl-matriks-il/:il_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_MATRIKSRKL WHERE IL_ID='${req.params.il_id}'`;
  const dataRKL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL.rows);
});
router.get("/rkl-matriks/:matriks_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_MATRIKSRKL WHERE MATRIKSRKL_ID='${req.params.matriks_id}'`;
  const dataRKL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL.rows);
});
router.put("/rkl-matriks/:matriks_id", async function (req, res, next) {
  let sql = `UPDATE IPC_MATRIKSRKL SET MRKL_TAHAPAN='${req.body.mrkl_tahapan}',
  MRKL_KEGIATAN='${req.body.mrkl_kegiatan}',MRKL_SUMBERDAMPAK='${
    req.body.mrkl_sumberdampak
  }',MRKL_JENLIMBAH='${req.body.mrkl_jenlimbah}',MRKL_BESDAMPAK='${
    req.body.mrkl_besdampak
  }',MRKL_TOLUKUR='${req.body.mrkl_tolukur}',
  MRKL_TUJUAN='${req.body.mrkl_tujuan}',MRKL_UPENGELOLAAN='${
    req.body.mrkl_upengelolaan
  }',MRKL_LOC='${req.body.mrkl_loc}',MRKL_PERIODE='${
    req.body.mrkl_periode
  }',MRKL_PELAKSANA='${req.body.mrkl_pelaksana}',
  MRKL_PENGAWAS='${req.body.mrkl_pengawas}',MRKL_PELAPORAN='${
    req.body.mrkl_pelaporan
  }',MRKL_UPDATEAT='${moment().unix()}'
  WHERE MATRIKSRKL_ID='${req.params.matriks_id}'`;
  const dataRKL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL);
});
router.post("/rkl-new", async function (req, res, next) {
  let sql = `INSERT INTO IPC_MATRIKSRKL VALUES (matriksrkl_id.nextval,${
    req.body.il_id
  },'${req.body.mrkl_tahapan}',
  '${req.body.mrkl_kegiatan}','${req.body.mrkl_sumberdampak}','${
    req.body.mrkl_jenlimbah
  }','${req.body.mrkl_besdampak}','${req.body.mrkl_tolukur}',
  '${req.body.mrkl_tujuan}','${req.body.mrkl_upengelolaan}','${
    req.body.mrkl_loc
  }','${req.body.mrkl_periode}','${req.body.mrkl_pelaksana}',
  '${req.body.mrkl_pengawas}','${
    req.body.mrkl_pelaporan
  }',${moment().unix()},${moment().unix()})`;
  const dataRKL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL);
});
router.get("/rkl-report/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (UNITKERJA_ID)) JOIN IPC_MATRIKSRKL USING (IL_ID)) JOIN IPC_DATARKL USING (MATRIKSRKL_ID) 
  WHERE UNITKERJA_ID='${req.params.uk_id}'`;
  req.params.uk_id == "9999"
    ? (sql = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (UNITKERJA_ID)) JOIN IPC_MATRIKSRKL USING (IL_ID)) JOIN IPC_DATARKL USING (MATRIKSRKL_ID)`)
    : (sql = sql);
  const dataRKL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL.rows);
});
router.post("/rkl-report-new", async function (req, res, next) {
  console.log(req.body);
  let sql = `INSERT INTO IPC_DATARKL VALUES (datarkl_id.nextval,${
    req.body.matriksrkl_id
  },'${req.body.datacapai}',
  '${req.body.datahasil}',${moment().unix()},${moment().unix()},'${
    req.body.data
  }','${req.body.periode}')`;
  const dataRKL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL);
});
router.put("/rkl-report/:report_id", async function (req, res, next) {
  console.log(req.body);
  let sql = `UPDATE IPC_DATARKL SET DATA='${req.body.data}', DATACAPAI='${
    req.body.datacapai
  }', DATAHASIL='${
    req.body.datahasil
  }', UPDATEDAT=${moment().unix()}, DATAPERIODE='${req.body.periode}'
  WHERE DATARKL_ID=${req.params.report_id}`;
  const dataRKL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL);
});
router.get("/rkl-report/:report_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_MATRIKSRKL JOIN IPC_DATARKL USING (MATRIKSRKL_ID) WHERE DATARKL_ID='${req.params.report_id}'`;
  const dataRKL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL.rows);
});
router.get("/rpl/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (unitkerja_id)) JOIN IPC_MATRIKSRPL USING (il_id) WHERE UNITKERJA_ID='${req.params.uk_id}'`;
  req.params.uk_id == "9999"
    ? (sql = `SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (unitkerja_id)) JOIN IPC_MATRIKSRPL USING (il_id)`)
    : (sql = sql);
  const dataRPL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL.rows);
});
router.get("/rpl-matriks/:matriks_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_MATRIKSRPL WHERE MATRIKSRPL_ID='${req.params.matriks_id}'`;
  const dataRPL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL.rows);
});
router.put("/rpl-matriks/:matriks_id", async function (req, res, next) {
  let sql = `UPDATE IPC_MATRIKSRPL SET MRPL_TAHAPAN='${req.body.mrpl_tahapan}',
  MRPL_KEGIATAN='${req.body.mrpl_kegiatan}',MRPL_SUMBERDAMPAK='${
    req.body.mrpl_sumberdampak
  }',MRPL_JENLIMBAH='${req.body.mrpl_jenlimbah}',MRPL_BESDAMPAK='${
    req.body.mrpl_besdampak
  }',MRPL_TOLUKUR='${req.body.mrpl_tolukur}',
  MRPL_TUJUAN='${req.body.mrpl_tujuan}',MRPL_UPENGELOLAAN='${
    req.body.mrpl_upengelolaan
  }',MRPL_LOC='${req.body.mrpl_loc}',MRPL_PERIODE='${
    req.body.mrpl_periode
  }',MRPL_PELAKSANA='${req.body.mrpl_pelaksana}',
  MRPL_PENGAWAS='${req.body.mrpl_pengawas}',MRPL_PELAPORAN='${
    req.body.mrpl_pelaporan
  }',MRPL_UPDATEAT=${moment().unix()},MRPL_PARAMPEMANTAUAN='${
    req.body.mrpl_parampemantauan
  }'
  WHERE MATRIKSRPL_ID='${req.params.matriks_id}'`;
  const dataRPL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL);
});
router.post("/rpl-new", async function (req, res, next) {
  let sql = `INSERT INTO IPC_MATRIKSRPL VALUES (matriksrpl_id.nextval,'${
    req.body.il_id
  }','${req.body.mrpl_tahapan}',
  '${req.body.mrpl_kegiatan}','${req.body.mrpl_sumberdampak}','${
    req.body.mrpl_jenlimbah
  }','${req.body.mrpl_besdampak}','${req.body.mrpl_tolukur}',
  '${req.body.mrpl_tujuan}','${req.body.mrpl_upengelolaan}','${
    req.body.mrpl_loc
  }','${req.body.mrpl_periode}','${req.body.mrpl_pelaksana}',
  '${req.body.mrpl_pengawas}','${
    req.body.mrpl_pelaporan
  }',${moment().unix()},${moment().unix()},'${req.body.mrpl_parampemantauan}')`;
  const dataRPL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL);
});
router.get("/rpl-report/:uk_id", async function (req, res, next) {
  let sql = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (UNITKERJA_ID)) JOIN IPC_MATRIKSRPL USING (IL_ID)) JOIN IPC_DATARPL USING (MATRIKSRPL_ID) 
  WHERE UNITKERJA_ID='${req.params.uk_id}'`;

  req.params.uk_id == "9999"
    ? (sql = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (UNITKERJA_ID)) JOIN IPC_MATRIKSRPL USING (IL_ID)) JOIN IPC_DATARPL USING (MATRIKSRPL_ID)`)
    : (sql = sql);
  const dataRPL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL.rows);
});
router.post("/rpl-report-new", async function (req, res, next) {
  console.log(req.body);
  let sql = `INSERT INTO IPC_DATARPL VALUES (datarpl_id.nextval,${
    req.body.matriksrpl_id
  },'${req.body.data}',
  '${req.body.dataparam}',${moment().unix()},${moment().unix()},'${
    req.body.datacapai
  }',
  '${req.body.datahasil}','${req.body.periode}')`;
  const dataRPL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL);
});
router.put("/rpl-report/:report_id", async function (req, res, next) {
  let sql = `UPDATE IPC_DATARPL SET DATA='${req.body.data}', DATAPARAM='${
    req.body.dataparam
  }', UPDATEDAT=${moment().unix()}, DATACAPAI='${
    req.body.datacapai
  }', DATAHASIL='${req.body.datahasil}',DATAPERIODE='${req.body.periode}'
  WHERE DATARPL_ID=${req.params.report_id}`;
  const dataRPL = await conn.exe(sql, [], { autoCommit: true });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL);
});
router.get("/rpl-matriks-il/:il_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_MATRIKSRPL WHERE IL_ID='${req.params.il_id}'`;
  const dataRKL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRKL) return res.status(400).send("Data Error");
  res.send(dataRKL.rows);
});
router.get("/rpl-report/:report_id", async function (req, res, next) {
  let sql = `SELECT * FROM IPC_MATRIKSRPL JOIN IPC_DATARPL USING (MATRIKSRPL_ID) WHERE DATARPL_ID='${req.params.report_id}'`;
  const dataRPL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
  if (!dataRPL) return res.status(400).send("Data Error");
  res.send(dataRPL.rows);
});
router.get("/:uk_id", function (req, res, next) {
  res.send("respond with a resource");
});
router.delete("/il/:id", async (req, res) => {
  let sql = `DELETE FROM IPC_IZINLINGKUNGAN WHERE IL_ID='${req.params.id}'`;
  const deleteIL = await conn.exe(sql, [], { autoCommit: true });
  res.send(deleteIL.rows);
});
router.delete("/mrkl/:id", async (req, res) => {
  let sql = `DELETE FROM IPC_MATRIKSRKL WHERE MATRIKSRKL_ID='${req.params.id}'`;
  const deleteRKL = await conn.exe(sql, [], { autoCommit: true });
  res.send(deleteRKL.rows);
});
router.delete("/mrpl/:id", async (req, res) => {
  let sql = `DELETE FROM IPC_MATRIKSRPL WHERE MATRIKSRPL_ID='${req.params.id}'`;
  const deleteRPL = await conn.exe(sql, [], { autoCommit: true });
  res.send(deleteRPL.rows);
});
router.delete("/mrkl-rep/:id", async (req, res) => {
  let sql = `DELETE FROM IPC_DATARKL WHERE DATARKL_ID='${req.params.id}'`;
  const deleteDataRKL = await conn.exe(sql, [], { autoCommit: true });
  res.send(deleteDataRKL.rows);
});
router.delete("/mrpl-rep/:id", async (req, res) => {
  let sql = `DELETE FROM IPC_DATARPL WHERE DATARPL_ID='${req.params.id}'`;
  const deleteDataRPL = await conn.exe(sql, [], { autoCommit: true });
  res.send(deleteDataRPL.rows);
});
module.exports = router;

// router.get("/rkl-newest/:uk_id", async function (req, res, next) {
//   let sql = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (unitkerja_id)) JOIN IPC_MATRIKSRKL USING (il_id) WHERE UNITKERJA_ID='${req.params.uk_id}' ORDER BY MRKL_CREATEDAT DESC) WHERE ROWNUM=1`;
//   req.params.uk_id == "9999"
//     ? (sql = `SELECT * FROM (SELECT * FROM (SELECT * FROM IPC_UNITKERJA JOIN IPC_IZINLINGKUNGAN USING (unitkerja_id)) JOIN IPC_MATRIKSRKL USING (il_id) ORDER BY MRKL_CREATEDAT DESC) WHERE ROWNUM=1`)
//     : (sql = sql);
//   const dataRKL = await conn.exe(sql, [], { outFormat: oracledb.OBJECT });
//   if (!dataRKL) return res.status(400).send("Data Error");
//   res.send(dataRKL.rows);
// });
