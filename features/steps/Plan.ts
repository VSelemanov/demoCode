import { When, Then } from "cucumber";
import { server } from "../../src/server";
import uuid from "uuid";
import { mainURI } from "../../src/constants";
import { setResponse, getResponse } from "./lib/response";
import { Authorization } from "./constants";

import { expect } from "chai";
import { IPlanBase } from "../../src/helper/Plan/interfaces";

When("я ввожу план {string} по компоненту", async function(
  SisResource: string
) {
  const isResource = SisResource === "true";
  const Component = (await server.Component.findAll())[0];
  const Register = await server.Register.findAll({
    where: {
      GUID: Component.RegisterGUID
    },
    include: [
      {
        model: server.Resource,
        include: [
          {
            model: server.Job
          }
        ]
      }
    ]
  });

  const res = await server._server.inject({
    url: `${mainURI}/plan`,
    method: "POST",
    payload: {
      ComponentGUID: Component.GUID,
      value: 100,
      isResource,
      // @ts-ignore
      JobGUID: Register[0].Resource.Jobs[0].GUID
    } as IPlanBase,
    headers: { Authorization }
  });

  setResponse(res);
});

Then("в ответе новый план", function() {
  const res = getResponse().result;

  expect(res).has.property("value");
  expect(res).has.property("GUID");
  expect(res).has.property("ComponentGUID");
});

When("запрашиваю список планов по компоненту", async function() {
  const Component = (await server.Component.findAll())[0];
  const res = await server._server.inject({
    url: `${mainURI}/plan?ComponentGUID=${Component.GUID}`,
    method: "GET",
    headers: { Authorization }
  });

  setResponse(res);
});

Then(
  "в ответе должен быть объект с двумя свойствами-объектами {string} и {string}",
  function(JobFactsName: string, ResourceFactsName: string) {
    const res = getResponse().result;

    expect(res).has.property(JobFactsName);
    expect(res).has.property(ResourceFactsName);
  }
);
