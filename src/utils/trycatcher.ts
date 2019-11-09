import { isSystemError } from "general/interfaces";
import { server } from "../server";
import Boom from "boom";

import logger from "./logger";
import SystemError from "general/SystemError";
import { ErrorCodes, ErrorCode } from "general/constants";

interface ITrycatcherOptions {
  logMessage: string;
  isRequest?: boolean;
  logFunction?: any;
  isException?: boolean;
}

export default function trycatcher(
  f: (...params) => void,
  options: ITrycatcherOptions = {
    logMessage: "Undescripted message error",
    isRequest: false,
    isException: false
  }
) {
  return async function(...params): Promise<any | Boom> {
    try {
      const res = await f(...params);
      if (isSystemError(res)) {
        throw res;
      }
      return res;
    } catch (error) {
      // console.log({ error });
      logger.error(
        `${options.logMessage} ---> ${error}`,
        error.trace,
        error.stack
      );
      const message = error.message
        ? error.message
        : error._message
        ? error.message
        : error;

      const code = error.message
        ? error.code
        : error._code
        ? error.code
        : ErrorCode.BAD_REQUEST;

      if (options.isRequest) {
        return server.generateHttpError({
          code,
          message
        });
      } else if (options.isException) {
        throw new SystemError({
          code,
          message
        });
      } else {
        return new SystemError({
          code,
          message
        });
      }
    }
  };
}
