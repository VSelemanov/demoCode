import { Given, When, Then } from "cucumber";
import { server } from "../../src/server";
import {
  IProject,
  IProjectInstance
} from "../../src/helper/Project/interfaces";
import {
  IFacility,
  IFacilityInstance,
  IFacilitySimple,
  IFacilityBase
} from "../../src/helper/Facility/interfaces";
import uuid = require("uuid");
import {
  IContactInstance,
  IContact
} from "../../src/helper/Contact/interfaces";
import { IComponent } from "../../src/helper/Component/interfaces";

import { Authorization } from "./constants";
import { mainURI, path } from "../../src/constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import { ISystem } from "../../src/helper/System/interfaces";
import { ErrorMessages, routeName } from "../../src/helper/Facility/constants";
import utils from "../../src/utils";
import streamToPromise from "stream-to-promise";
import FormData from "form-data";
import fs from "fs";
import moment = require("moment");

interface IDataRowAll {
  type: string;
  guid: string;
  name: string;
  FloorGUID: string;
}

interface IDataRowComponent {
  name: string;
  FloorGUID: string;
  SpaceGUID: string;
  RegisterGUID: string;
  SystemGUID: string;
}

interface IDataRowSystem {
  name: string;
  FloorGUID: string;
  SpaceGUID: string;
  guid: string;
}

let contact: IContactInstance[];

const getProjectByName = async (ProjectName: string) => {
  return server.Project.find({
    where: {
      name: ProjectName
    }
  });
};

