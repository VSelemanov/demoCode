import { Given, When, Then } from "cucumber";
import {
  IFloor,
  IFloorSpacesSystemsComponentsPercents
} from "../../src/helper/Floor/interfaces";
import uuid = require("uuid");
import { server } from "../../src/server";
import { IContact } from "../../src/helper/Contact/interfaces";
import {
  IFacility,
  IFacilityFloorsComponentsSystemsPercents
} from "../../src/helper/Facility/interfaces";
import {
  ISpace,
  ISpaceSystemsComponentsPercents
} from "../../src/helper/Space/interfaces";
import { ISystem } from "../../src/helper/System/interfaces";
import { IComponent } from "../../src/helper/Component/interfaces";
import { IPlan } from "../../src/helper/Plan/interfaces";
import { IFact } from "../../src/helper/Fact/interfaces";
import { mainURI } from "../../src/constants";
import { Authorization } from "./constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import utils from "../../src/utils";
import moment = require("moment");

async function getContact() {
  return (await server.Contact.findAll())[0];
}

async function getFacility() {
  return (await server.Facility.findAll())[0];
}

async function getRegister() {
  return (await server.Register.findAll())[0];
}

async function getFloor(FloorName) {
  return (await server.Floor.findAll({ where: { FloorName } }))[0];
}

async function getSpace(SpaceName) {
  return (await server.Space.findAll({ where: { SpaceName } }))[0];
}
async function getComponents() {
  return await server.Component.findAll();
}
Given("я создаю тестовые этажи {string} с привязкой к объекту", async function(
  FloorNames: string
) {
  const Contact = await getContact();
  const Facility = await getFacility();
  const Floors: IFloor[] = FloorNames.split(", ").map(
    (FloorName): IFloor => ({
      GUID: uuid.v4(),
      CreatedBy: Contact.GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      FloorID: 1,
      FloorName,
      FacilityGUID: Facility.GUID,
      Withdrawn: "No",
      createdAt: new Date(),
      updatedAt: new Date(),
      FloorReferenceID: "",
      startedAt: moment()
        .add(-25, "days")
        .toDate(),
      finishedAt: moment()
        .add(25, "days")
        .toDate(),
      Status: 0
    })
  );
  await server.Floor.bulkCreate(Floors);
});

Given("я создаю тестовые помещения {string} на этаже {string}", async function(
  SpaceNames,
  FloorName
) {
  const Contact = await getContact();
  const Floor = await getFloor(FloorName);
  const Spaces: ISpace[] = SpaceNames.split(", ").map(
    (SpaceName): ISpace => ({
      GUID: uuid.v4(),
      CreatedBy: Contact.GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      SpaceID: 1,
      SpaceName,
      Withdrawn: "No",
      createdAt: new Date(),
      updatedAt: new Date(),
      SpaceFunction: "",
      FloorGUID: Floor.GUID,
      SpaceNumber: "1",
      startedAt: moment()
        .add(-20, "days")
        .toDate(),
      finishedAt: moment()
        .add(20, "days")
        .toDate(),
      Status: 0
    })
  );
  await server.Space.bulkCreate(Spaces);
});
function buildSystem(
  parentRows: any[],
  parentGUIDName: string,
  Contact: IContact
): ISystem[] {
  return parentRows.map(
    (row, index): ISystem => ({
      GUID: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      CreatedBy: Contact.GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      [parentGUIDName]: row.GUID,
      SystemID: index + 1,
      SystemName: `система${index + 1}`,
      Withdrawn: "No",
      SystemReferenceID: "",
      Status: 0
    })
  );
}
Given("я создаю системы на всех уровнях", async function() {
  const Contact = await getContact();
  const Facility = await getFacility();
  const Floor = await server.Floor.findAll();
  const Space = await server.Space.findAll();

  await server.System.bulkCreate([
    ...buildSystem([Facility], "FacilityGUID", Contact),
    ...buildSystem(Floor, "FloorGUID", Contact),
    ...buildSystem(Space, "SpaceGUID", Contact)
  ]);
});

