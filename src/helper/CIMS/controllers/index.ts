import xlsx from "xlsx";
import { IDecoratedRequest } from "core/Api/interfaces";
import trycatcher from "../../../utils/trycatcher";
import { ICIMSDumpRequest } from "../interfaces";

import { IUserCredentials } from "../../User/interfaces";

import CIMSMethods from "../";
import { CIMSTemplateFilename, ResourceSheetFilename } from "../constants";
import SystemError from "general/SystemError";
import { isSystemError } from "general/interfaces";

const dumpCtrl = {
  CIMSRequest: trycatcher(
    async (
      req: IDecoratedRequest<ICIMSDumpRequest, {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const { cimsFile, ProjectGUID } = req.payload;

      let file = new Buffer("");

      const res: string | SystemError = await new Promise(
        async (resolve, reject) => {
          cimsFile.on("data", data => {
            file = Buffer.concat([file, data]);
          });

          cimsFile.on("end", async () => {
            const xlsFile = xlsx.read(file, {
              type: "buffer",
              cellDates: true
            });
            const res = await CIMSMethods.CIMSParse(
              xlsFile,
              ProjectGUID,
              req.auth.credentials
            );
            if (isSystemError(res)) {
              reject(res);
            }
            resolve("ok");
          });
        }
      );

      return res;
    },
    { isRequest: true, logMessage: "CIMS Dump request" }
  ),
  CIMSRequest2: trycatcher(
    async (
      req: IDecoratedRequest<ICIMSDumpRequest, {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const { cimsFile, ProjectGUID } = req.payload;

      let file = new Buffer("");

      const res: string | SystemError = await new Promise(
        async (resolve, reject) => {
          cimsFile.on("data", data => {
            file = Buffer.concat([file, data]);
          });

          cimsFile.on("end", async () => {
            const xlsFile = xlsx.read(file, {
              type: "buffer",
              cellDates: true
            });
            const res = await CIMSMethods.CIMSParse2(xlsFile, ProjectGUID);
            if (isSystemError(res)) {
              reject(res);
            }
            resolve("ok");
          });
        }
      );

      return res;
    },
    { isRequest: true, logMessage: "CIMS Dump request" }
  ),
  ReadTemplate: trycatcher(
    (req, h) => {
      return h.file(`${__dirname}/../${CIMSTemplateFilename}`, {
        filename: CIMSTemplateFilename,
        mode: "attachment"
      });
    },
    {
      isRequest: true,
      logMessage: `CIMS Read template request`
    }
  ),
  ReadResourceSheet: trycatcher(
    async (req, h) => {
      await CIMSMethods.updateResourceSheet();
      return h.file(`${__dirname}/../${ResourceSheetFilename}`, {
        filename: ResourceSheetFilename,
        mode: "attachment"
      });
    },
    {
      isRequest: true,
      logMessage: `CIMS Read template request`
    }
  )
};

export default dumpCtrl;