Given("есть запись в таблице контактов", async function() {
  const guid = uuid.v4();
  contact = await server.Contact.bulkCreate(
    [
      {
        GUID: guid,
        AddressCountry: "",
        AddressPostalCode: "",
        AddressStateRegion: "",
        AddressStreet: "",
        AddressTown: "",
        ContactEmail: "",
        ContactID: 1,
        ContactPhone: "",
        ContactRole: "",
        CreatedBy: guid,
        ExternalNameID: "",
        ExternalOfficeID: "",
        ExternalSystemName: "",
        FamilyName: "",
        GivenName: "",
        OfficeName: "",
        Withdrawn: "No",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    { returning: true }
  );
});

Given("есть проекты {string}", async function(sprojectNames: string) {
  const projectNames = sprojectNames.split(", ");

  const projects: IProject[] = projectNames.map(
    (name, index): IProject => ({
      FacilityCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      GUID: uuid.v4(),
      name,
      region: "test",
      street: "test",
      totalArea: 123,
      town: "test",
      PlanFacilities: 1
    })
  );
  await server.Project.bulkCreate(projects);
});
async function getContact(): Promise<IContact> {
  return utils.mapElementsToJSON(await server.Contact.findAll())[0];
}
Given("у проекта {string} есть объекты {string}", async function(
  projectName: string,
  FacilityNames: string
) {
  const project = (await getProjectByName(projectName)) as IProject;
  const Contact = await getContact();

  const Facilities: IFacility[] = FacilityNames.split(", ").map(
    (FacilityName, index): IFacility => ({
      CreatedBy: Contact.GUID,
      FacilityID: 1,
      ExternalNameID: "",
      ExternalSystemName: "",
      FacilityName,
      ProjectGUID: project.GUID,
      Withdrawn: "No",
      address: "",
      developer: "",
      mainImg: "",
      region: "",
      stage: "",
      GUID: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      startedAt: new Date(),
      finishedAt: new Date(),
      builder: "",
      customer: "",
      Status: 0
    })
  );

  await server.Facility.bulkCreate(Facilities);
});

Given("есть ресурс", async function() {
  await server.Resource.create({
    ClassificationID: 1,
    KSRGUID: "",
    ResourceName: "ресурс1",
    ResourceID: 1,
    MeasureGUID: null,
    ParentGUID: null,
    ClassificationCode: ""
  });
});

Given("у ресурса есть работа", async function() {
  const Resource = (await server.Resource.findAll())[0];

  await server.Job.create({
    ENIRGUID: "",
    GESNGUID: "",
    JobID: 1,
    JobName: "Работа ресурса1",
    // ResourceGUID: Resource.GUID,
    ParentGUID: null,
    MeasureGUID: null,
    ClassificationCode: ""
  });
});

Given("в объекте {string} есть следующие элементы:", async function(
  FacilityName: string,
  dataTable
) {
  const facility = (await server.Facility.find({
    where: { FacilityName },
    rejectOnEmpty: true
  })) as IFacilityInstance;

  const Resource = (await server.Resource.findAll())[0];

  for (const dataRow of dataTable.hashes() as IDataRowAll[]) {
    switch (dataRow.type) {
      case "Floor":
        await server.Floor.bulkCreate([
          {
            CreatedBy: contact[0].GUID,
            ExternalNameID: "",
            ExternalSystemName: "",
            FacilityGUID: facility.GUID,
            FloorID: 1,
            FloorName: dataRow.name,
            FloorReferenceID: "",
            Withdrawn: "No",
            GUID: dataRow.guid,
            createdAt: new Date(),
            updatedAt: new Date(),
            startedAt: new Date(),
            finishedAt: new Date(),
            Status: 0
          }
        ]);
        break;
      case "Space":
        await server.Space.bulkCreate([
          {
            CreatedBy: contact[0].GUID,
            FloorGUID: dataRow.FloorGUID,
            GUID: dataRow.guid,
            SpaceFunction: "",
            SpaceNumber: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            ExternalNameID: "",
            ExternalSystemName: "",
            SpaceID: 1,
            SpaceName: dataRow.name,
            Withdrawn: "No",
            startedAt: new Date(),
            finishedAt: new Date(),
            Status: 0
          }
        ]);
        break;
      case "Register":
        await server.Register.bulkCreate([
          {
            CreatedBy: contact[0].GUID,
            AssetType: "",
            ExternalNameID: "",
            ExternalSystemName: "",
            FacilityGUID: facility.GUID,
            GUID: dataRow.guid,
            ProductType: "",
            RegisterApprovalBy: "",
            RegisterID: 1,
            RegisterName: dataRow.name,
            RegisterReference: "",
            RegisterType: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            Withdrawn: "No",
            ResourceGUID: Resource.GUID
          }
        ]);
        break;
    }
  }
});

Given("регистрация {string} привязана к ресурсу", async function(
  RegisterName: string
) {
  const Resource = (await server.Resource.findAll())[0];
  const Register = await server.Register.update(
    {
      ResourceGUID: Resource.GUID
    },
    {
      where: {
        RegisterName
      }
    }
  );
});

Given("в объекте {string} есть следующие системы:", async function(
  FacilityName,
  dataTable
) {
  const Systems: ISystem[] = (dataTable.hashes() as IDataRowSystem[]).map(
    (r): ISystem => ({
      CreatedBy: contact[0].GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      GUID: r.guid,
      SystemID: 1,
      SystemName: r.name,
      FloorGUID: r.FloorGUID === "" ? null : r.FloorGUID,
      SpaceGUID: r.SpaceGUID === "" ? null : r.SpaceGUID,
      SystemReferenceID: "",
      Withdrawn: "No",
      createdAt: new Date(),
      updatedAt: new Date(),
      Status: 0
    })
  );

  await server.System.bulkCreate(Systems);
});

Given("в объекте {string} есть следующие компоненты:", async function(
  FaciltyName: string,
  dataTable
) {
  const components = (dataTable.hashes() as IDataRowComponent[]).map(
    (dataRow): IComponent => ({
      ComponentID: +dataRow.name,
      ComponentName: dataRow.name,
      // Count: 1,
      CreatedBy: contact[0].GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      GUID: uuid.v4(),
      FacilityGUID: null,
      FloorGUID: dataRow.FloorGUID === "" ? null : dataRow.FloorGUID,
      SpaceGUID: dataRow.SpaceGUID === "" ? null : dataRow.SpaceGUID,
      SystemGUID: dataRow.SystemGUID === "" ? null : dataRow.SystemGUID,
      createdAt: new Date(),
      updatedAt: new Date(),
      RegisterGUID: dataRow.RegisterGUID,
      Withdrawn: "No",
      startedAt: new Date(),
      finishedAt: new Date(),
      Status: 0
    })
  );

  await server.Component.bulkCreate(components);
});

const facilityRequest = async (ProjectGUID: string) => {
  return await server._server.inject({
    method: "GET",
    url: `${mainURI}/facility?ProjectGUID=${ProjectGUID}`,
    headers: {
      Authorization
    }
  });
};

When("я делаю запрос списка объектов проекта {string}", async function(
  projectName: string
) {
  const project = (await getProjectByName(projectName)) as IProject;

  const res = await facilityRequest(project.GUID);

  setResponse(res);
});

Then("в ответе должен быть массив с объектами {string}", function(
  FacilityNames: string
) {
  const res = getResponse();
  const Facilities: IFacilitySimple[] = res.result;

  for (const FacilityName of FacilityNames.split(", ")) {
    const f = Facilities.find(r => r.FacilityName === FacilityName);
    if (!f) {
      throw new Error(ErrorMessages.FACILITY_NOT_FOUND);
    }
  }
});

When("я делаю запрос списка всех объектов", async function() {
  const res = await facilityRequest("null");

  setResponse(res);
});

/* GET Facility WITH TREE OF ELEMENTS */

When("я делаю запрос по объекту {string}", async function(FacilityName) {
  const Facility = (await server.Facility.findAll({
    where: { FacilityName }
  })) as IFacility[];

  const res = await server._server.inject({
    method: "GET",
    url: `${mainURI}/facility?GUID=${Facility[0].GUID}`,
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then(
  "в ответе должен быть объект с этажами с компонентами с регистрацией, ресурсами и работами и системами",
  function() {
    const Facility = getResponse().result;

    expect(Facility)
      .has.property("Floors")
      .with.length.greaterThan(0);

    for (const Floor of Facility.Floors) {
      expect(Floor)
        .has.property("Components")
        .with.length.greaterThan(0);

      for (const Component of Floor.Components) {
        expect(Component).has.property("Register");
        // .with.length.greaterThan(0);
      }

      expect(Floor)
        .has.property("Systems")
        .with.length.greaterThan(0);
    }
  }
);

Then(
  "в этаже {string} должны быть помещения с компонентами с регистрацией, ресурсами и работами и системами",
  function(FloorName) {
    const Floor = getResponse().result.Floors.find(
      r => r.FloorName === FloorName
    );

    expect(Floor)
      .has.property("Spaces")
      .with.length.greaterThan(0);

    for (const Space of Floor.Spaces) {
      expect(Space)
        .has.property("Components")
        .with.length.greaterThan(0);

      for (const Component of Space.Components) {
        expect(Component).has.property("Register");
        // .with.length.greaterThan(0);
      }

      expect(Space)
        .has.property("Systems")
        .with.length.greaterThan(0);
    }
  }
);

When(
  "я делаю запрос на создание объектов {string} для проекта {string}",
  async function(FacilitiesNames: string, ProjectName: string) {
    const Project = await server.Project.findOne({
      where: { name: ProjectName }
    });

    const Contact = utils.mapElementsToJSON(await server.Contact.findAll())[0];

    if (!Project) {
      throw new Error("Project is null");
    }

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "POST",
      headers: {
        Authorization
      },
      payload: FacilitiesNames.split(",").map(FacilityName => ({
        CreatedBy: Contact.GUID,
        FacilityID: 1,
        ExternalNameID: "",
        ExternalSystemName: "",
        FacilityName,
        ProjectGUID: Project.GUID,
        Withdrawn: "No",
        address: "",
        developer: "",
        finishedAt: new Date(),
        mainImg: "",
        region: "",
        stage: "",
        startedAt: new Date()
      }))
    });

    setResponse(res);
  }
);

Then("в ответе должен быть массив объектов с объектом {string}", async function(
  FacilityName
) {
  const Facilities: IFacility[] = getResponse().result;

  expect(Facilities).length.greaterThan(0);

  expect(Facilities[0].FacilityName).to.eql(FacilityName);
});

When("я делаю запрос на удаление объекта {string}", async function(
  FacilityName
) {
  const Facility = await server.Facility.findAll({ where: { FacilityName } });
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: {
      Authorization
    },
    payload: [Facility[0].GUID] as string[]
  });

  setResponse(res);
});

Then("в таблице объектов нет объекта {string}", async function(FacilityName) {
  const Facilities = await server.Facility.findAll({ where: { FacilityName } });

  expect(Facilities.length).to.eql(0);
});

When("я делаю запрос на изменение объекта {string} на {string}", async function(
  FacilityName,
  newFacilityName
) {
  const Facility = await server.Facility.findAll({ where: { FacilityName } });
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "PUT",
    headers: {
      Authorization
    },
    payload: [{ GUID: Facility[0].GUID, FacilityName: newFacilityName }]
  });

  setResponse(res);
});

