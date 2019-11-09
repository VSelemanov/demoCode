import { Given, When, Then } from "cucumber";
import { expect } from "chai";
import { server } from "../../src/server";
import utils from "../../src/utils";
import { IFacility } from "../../src/helper/Facility/interfaces";
import { IFloor } from "../../src/helper/Floor/interfaces";
import { IContact } from "../../src/helper/Contact/interfaces";
import uuid = require("uuid");
import { mainURI } from "../../src/constants";
import { routeName } from "../../src/helper/Space/constants";
import { Authorization } from "./constants";
import { ISpaceBase, ISpace } from "../../src/helper/Space/interfaces";
import { setResponse, getResponse } from "./lib/response";

async function getFacility(FacilityName): Promise<IFacility> {
  return utils.mapElementsToJSON(
    await server.Facility.findAll({ where: { FacilityName } })
  )[0];
}

async function getContact(): Promise<IContact> {
  return utils.mapElementsToJSON(await server.Contact.findAll())[0];
}

async function getFloor(FloorName): Promise<IFloor> {
  return utils.mapElementsToJSON(
    await server.Floor.findAll({ where: { FloorName } })
  )[0];
}

async function getSpace(SpaceName): Promise<ISpace> {
  return utils.mapElementsToJSON(
    await server.Space.findAll({ where: { SpaceName } })
  )[0];
}

Given("у объекта {string} есть этажи {string}", async function(
  FacilityName: string,
  FloorNamesString: string
) {
  const FloorNames = FloorNamesString.split(",");
  const Facility = await getFacility(FacilityName);
  const Contact = await getContact();

  const Floors = FloorNames.map(
    (FloorName): IFloor => ({
      CreatedBy: Contact.GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      FloorID: 1,
      FacilityGUID: Facility.GUID,
      FloorName,
      FloorReferenceID: "",
      GUID: uuid.v4(),
      Withdrawn: "no",
      createdAt: new Date(),
      updatedAt: new Date(),
      startedAt: new Date(),
      finishedAt: new Date(),
      Status: 0
    })
  );

  await server.Floor.bulkCreate(Floors);
});

Given(
  "я делаю запрос на создание помещения {string} у этажа {string}",
  async function(SpaceName, FloorName) {
    const Floor = await getFloor(FloorName);
    const Contact = await getContact();

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "POST",
      headers: {
        Authorization
      },
      payload: [
        {
          CreatedBy: Contact.GUID,
          ExternalNameID: "",
          ExternalSystemName: "",
          FloorGUID: Floor.GUID,
          SpaceFunction: "",
          SpaceID: 1,
          SpaceNumber: "1",
          Withdrawn: "No",
          finishedAt: new Date(),
          startedAt: new Date(),
          SpaceName
        }
      ] as ISpaceBase[]
    });

    setResponse(res);
  }
);

When("я делаю запрос на получение помещений у этажа {string}", async function(
  FloorName
) {
  const Floor = await getFloor(FloorName);

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}?FloorGUID=${Floor.GUID}`,
    method: "GET",
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then("в ответе должен быть массив помещений с помещением {string}", function(
  SpaceName
) {
  const Spaces: ISpace[] = getResponse().result;

  expect(Spaces).length.greaterThan(0);

  expect(Spaces[0].SpaceName).to.eql(SpaceName);
});

When("я делаю запрос на удаление помещения {string}", async function(
  SpaceName
) {
  const Space = await getSpace(SpaceName);

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: {
      Authorization
    },
    payload: [Space.GUID]
  });

  setResponse(res);
});

Then("в таблице этажей нет помещения {string}", async function(SpaceName) {
  const Spaces = await server.Space.findAll({ where: { SpaceName } });

  expect(Spaces.length).to.eql(0);
});

When(
  "я делаю запрос на изменение помещения {string} на {string}",
  async function(SpaceName, newSpaceName) {
    const Space = await getSpace(SpaceName);

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "PUT",
      headers: {
        Authorization
      },
      payload: [
        {
          GUID: Space.GUID,
          SpaceName: newSpaceName
        }
      ]
    });

    setResponse(res);
  }
);