function buildComponent(
  parentRows: any[],
  parentGUIDName: string,
  Contact: IContact,
  RegisterGUID: string
): IComponent[] {
  return parentRows.map(
    (row, index): IComponent => ({
      GUID: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      CreatedBy: Contact.GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      [parentGUIDName]: row.GUID,
      ComponentName: `компонент${index + 1}`,
      Withdrawn: "No",
      ComponentID: index + 1,
      // Count: 1,
      RegisterGUID,
      startedAt: moment().add(-10, "days").toDate(),
      finishedAt: moment().add(10, "days").toDate(),
      Status: 0
    })
  );
}

Given("я создаю компоненты на всех уровнях", async function() {
  const Contact = await getContact();
  const Facility = await getFacility();
  const Floor = await server.Floor.findAll();
  const Space = await server.Space.findAll();
  const System = await server.System.findAll();
  const Register = await getRegister();

  await server.Component.bulkCreate([
    ...buildComponent([Facility], "FacilityGUID", Contact, Register.GUID),
    ...buildComponent(Floor, "FloorGUID", Contact, Register.GUID),
    ...buildComponent(Space, "SpaceGUID", Contact, Register.GUID),
    ...buildComponent(System, "SystemGUID", Contact, Register.GUID)
  ]);
});

/*Given("я создаю плановые данные для каждого компонента", async function() {
  const Components = await getComponents();
  const Plans: IPlan[] = Components.map(
    (Component, index): IPlan => ({
      ComponentGUID: Component.GUID,
      createdAt: new Date(),
      updatedAt: new Date(),
      GUID: uuid.v4(),
      isResource: false,
      value: 100
    })
  );
  await server.Plan.bulkCreate(Plans);
});*/
async function getSystem(GUID: string, parentEntityName: string) {
  return (await server.System.findAll({
    where: { [parentEntityName]: GUID }
  }))[0];
}
Given("я создаю плановые данные для следующих конструктивов:", async function(
  dataTable
) {
  const Plans: IPlan[] = [];
  const Components: IComponent[] = [];
  let where: any = {};
  const Registers = await server.Register.findAll({
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
  for (const row of dataTable.hashes() as IPlanTestData[]) {
    const system = row.system === "true";
    const component = row.component === "true";
    switch (row.EntityType) {
      case "Facility":
        const Facility = await getFacility();
        where = { FacilityGUID: Facility.GUID };
        break;
      case "Floor":
        const Floor = await getFloor(row.name);
        where = { FloorGUID: Floor.GUID };
        break;
      case "Space":
        const Space = await getSpace(row.name);
        where = { SpaceGUID: Space.GUID };
        break;
    }
    await getAllComponents(Components, system, component, where);
  }

  for (const Component of Components) {
    Plans.push({
      GUID: uuid.v4(),
      isResource: false,
      value: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      ComponentGUID: Component.GUID,
      // @ts-ignore
      JobGUID: Registers[0].Resource.Jobs[0].GUID
    });
  }

  await server.Plan.bulkCreate(Plans);
});

async function getAllComponents(
  Components: IComponent[],
  system: boolean,
  component: boolean,
  where: any
) {
  if (system) {
    const Systems = await server.System.findAll({ where });
    for (const System of Systems) {
      Components.push(
        ...utils.mapElementsToJSON(
          await server.Component.findAll({
            where: {
              SystemGUID: System.GUID
            }
          })
        )
      );
    }
  }
  if (component) {
    Components.push(
      ...utils.mapElementsToJSON(await server.Component.findAll({ where }))
    );
  }
}
Given("я создаю фактические данные для следующих компонентов:", async function(
  dataTable
) {
  const Facts: IFact[] = [];

  for (const row of dataTable.hashes() as IFactTestData[]) {
    const where: {
      FacilityGUID?: string;
      FloorGUID?: string;
      SystemGUID?: string;
      SpaceGUID?: string;
    } = {};
    const isSystem = row.isSystem === "true";
    switch (row.EntityType) {
      case "Facility":
        const Facility = await getFacility();
        if (!isSystem) {
          where.FacilityGUID = Facility.GUID;
        } else {
          const System = await getSystem(Facility.GUID, "FacilityGUID");
          where.SystemGUID = System.GUID;
        }

        break;
      case "Floor":
        const Floor = await getFloor(row.name);
        if (!isSystem) {
          where.FloorGUID = Floor.GUID;
        } else {
          const System = await getSystem(Floor.GUID, "FloorGUID");
          where.SystemGUID = System.GUID;
        }
        break;
      case "Space":
        const Space = await getSpace(row.name);
        if (!isSystem) {
          where.SpaceGUID = Space.GUID;
        } else {
          const System = await getSystem(Space.GUID, "SpaceGUID");
          where.SystemGUID = System.GUID;
        }
        break;
    }

    const findedComponent = (await server.Component.findAll({
      where
    }))[0];

    const Registers = await server.Register.findAll({
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

    const EntityFacts: IFact[] = row.values.split(", ").map(
      (value, index): IFact => ({
        ComponentGUID: findedComponent.GUID,
        GUID: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadedAt: new Date(),
        // @ts-ignore
        JobGUID: Registers[0].Resource.Jobs[0].GUID || null,
        isResource: false,
        value: +value,
        UserGUID: uuid.v4()
      })
    );

    Facts.push(...EntityFacts);
  }

  await server.Fact.bulkCreate(Facts);
});

When("я делаю запрос на получение планфактного анализа", async function() {
  const Facility = await getFacility();
  const res = await server._server.inject({
    url: `${mainURI}/planfact?FacilityGUID=${Facility.GUID}`,
    method: "GET",
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then("в дереве должен быть следующий процент выполнения:", function(dataTable) {
  const Facility: IFacilityFloorsComponentsSystemsPercents = getResponse()
    .result;
  for (const row of dataTable.hashes() as IPlanFactTestData[]) {
    const message = `${row.EntityType} -> ${row.name}`
    switch (row.EntityType) {
      case "Facility":
        expect(Facility.FacilityPercent).to.eql(+row.value, message);
        expect(Facility.Status).to.eql(+row.Status, message);
        break;
      case "Floor":
        const Floor = Facility.Floors.find(f => f.FloorName === row.name);
        if (!Floor) {
          throw new Error("Floor not found");
        }
        expect(Floor.FloorPercent).to.eql(+row.value, message);
        expect(Floor.Status).to.eql(+row.Status, message);
        break;
      case "Space":
        const FloorForSpace = Facility.Floors.find(
          f => f.FloorName === row.parentName
        );

        if (!FloorForSpace) {
          throw new Error("Floor not found");
        }

        const Space = FloorForSpace.Spaces.find(s => s.SpaceName === row.name);

        if (!Space) {
          throw new Error("Floor not found");
        }

        expect(Space.SpacePercent).to.eql(
          row.value === "null" ? null : +row.value, message
        );
        expect(Space.Status).to.eql(+row.Status, message);
        break;
    }
  }
});

When("я делаю запрос на получение данных для BI", async function() {
  const res = await server.server.inject({
    url: `${mainURI}/report/bi`,
    method: "GET",
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then("в ответе должен быть массив с данными для BI", async function() {
  const res = getResponse().result;

  expect(typeof res).to.eql("string");
});

interface IBase {
  EntityType: string;
  name: string;
}

interface IFactTestData extends IBase {
  isSystem: string;
  values: string;
}
interface IPlanTestData extends IBase {
  system: string;
  component: string;
}
interface IPlanFactTestData extends IBase {
  value: string;
  Status: string;
  parentName: string;
}
