import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "core/Api/interfaces";
import { IUserCredentials } from "../../User/interfaces";

import methods from "../index";
import { IPlanFactGetParams } from "../interfaces";

const ctrl = {
  planfact: trycatcher(
    async (
      req: IDecoratedRequest<{}, IPlanFactGetParams, IUserCredentials>,
      h
    ) => {
      const { FacilityGUID } = req.query as IPlanFactGetParams;
      return await methods.planfact(FacilityGUID, req.auth.credentials);
    },
    { isRequest: true, logMessage: "planfact request" }
  )
};

export default ctrl;
