import Logger, { LogLevel } from "general/Logger";
import { moduleName } from "../constants";

const nomenLogger = new Logger({
  name: moduleName,
  logLevel: LogLevel.DEBUG
});

export default nomenLogger.logger;
