import { When, Then } from "cucumber";
import { expect } from "chai";
import { server } from "../../src/server";
import { mainURI } from "../../src/constants";
import { routeName } from "../../src/helper/Floor/constants";
import { Authorization } from "./constants";
import { IFloorBase, IFloor } from "../../src/helper/Floor/interfaces";
import { setResponse, getResponse } from "./lib/response";

When("я делаю запрос на получение этажей у объекта {string}", async function(
  FacilityName
) {
  const Facilities = await server.Facility.findAll({ where: { FacilityName } });

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}?FacilityGUID=${Facilities[0].GUID}`,
    method: "GET",
    headers: {
      Authorization
    }
  });
});

Then("в ответе должен быть массив этажей с этажом {string}", function(
  FloorName
) {
  const res: IFloor[] = getResponse().result;

  expect(res).length.greaterThan(0, "Floors array is empty");

  expect(res[0].FloorName).to.eql(FloorName);
});

When(
  "я делаю запрос на создание этажа {string} у объекта {string}",
  async function(FloorName, FacilityName) {
    const Facility = await server.Facility.findAll({
      where: {
        FacilityName
      }
    });

    const Contact = await server.Contact.findAll({});

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "POST",
      headers: {
        Authorization
      },
      payload: [
        {
          CreatedBy: Contact[0].GUID,
          ExternalNameID: "",
          ExternalSystemName: "",
          FacilityGUID: Facility[0].GUID,
          FloorID: 1,
          FloorName,
          FloorReferenceID: "",
          Withdrawn: "No",
          finishedAt: new Date(),
          startedAt: new Date()
        }
      ] as IFloorBase[]
    });

    setResponse(res);
  }
);

Then("в ответе должен быть массив этажей с этажем {string}", async function(
  FloorName
) {
  const Floors: IFloor[] = getResponse().result;

  expect(Floors).length.greaterThan(0, "Floors array is empty");

  expect(Floors[0].FloorName).to.eql(FloorName);
});

When("я делаю запрос на изменение этажа {string} на {string}", async function(
  FloorName,
  newFloorName
) {
  const Floors = await server.Floor.findAll({ where: { FloorName } });
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "PUT",
    headers: {
      Authorization
    },
    payload: [
      {
        GUID: Floors[0].GUID,
        FloorName: newFloorName
      }
    ]
  });

  setResponse(res);
});

Then("в таблице этажей должен быть этаж {string}", async function(FloorName) {
  const res = await server.Floor.findAll({ where: { FloorName } });

  expect(res).length.greaterThan(0, "Floor array is empty");
});

When("я делаю запрос на удаление этажа {string}", async function(FloorName) {
  const Floors = await server.Floor.findAll({ where: { FloorName } });
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: {
      Authorization
    },
    payload: [Floors[0].GUID]
  });
});

Then("в таблице этажей нет этажа {string}", async function(FloorName) {
  const Floors = await server.Floor.findAll({ where: { FloorName } });

  expect(Floors.length).to.eql(0);
});
