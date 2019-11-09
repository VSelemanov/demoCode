import { server } from "../../server";
import {
  IComponent,
  IComponentBase,
  IComponentInstance,
  IComponentGetParams
} from "./interfaces";
import utils from "../../utils";
import { routeName } from "./constants";
import trycatcher from "../../utils/trycatcher";

const methods = {
  read: trycatcher(
    async (params: IComponentGetParams): Promise<IComponent[]> => {
      const where = {};
      for (const paramKey of Object.keys(params)) {
        if (params[paramKey] !== undefined) {
          where[paramKey] = params[paramKey];
        }
      }

      const Components = await server.Component.findAll({ where });
      return utils.mapElementsToJSON(Components);
    },
    { logMessage: `${routeName} read method` }
  ),
  create: trycatcher(
    async (rows: Array<IComponentBase | IComponent>): Promise<IComponent[]> => {
      const r = await utils.createRows<IComponentBase | IComponent, IComponent>(
        rows,
        server.Component
      );
      return utils.mapElementsToJSON(r);
    },
    { logMessage: `${routeName} create method`, isException: true }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.Component);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Components: IComponent[]): Promise<any> => {
      const UPDComponents = await utils.updateRows<IComponent>(
        Components,
        server.Component
      );
      return utils.mapElementsToJSON(UPDComponents);
    },
    { logMessage: `${routeName} update method` }
  )
};

export default methods;