Then("в таблице объектов должен быть объект {string}", async function(
  FacilityName
) {
  const Facilities = await server.Facility.findAll({ where: { FacilityName } });

  expect(Facilities.length).to.eql(1);
});

When(
  "я делаю запрос на создание объекта {string} для проекта {string}",
  async function(FacilityName, ProjectName) {
    const Project = await server.Project.findOne({
      where: { name: ProjectName }
    });

    const Contact = utils.mapElementsToJSON(await server.Contact.findAll())[0];

    if (!Project) {
      throw new Error("Project is null");
    }

    const formData = new FormData();
    const filename = "1.jpg";
    const file = fs.createReadStream(`${__dirname}/${filename}`);

    formData.append("FacilityID", "1");
    formData.append("FacilityName", FacilityName);
    formData.append("ExternalSystemName", FacilityName);
    formData.append("ExternalNameID", FacilityName);
    formData.append("CreatedBy", Contact.GUID);
    formData.append("Withdrawn", "No");
    formData.append("ProjectGUID", Project.GUID);
    formData.append("startedAt", new Date().toISOString());
    formData.append("finishedAt", new Date().toISOString());
    formData.append("code", "");
    formData.append("region", "");
    formData.append("developer", "");
    formData.append("stage", "");
    formData.append("address", "");

    formData.append("mainImg", file);

    const payload = await streamToPromise(formData);
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}/${path.formdata}`,
      method: "POST",
      headers: {
        Authorization,
        ...formData.getHeaders()
      },
      payload
    });
    setResponse(res);
  }
);

When(
  "я делаю запрос на создание объекта с галереей из {int} фото {string} для проекта {string}",
  async function(count, FacilityName, ProjectName) {
    const Project = await server.Project.findOne({
      where: { name: ProjectName }
    });

    const Contact = utils.mapElementsToJSON(await server.Contact.findAll())[0];

    if (!Project) {
      throw new Error("Project is null");
    }

    const formData = new FormData();
    const filename = "1.jpg";
    const file = fs.createReadStream(`${__dirname}/${filename}`);

    formData.append("FacilityID", "1");
    formData.append("FacilityName", FacilityName);
    formData.append("ExternalSystemName", FacilityName);
    formData.append("ExternalNameID", FacilityName);
    formData.append("CreatedBy", Contact.GUID);
    formData.append("Withdrawn", "No");
    formData.append("ProjectGUID", Project.GUID);
    formData.append("startedAt", new Date().toISOString());
    formData.append("finishedAt", new Date().toISOString());
    formData.append("code", "");
    formData.append("region", "");
    formData.append("developer", "");
    formData.append("stage", "");
    formData.append("address", "");

    formData.append("mainImg", file);

    for (let i = 0; i < count; i++) {
      formData.append(`facilityPhoto${i}`, file);
    }

    const payload = await streamToPromise(formData);
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}/${path.formdata}`,
      method: "POST",
      headers: {
        Authorization,
        ...formData.getHeaders()
      },
      payload
    });
    setResponse(res);
  }
);

