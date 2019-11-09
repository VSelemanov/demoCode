import { server } from "../../server";
import {
  ISystem,
  ISystemBase,
  ISystemInstance,
  ISystemGetParams
} from "./interfaces";
import utils from "../../utils";
import trycatcher from "../../utils/trycatcher";
import { routeName } from "./constants";

const methods = {
  read: trycatcher(
    async (params: ISystemGetParams): Promise<ISystem[]> => {
      const where = {};
      for (const paramKey of Object.keys(params)) {
        where[paramKey] = params[paramKey];
      }

      const Systems = await server.System.findAll({ where });
      return utils.mapElementsToJSON(Systems);
    },
    { logMessage: `${routeName} read method` }
  ),
  create: trycatcher(
    async (rows: Array<ISystemBase | ISystem>): Promise<ISystem[]> => {
      const r = await utils.createRows<ISystemBase | ISystem, ISystem>(
        rows,
        server.System
      );
      return utils.mapElementsToJSON(r);
    },
    { logMessage: `${routeName} create method` }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.System);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Systems: ISystem[]): Promise<any> => {
      const UPDSystems = await utils.updateRows<ISystem>(
        Systems,
        server.System
      );
      return utils.mapElementsToJSON(UPDSystems);
    },
    { logMessage: `${routeName} update method` }
  )
};

export default methods;
