import trycatcher from "../../../utils/trycatcher";
import { IMeasureBase, IMeasureInstance, IMeasure } from "../interfaces";
import uuid = require("uuid");
import { IDecoratedRequest } from "core/Api/interfaces";
import methods from "../index";
import utils from "../../../utils";
import { IUserCredentials } from "../../User/interfaces";
import { routeName } from "../constants";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, IUserCredentials>,
      h
    ): Promise<IMeasure[]> => {
      const res = await methods.read();
      return utils.mapElementsToJSON(res);
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),

  create: trycatcher(
    async (
      req: IDecoratedRequest<IMeasureBase[], {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const MeasureBase: IMeasureBase[] = req.payload;
      const res = await methods.create(MeasureBase);
      return utils.mapElementsToJSON(res);
    },
    { logMessage: `${routeName} create request`, isRequest: true }
  ),
  delete: trycatcher(
    async (
      req: IDecoratedRequest<string[], {}, IUserCredentials>,
      h
    ): Promise<string> => {
      const GUIDs = req.payload;
      const res = await methods.delete(GUIDs);
      return "ok";
    },
    {
      logMessage: `${routeName} delete request`,
      isRequest: true
    }
  ),
  update: trycatcher(
    async (
      req: IDecoratedRequest<IMeasure[], {}, IUserCredentials>,
      h
    ): Promise<IMeasure[]> => {
      const Measures = req.payload;
      const res = await methods.update(Measures);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  )
};

export default ctrl;
