import { Given, When, Then } from "cucumber";
import { server } from "../../src/server";
import { mainURI, path } from "../../src/constants";
import { SystemEvent } from "general/constants";
import { setResponse } from "./lib/response";
import { expect } from "chai";
import dotenv from "dotenv";
import { isSystemError } from "general/interfaces";
import UserCtrl from "../../src/helper/User";
import { orgId, token } from "./constants";
dotenv.config();

When("выполняю запрос type = {string} модуля", async function(type) {
  const res = await server._server.inject({
    url: `${mainURI}/${path.events}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.APP_TOKEN}`
    },
    payload: {
      type,
      orgId,
      token
    }
  });

  setResponse(res);
});

Then("в системе есть пользователь с флагами:", async function(dataTable) {
  const params = dataTable.hashes()[0];
  const user = await UserCtrl.get({ orgId });

  if (isSystemError(user)) {
    throw user;
  }

  for (const param of Object.keys(params)) {
    expect(`${user[param]}`).to.eql(params[param]);
  }
});
