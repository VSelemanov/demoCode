import { server } from "../../server";
import utils from "../../utils";
import { IFloorBase, IFloorInstance, IFloor } from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import { routeName } from "./constants";

const methods = {
  create: trycatcher(
    async (rows: Array<IFloorBase | IFloor>): Promise<IFloorInstance[]> => {
      const r = await utils.createRows<IFloorBase | IFloor, IFloor>(
        rows,
        server.Floor
      );
      return r;
    },
    { logMessage: `${routeName} create method` }
  ),
  read: trycatcher(
    async (FacilityGUID: string) => {
      const Floors = await server.Floor.findAll({ where: { FacilityGUID } });

      return utils.mapElementsToJSON(Floors);
    },
    { logMessage: `${routeName} read method` }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.Floor);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Floors: IFloor[]): Promise<any> => {
      const UPDFloors = await utils.updateRows<IFloor>(Floors, server.Floor);
      return utils.mapElementsToJSON(UPDFloors);
    },
    { logMessage: `${routeName} update method` }
  )
};

export default methods;
