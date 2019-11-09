import { server } from "../../server";
import { IContact, IContactBase, IContactInstance } from "./interfaces";
import utils from "../../utils";
import trycatcher from "../../utils/trycatcher";
import { routeName } from "./constants";

const methods = {
  create: trycatcher(
    async (
      rows: Array<IContactBase | IContact>
    ): Promise<IContactInstance[]> => {
      const r = await utils.createRows<IContactBase | IContact, IContact>(
        rows,
        server.Contact
      );
      return r;
    },
    { logMessage: `${routeName} create method` }
  ),
  read: () => {
    console.log();
  }
};

export default methods;
