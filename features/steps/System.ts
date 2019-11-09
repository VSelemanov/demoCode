import { When, Then, Given } from "cucumber";
import { expect } from "chai";
import { Authorization } from "./constants";
import utils from "../../src/utils";
import { server } from "../../src/server";
import { IFacility } from "../../src/helper/Facility/interfaces";
import { ISystemBase, ISystem } from "../../src/helper/System/interfaces";
import { IContact } from "../../src/helper/Contact/interfaces";
import { setResponse, getResponse } from "./lib/response";
import { mainURI } from "../../src/constants";
import { routeName } from "../../src/helper/System/constants";

async function getFacility(FacilityName): Promise<IFacility> {
  return utils.mapElementsToJSON(
    await server.Facility.findAll({ where: { FacilityName } })
  )[0];
}
async function getSystem(SystemName): Promise<ISystem> {
  const test = await server.System.findAll({ where: { SystemName } });
  return utils.mapElementsToJSON(
    await server.System.findAll({ where: { SystemName } })
  )[0];
}
async function getContact(): Promise<IContact> {
  return utils.mapElementsToJSON(await server.Contact.findAll())[0];
}

When(
  "я делаю запрос на создание систем {string} для объекта {string}",
  async function(SystemNames: string, FacilityName) {
    const Facility = await getFacility(FacilityName);
    const Contact = await getContact();
    const Systems = SystemNames.split(",").map(
      (SystemName): ISystemBase => ({
        CreatedBy: Contact.GUID,
        ExternalNameID: "",
        ExternalSystemName: "",
        SystemID: 1,
        SystemName,
        Withdrawn: "No",
        SystemReferenceID: "",
        FacilityGUID: Facility.GUID,
        Status: 0
      })
    );

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "POST",
      headers: { Authorization },
      payload: Systems
    });

    setResponse(res);
  }
);

Then("в ответе должен быть массив систем с системой {string}", async function(
  SystemName: string
) {
  const Systems: ISystem[] = getResponse().result;

  expect(Systems).length.greaterThan(0, "Systems array is empty");
  expect(Systems[0].SystemName).to.eql(SystemName);
});

When(
  "я делаю запрос на получение списка систем по объекту {string}",
  async function(FacilityName: string) {
    const Facility = await getFacility(FacilityName);

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}?FacilityGUID=${Facility.GUID}`,
      method: "GET",
      headers: { Authorization }
    });

    setResponse(res);
  }
);

When("я делаю запрос на удаление системы {string}", async function(
  SystemName: string
) {
  const System = await getSystem(SystemName);

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: { Authorization },
    payload: [System.GUID]
  });

  setResponse(res);
});

Then("список систем должен быть пустой", async function() {
  const Systems = await server.System.findAll();
  expect(Systems.length).to.eql(0);
});

When(
  "я делаю запрос на обновление иннформации по системе {string} на {string}",
  async function(SystemName, newSystemName) {
    const System = await getSystem(SystemName);

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "PUT",
      headers: { Authorization },
      payload: [
        {
          GUID: System.GUID,
          SystemName: newSystemName
        }
      ]
    });

    setResponse(res);
  }
);

Then("вернуть массив обновленных записей с системой {string}", async function(
  SystemName
) {
  const Systems: ISystem[] = getResponse().result;

  expect(Systems).length.greaterThan(0);
  expect(Systems[0].SystemName).to.eql(SystemName);
});
