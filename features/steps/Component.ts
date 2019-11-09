import { When, Then, Given } from "cucumber";
import { expect } from "chai";
import { Authorization } from "./constants";
import utils from "../../src/utils";
import { server } from "../../src/server";
import { IFacility } from "../../src/helper/Facility/interfaces";
import {
  IComponentBase,
  IComponent
} from "../../src/helper/Component/interfaces";
import { IContact } from "../../src/helper/Contact/interfaces";
import { setResponse, getResponse } from "./lib/response";
import { mainURI } from "../../src/constants";
import { routeName } from "../../src/helper/Component/constants";
import { IRegister } from "../../src/helper/Register/interfaces";
import { IResource } from "../../src/helper/Resource/interfaces";

async function getFacility(FacilityName): Promise<IFacility> {
  return utils.mapElementsToJSON(
    await server.Facility.findAll({ where: { FacilityName } })
  )[0];
}
async function getRegister(): Promise<IRegister> {
  return utils.mapElementsToJSON(await server.Register.findAll())[0];
}
async function getResource(): Promise<IResource> {
  return utils.mapElementsToJSON(await server.Resource.findAll())[0];
}
async function getComponent(ComponentName): Promise<IComponent> {
  const test = await server.Component.findAll({ where: { ComponentName } });
  return utils.mapElementsToJSON(
    await server.Component.findAll({ where: { ComponentName } })
  )[0];
}
async function getContact(): Promise<IContact> {
  return utils.mapElementsToJSON(await server.Contact.findAll())[0];
}

Given(
  "есть регистрация в объекте {string} с привязкой к ресурсу",
  async function(FacilityName: string) {
    const Resource = await getResource();
    const Facility = await getFacility(FacilityName);
    const Contact = await getContact();

    await server.Register.create({
      CreatedBy: Contact.GUID,
      AssetType: "",
      ExternalNameID: "",
      ExternalSystemName: "",
      FacilityGUID: Facility.GUID,
      ProductType: "",
      RegisterApprovalBy: "",
      RegisterID: 0,
      RegisterName: "регистрация1",
      RegisterReference: "",
      RegisterType: "",
      Withdrawn: "No",
      ResourceGUID: Resource.GUID
    });
  }
);

When(
  "я делаю запрос на создание компонента {string} для объекта {string}",
  async function(ComponentNames: string, FacilityName) {
    const Facility = await getFacility(FacilityName);
    const Contact = await getContact();
    const Register = await getRegister();
    const Components = ComponentNames.split(",").map(
      (ComponentName): IComponentBase => ({
        CreatedBy: Contact.GUID,
        ExternalNameID: "",
        ComponentID: 1,
        ComponentName,
        Withdrawn: "No",
        FacilityGUID: Facility.GUID,
        // Count: 0,
        ExternalSystemName: "",
        RegisterGUID: Register.GUID,
        startedAt: new Date(),
        finishedAt: new Date(),
        Status: 0
      })
    );

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "POST",
      headers: { Authorization },
      payload: Components
    });

    setResponse(res);
  }
);

Then(
  "в ответе должен быть массив компонентов с компонентом {string}",
  async function(ComponentName: string) {
    const Components: IComponent[] = getResponse().result;

    expect(Components).length.greaterThan(0, "Components array is empty");
    expect(Components[0].ComponentName).to.eql(ComponentName);
  }
);

When(
  "я делаю запрос на получение списка компонентов по объекту {string}",
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

When("я делаю запрос на удаление компонента {string}", async function(
  ComponentName: string
) {
  const Component = await getComponent(ComponentName);

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: { Authorization },
    payload: [Component.GUID]
  });

  setResponse(res);
});

Then("список компонентов должен быть пустой", async function() {
  const Components = await server.Component.findAll();
  expect(Components.length).to.eql(0);
});

When(
  "я делаю запрос на обновление иннформации по компоненту {string} на {string}",
  async function(ComponentName, newComponentName) {
    const Component = await getComponent(ComponentName);

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "PUT",
      headers: { Authorization },
      payload: [
        {
          GUID: Component.GUID,
          ComponentName: newComponentName
        }
      ]
    });

    setResponse(res);
  }
);

Then(
  "вернуть массив обновленных записей с компонентом {string}",
  async function(ComponentName) {
    const Components: IComponent[] = getResponse().result;

    expect(Components).length.greaterThan(0);
    expect(Components[0].ComponentName).to.eql(ComponentName);
  }
);
