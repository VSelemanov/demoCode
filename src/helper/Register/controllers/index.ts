import trycatcher from "../../../utils/trycatcher";
import { IRegisterBaseFlds } from "../interfaces";
import uuid = require("uuid");
import { routeName } from "../constants";

const ctrl = {
  read: trycatcher(
    (req, h): IRegisterBaseFlds[] => {
      return [
        {
          AssetType: "123",
          ProductType: "123",
          RegisterApprovalBy: "123",
          RegisterID: 1,
          RegisterName: "name",
          RegisterReference: "",
          RegisterType: "",
          FacilityGUID: uuid.v4(),
          ResourceGUID: uuid.v4()
        }
      ];
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  )
};

export default ctrl;
