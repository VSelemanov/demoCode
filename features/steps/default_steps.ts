import { Given, Then, AfterAll, BeforeAll, setDefaultTimeout } from "cucumber";
import { server } from "../../src/server";
import { expect } from "chai";
import { getResponse } from "./lib/response";
import UserCtrl from "../../src/helper/User";

import { orgId, token } from "./constants";
import uuid = require("uuid");

import ContactCtrl from "../../src/helper/Contact/";
import moment = require("moment");

let serverStarted = false;

setDefaultTimeout(25 * 1000);

Given("сервер стартовал", async function() {
  expect(serverStarted).to.eql(true);
});

Given("база данных пуста", async function() {
  await server.Project.truncate({ cascade: true });

  await server.Report.truncate({ cascade: true });
  await server.ReportItem.truncate({ cascade: true });
  await server.ReportType.truncate({ cascade: true });
  await server.ReportFile.truncate({ cascade: true });

  await server.Contact.truncate({ cascade: true });
  await server.Facility.truncate({ cascade: true });
  await server.FacilityPhotoItem.truncate({ cascade: true });
  await server.Floor.truncate({ cascade: true });
  await server.Space.truncate({ cascade: true });
  await server.Register.truncate({ cascade: true });
  await server.Component.truncate({ cascade: true });
  await server.System.truncate({ cascade: true });
  await server.Resource.truncate({ cascade: true });
  await server.Job.truncate({ cascade: true });
  await server.Plan.truncate({ cascade: true });
  await server.Measure.truncate({ cascade: true });
  await server.Fact.truncate({ cascade: true });
  await server.PhotoFact.truncate({ cascade: true });

  await server.User.truncate({ cascade: true });
});

Given("я создаю пользователя", async function() {
  await UserCtrl.create({
    orgId,
    token
  });
});

Given("я создаю тестовый проект", async () => {
  await server.Project.create(
    {
      FacilityCount: 1,
      name: "test",
      region: "test",
      street: "test",
      totalArea: 123,
      town: "test",
      PlanFacilities: 1
    },
    { returning: true }
  );
});
Given("я создаю тестовый контакт", async function() {
  const guid = uuid.v4();
  const contact = await ContactCtrl.create([
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
  ]);
});

Given("я создаю тестовый объект с привязкой к проекту", async function() {
  const Project = (await server.Project.findAll())[0];
  const Contact = (await server.Contact.findAll())[0];
  const f = await server.Facility.create({
    ExternalNameID: "",
    FacilityID: 1,
    ExternalSystemName: "",
    FacilityName: "дом",
    ProjectGUID: Project.GUID,
    Withdrawn: "No",
    address: "",
    developer: "",
    mainImg: "",
    region: "",
    stage: "",
    CreatedBy: Contact.GUID,
    startedAt: moment()
      .add(-30, "days")
      .toDate(),
    finishedAt: moment()
      .add(30, "days")
      .toDate(),
    builder: "",
    customer: "",
    Status: 0
  });
});

Given("я создаю тестовую регистрацию с привязкой к объекту", async function() {
  const Facility = (await server.Facility.findAll())[0];
  const Contact = (await server.Contact.findAll())[0];
  const Resource = (await server.Resource.findAll())[0];
  await server.Register.bulkCreate([
    {
      AssetType: "",
      CreatedBy: Contact.GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      FacilityGUID: Facility.GUID,
      GUID: uuid.v4(),
      ProductType: "",
      RegisterApprovalBy: "",
      RegisterID: 1,
      RegisterName: "Регистрация 1",
      RegisterReference: "",
      ResourceGUID: Resource.GUID,
      RegisterType: "",
      Withdrawn: "No",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
});

Given(
  "я создаю тестовый компонент с привязкой к регистрации",
  async function() {
    const Register = (await server.Register.findAll())[0];
    const Facility = (await server.Facility.findAll())[0];
    const Contact = (await server.Contact.findAll())[0];

    await server.Component.create({
      ComponentID: 1,
      ComponentName: "component",
      // Count: 1,
      CreatedBy: Contact.GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      FacilityGUID: Facility.GUID,
      Withdrawn: "No",
      RegisterGUID: Register.GUID,
      startedAt: new Date(),
      finishedAt: new Date(),
      Status: 0
    });
  }
);

Given("плановых данных нет", async function() {
  await server.Plan.truncate({ cascade: true });
});

Given("фактических данных нет", async function() {
  await server.Fact.truncate({ cascade: true });
});

Then("сервер должен вернуть статус {int}", async function(int) {
  const lastResponse = getResponse();
  expect(lastResponse.statusCode).to.eql(int);
});

AfterAll(async function() {
  await server.stop();
});

BeforeAll(async function() {
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }
});