Then("в объекте {string} должна быть картинка", function(FacilityName) {
  const Facility: IFacility = getResponse().result[0];

  expect(Facility.FacilityName).to.eql(FacilityName);

  expect(Facility).have.property("mainImg");
  expect(Facility.mainImg).not.empty;
});

When(
  "я делаю запрос на изменение объекта {string} на {string} с картинкой",
  async function(FacilityName: string, newFacilityName: string) {
    const Facility: IFacility = (await server.Facility.findAll({
      where: { FacilityName }
    }))[0];

    const formData = new FormData();
    const filename = "1.jpg";
    const file = fs.createReadStream(`${__dirname}/${filename}`);

    formData.append("GUID", Facility.GUID);
    formData.append("FacilityName", newFacilityName);
    formData.append("mainImg", file);

    const payload = await streamToPromise(formData);
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}/${path.formdata}`,
      method: "PUT",
      headers: {
        Authorization,
        ...formData.getHeaders()
      },
      payload
    });
    setResponse(res);
  }
);

When(
  "я делаю запрос на изменение объекта {string} на {string} с картинкой и галереей из {int} фото",
  async function(FacilityName: string, newFacilityName: string, count: number) {
    const Facility: IFacility = (await server.Facility.findAll({
      where: { FacilityName }
    }))[0];

    const formData = new FormData();
    const filename = "1.jpg";
    const file = fs.createReadStream(`${__dirname}/${filename}`);

    formData.append("GUID", Facility.GUID);
    formData.append("FacilityName", newFacilityName);
    formData.append("mainImg", file);

    for (let i = 0; i < count; i++) {
      formData.append(`facilityPhoto${i}`, file);
    }

    const payload = await streamToPromise(formData);
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}/${path.formdata}`,
      method: "PUT",
      headers: {
        Authorization,
        ...formData.getHeaders()
      },
      payload
    });
    setResponse(res);
  }
);

