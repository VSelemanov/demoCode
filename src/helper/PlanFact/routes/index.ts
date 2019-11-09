import { ServerRoute } from "hapi";
import { mainURI, path } from "../../../constants";

import planfactRequest from "../schemas/read/request.schema.json";
import { readPlanFact } from "../docs";

import planfactCtrl from "../controllers";

import validator from "general/Validator";
import { routeName } from "../constants";

const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: planfactCtrl.planfact,

    options: {
      ...readPlanFact,
      validate: {
        query: validator.validate(planfactRequest)
      }
    }
  }
];

export default Routes;
