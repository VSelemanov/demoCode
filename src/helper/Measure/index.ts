import { server } from "../../server";
import utils from "../../utils";
import { IMeasureBase, IMeasureInstance, IMeasure } from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import { attrFind, routeName } from "./constants";

import CIMSMethods from "../CIMS";

const methods = {
  create: trycatcher(
    async (
      rows: Array<IMeasureBase | IMeasure>
    ): Promise<IMeasureInstance[]> => {
      const r = await utils.createRows<IMeasureBase | IMeasure, IMeasure>(
        rows,
        server.Measure
      );

      await CIMSMethods.updateCIMSTemplate();

      return r;
    },
    { logMessage: `${routeName} create method` }
  ),
  read: trycatcher(
    async (): Promise<IMeasureInstance[]> => {
      const Measures = await server.Measure.findAll({
        attributes: attrFind.default
      });
      return Measures;
    },
    { logMessage: `${routeName} read method` }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.Measure);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Measures: IMeasure[]): Promise<any> => {
      const UPDMeasures = await utils.updateRows<IMeasure>(
        Measures,
        server.Measure
      );
      return utils.mapElementsToJSON(UPDMeasures);
    },
    { logMessage: `${routeName} update method` }
  )
};

export default methods;
