import trycatcher from "../../../utils/trycatcher";
import {
  IFloorBaseFlds,
  IFloorBase,
  IFloor,
  IFloorGetParams
} from "../interfaces";
import uuid = require("uuid");
import { routeName } from "../constants";
import { IDecoratedRequest } from "core/Api/interfaces";
import { IUserCredentials } from "../../User/interfaces";
import { isSystemError } from "general/interfaces";
import Boom from "boom";
import methods from "../";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, IFloorGetParams, IUserCredentials>,
      h
    ): Promise<IFloor[]> => {
      const { FacilityGUID } = req.query;
      // TODO: fix types
      // @ts-ignore
      return await methods.read(FacilityGUID);
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),
  create: trycatcher(
    async (
      req: IDecoratedRequest<Array<IFloorBase | IFloor>, {}, IUserCredentials>,
      h
    ): Promise<IFloor[] | Boom> => {
      const Facilities = req.payload;
      // TODO: remove as
      const res: IFloor[] = (await methods.create(Facilities)) as IFloor[];
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
      req: IDecoratedRequest<IFloor[], {}, IUserCredentials>,
      h
    ): Promise<IFloor[]> => {
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
