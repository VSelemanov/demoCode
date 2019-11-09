import Umzug from "umzug";
import { Sequelize } from "sequelize";
import SeqConnect from "./database/connect";
import { server } from "./server";
import logger from "./utils/logger";

const umzug = new Umzug({
  storage: "sequelize",
  downName: "down",
  upName: "up",
  logging: false,

  storageOptions: {
    sequelize: SeqConnect
    // model: server.Fact
  },

  migrations: {
    params: [SeqConnect.getQueryInterface(), Sequelize],
    path: `${__dirname}`,
    // @ts-ignore
    traverseDirectories: true,
    pattern:
      process.env.APP_STATUS !== "dev" ? /migration\.js$/ : /migration\.ts$/
  }
});

umzug
  .up()
  .then(migrations => {
    logger.info(`migration complete --> ${migrations}`);
  })
  .catch(migrations => {
    logger.info(`migration error --> ${migrations}`);
  });

export default umzug;