When(
  "я делаю запрос на получение динамики факта для объекта {string}",
  async function(FacilityName) {
    const Facility: IFacility = (await server.Facility.findAll({
      where: { FacilityName }
    }))[0];

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}/factreport?dateFrom=${moment().format(
        "YYYY-MM-DD"
      )}&dateTo=${moment().format("YYYY-MM-DD")}&FacilityGUID=${Facility.GUID}`,
      method: "GET",
      headers: {
        Authorization
      }
    });
    setResponse(res);
  }
);

Then("в объекте {string} должна быть галерея из {int} картинок", async function(
  FacilityName,
  count
) {
  const Facility = (await server.Facility.findAll({
    where: { FacilityName }
  }))[0];
  const FacilityPhotoItems = await server.FacilityPhotoItem.findAll({
    where: { FacilityGUID: Facility.GUID }
  });
  expect(FacilityPhotoItems.length).to.eql(count);
});

Then("в объекте должна быть галерея фотографий", function() {
  const Facility = getResponse();

  expect(Facility).haveOwnProperty("FacilityPhotoItems");
});

When(
  "админ делает запрос на получение списка объектов с поиском {string}",
  async function(search: string) {
    const q = search === "undefined" ? "" : `?q=${search}`;
    const res = await server._server.inject({
      url: `${mainURI}/${path.admin}/${routeName}${q}`,
      method: "GET",
      headers: {
        Authorization
      }
    });
    setResponse(res);
  }
);

Then("в ответе должен быть массив с {int} объектом {string}", async function(
  count: number,
  FacilityName: string
) {
  const res = getResponse().result;

  expect(res.length).to.eql(count);
  expect(res[0].FacilityName).to.eql(FacilityName);
});

Then("в ответе должен быть массив с {int} объектами", function(count: number) {
  const res = getResponse().result;

  expect(res.length).to.eql(count);
});
