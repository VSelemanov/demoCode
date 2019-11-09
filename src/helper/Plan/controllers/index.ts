import trycatcher from "../../../utils/trycatcher";
import {
  IPlanBase,
  IPlanInstance,
  IPlan,
  IPlanGetParams,
  IPlanGetResponse
} from "../interfaces";
import uuid = require("uuid");
import { IDecoratedRequest } from "core/Api/interfaces";
import methods from "../index";
import utils from "../../../utils";
import { IUserCredentials } from "../../User/interfaces";
import { routeName } from "../constants";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, IPlanGetParams, IUserCredentials>,
      h
    ): Promise<IPlanGetResponse> => {
      const { ComponentGUID } = req.query;
      const res = await methods.read(ComponentGUID);
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),

  create: trycatcher(
    async (
      req: IDecoratedRequest<IPlanBase, {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const { ComponentGUID, isResource, value, JobGUID } = req.payload;
      const res = await methods.create([
        {
          ComponentGUID,
          isResource,
          value,
          JobGUID
        }
      ]);
      return utils.mapElementsToJSON(res)[0];
    },
    { logMessage: `${routeName} create request`, isRequest: true }
  )
};

export default ctrl;
