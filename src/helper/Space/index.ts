import { server } from "../../server";
import utils from "../../utils";
import { ISpaceBase, ISpaceInstance, ISpace } from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import { routeName } from "./constants";

const methods = {
  create: trycatcher(
    async (rows: Array<ISpaceBase | ISpace>): Promise<ISpaceInstance[]> => {
      const r = await utils.createRows<ISpaceBase | ISpace, ISpace>(
        rows,
        server.Space
      );
      return r;
    },
    { logMessage: `${routeName} create method` }
  ),
  read: trycatcher(
    async (FloorGUID: string) => {
      const Spaces = await server.Space.findAll({ where: { FloorGUID } });

      return utils.mapElementsToJSON(Spaces);
    },
    { logMessage: `${routeName} read method` }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.Space);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Spaces: ISpace[]): Promise<any> => {
      const UPDSpaces = await utils.updateRows<ISpace>(Spaces, server.Space);
      return utils.mapElementsToJSON(UPDSpaces);
    },
    { logMessage: `${routeName} update method` }
  )
};

export default methods;
