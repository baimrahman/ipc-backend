let connection;
var oracledb = require("oracledb");

(async () => {
  try {
    connection = await oracledb.getConnection({
      user: "IPCDB",
      password: "ipc170845",
      connectString: "localhost/orcl",
      privilege: oracledb.DEFAULT,
    });
    console.log("Successfully connected to Oracle!");
  } catch (err) {
    console.log("Error: ", err);
  }
})();

module.exports = {
  exe: async function (a, b, c) {
    try {
      const result = await connection.execute(a, b, c);
      return result;
    } catch (err) {
      console.log("Error: ", err);
    }
    // finally {
    //   if (connection) {
    //     try {
    //       await connection.close();
    //     } catch (err) {
    //       console.log("Error when closing the database connection: ", err);
    //     }
    //   }
    // }
  },
};
