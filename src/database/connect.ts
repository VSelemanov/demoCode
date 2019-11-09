import Sequelize from "sequelize";
import SH from "sequelize-hierarchy";

// import CLS from "continuation-local-storage";
import CLS from "cls-hooked";

const namespace = CLS.createNamespace("pss-namespace");

SH(Sequelize);

Sequelize.useCLS(namespace);

const seq = new Sequelize.Sequelize(
  process.env.DB || "postgres",
  process.env.DBUSERNAME || "postgres",
  process.env.DBPASSWORD || "postgres",
  {
    host: process.env.DBHOST || "localhost",
    port: parseInt(process.env.DBPORT || "5432", 10),
    dialect: "postgres",
    logging: process.env.SEQUELIZE_LOGGING ? console.log : false
  }
);

export default seq;
