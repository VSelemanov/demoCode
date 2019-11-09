import { server } from "../../server";
import utils from "../../utils";
import {
  IPlanBase,
  IPlanInstance,
  IPlan,
  IPlanGetResponse
} from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import { attrFind, routeName } from "./constants";

const methods = {
  create: trycatcher(
    async (rows: Array<IPlanBase | IPlan>): Promise<IPlanInstance[]> => {
      const r = await utils.createRows<IPlanBase | IPlan, IPlan>(
        rows,
        server.Plan
      );
      return r;
    },
    { logMessage: `${routeName} create method` }
  ),
  read: trycatcher(
    async (ComponentGUID: string): Promise<IPlanGetResponse> => {
      const facts = utils.mapElementsToJSON(
        await server.Plan.findAll({
          where: {
            ComponentGUID
          },
          attributes: attrFind.default
        })
      );

      const res: IPlanGetResponse = {
        JobPlan: methods.PlanFilter(facts, false),
        ResourcePlan: methods.PlanFilter(facts, true)
      };

      return res;
    },
    { logMessage: `${routeName} read method` }
  ),
  PlanFilter: (facts: IPlan[], isResource: boolean): IPlan => {
    return facts.filter(r => r.isResource === isResource)[0];
  }
};

export default methods;
