import trycatcher from "../../../utils/trycatcher";
import { IContactBaseFlds } from "../interfaces";
import uuid = require("uuid");
import { routeName } from "../constants";

const ctrl = {
  read: trycatcher(
    (req, h): IContactBaseFlds[] => {
      return [
        {
          ContactID: 1,
          ContactRole: "string",
          ExternalOfficeID: "string",
          GivenName: "string",
          FamilyName: "string",
          OfficeName: "string",
          AddressStreet: "string",
          AddressTown: "string",
          AddressStateRegion: "string",
          AddressPostalCode: "string",
          AddressCountry: "string",
          ContactPhone: "string",
          ContactEmail: "string"
        }
      ];
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  )
};

export default ctrl;
