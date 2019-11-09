import trycatcher from "../../../utils/trycatcher";
import {
  ISpaceBaseFlds,
  ISpaceBase,
  ISpace,
  ISpaceGetParams
} from "../interfaces";
import uuid = require("uuid");
import { routeName } from "../constants";
import { IDecoratedRequest } from "core/Api/interfaces";
import { IUserCredentials } from "../../User/interfaces";
import Boom from "boom";
import methods from "../";
import { isSystemError } from "general/interfaces";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, ISpaceGetParams, IUserCredentials>,
      h
    ): Promise<ISpace[]> => {
      const { FloorGUID } = req.query;
      // TODO: remove as
      return (await methods.read(FloorGUID)) as ISpace[];
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),
  create: trycatcher(
    async (
      req: IDecoratedRequest<Array<ISpaceBase | ISpace>, {}, IUserCredentials>,
      h
    ): Promise<ISpace[] | Boom> => {
      const Facilities = req.payload;
      // TODO: remove as
      const res: ISpace[] = (await methods.create(Facilities)) as ISpace[];
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
      req: IDecoratedRequest<ISpace[], {}, IUserCredentials>,
      h
    ): Promise<ISpace[]> => {
      const Facilities = req.payload;
      const res = await methods.update(Facilities);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  )
};

export default ctrl;
