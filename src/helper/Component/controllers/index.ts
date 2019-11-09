import trycatcher from "../../../utils/trycatcher";
import {
  IComponentBaseFlds,
  IComponentBase,
  IComponentGetParams
} from "../interfaces";
import uuid = require("uuid");
import { routeName } from "../constants";
import { IDecoratedRequest } from "core/Api/interfaces";
import { IUserCredentials } from "../../User/interfaces";
import { IComponent } from "../../Component/interfaces";
import Boom from "boom";
import methods from "../";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, IComponentGetParams, IUserCredentials>,
      h
    ): Promise<IComponent[] | Boom> => {
      const params = req.query;
      const res = await methods.read(params);

      // TODO: fix types
      // @ts-ignore
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),
  create: trycatcher(
    async (
      req: IDecoratedRequest<
        Array<IComponentBase | IComponent>,
        {},
        IUserCredentials
      >,
      h
    ): Promise<IComponent[] | Boom> => {
      const res = await methods.create(req.payload);
      // TODO: fix types
      // @ts-ignore
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
      req: IDecoratedRequest<IComponent[], {}, IUserCredentials>,
      h
    ): Promise<IComponent[]> => {
      const Components = req.payload;
      const res = await methods.update(Components);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  )
};

export default ctrl;
