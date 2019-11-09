import trycatcher from "../../../utils/trycatcher";
import {
  ISystemBaseFlds,
  ISystem,
  ISystemBase,
  ISystemGetParams
} from "../interfaces";
import uuid = require("uuid");
import { routeName } from "../constants";
import { IDecoratedRequest } from "core/Api/interfaces";
import { IUserCredentials } from "../../User/interfaces";
import Boom from "boom";
import methods from "../";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, ISystemGetParams, IUserCredentials>,
      h
    ): Promise<ISystem[] | Boom> => {
      const params = req.query;
      // TODO: remove as
      const res = (await methods.read(params)) as Boom<any> | ISystem[];
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),
  create: trycatcher(
    async (
      req: IDecoratedRequest<
        Array<ISystemBase | ISystem>,
        {},
        IUserCredentials
      >,
      h
    ): Promise<ISystem[] | Boom> => {
      // TODO: remove as
      const res = (await methods.create(req.payload)) as Boom<any> | ISystem[];
      return res;
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
      req: IDecoratedRequest<ISystem[], {}, IUserCredentials>,
      h
    ): Promise<ISystem[]> => {
      const Systems = req.payload;
      const res = await methods.update(Systems);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  )
};

export default ctrl;
