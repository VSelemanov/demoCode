import { server } from "../../server";
import utils from "../../utils";
import { IRegisterBase, IRegisterInstance, IRegister } from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import { routeName } from "./constants";

const methods = {
  create: trycatcher(
    async (
      rows: Array<IRegisterBase | IRegister>
    ): Promise<IRegisterInstance[]> => {
      const r = await utils.createRows<IRegisterBase | IRegister, IRegister>(
        rows,
        server.Register
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
