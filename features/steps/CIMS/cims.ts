import { Given, When, Then } from "cucumber";
import { expect } from "chai";
import { server } from "../../../src/server";
import { mainURI, path } from "../../../src/constants/index";
import { AuthCredentials } from "hapi";
import { IUser } from "../../../src/helper/User/interfaces";
import { getResponse, setResponse } from "../lib/response";
import fs from "fs";
import FormData from "form-data";
import streamToPromise from "stream-to-promise";

import { Authorization } from "../constants";
import {
  IResource,
  IResourceForCIMS
} from "modules/esb/app/src/helper/Resource/interfaces";
import uuid = require("uuid");
import { IJob } from "modules/esb/app/src/helper/Job/interfaces";
import { IRegister } from "modules/esb/app/src/helper/Register/interfaces";

import xlsx from "xlsx";
import {
  CIMSTemplateFilename,
  ResourceSheetFilename
} from "modules/esb/app/src/helper/CIMS/constants";
import { ResourceCIMSSheetName } from "modules/esb/app/src/helper/Resource/constants";

import { routeName } from "../../../src/helper/Resource/constants";

type ICredentials = IUser & AuthCredentials;

let Registers: IRegister[];

const filename = "cimstestv3.xlsx";
// const filename = "bad.xlsx";
const newFilename = "cimstestNew.xlsx";
const incorrectFileName = "cimsincorrect.xlsx";

/* DUMP RESOURCES AND JOBS */
Given("я создаю ресурсы", async function() {
  const resources: IResource[] = [];
  for (let i = 0; i < 2; i++) {
    resources[i] = {
      KSRGUID: "",
      GUID: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ClassificationID: i + 1,
      ResourceID: i + 1,
      MeasureGUID: null,
      ParentGUID: null,
      ResourceName: `ресурс${i + 1}`,
      ClassificationCode: `шифр${i + 1}`
    };
  }
  await server.Resource.bulkCreate(resources);
});

Given("я создаю работы", async function() {
  const Resources = server.Resource.findAll();
  const jobs: IJob[] = [];
  for (let i = 0; i < 2; i++) {
    jobs[i] = {
      GUID: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      // ResourceGUID: Resources[0].GUID,
      ENIRGUID: "",
      GESNGUID: "",
      JobID: i + 1,
      MeasureGUID: null,
      ParentGUID: null,
      JobName: `работа${i + 1}`,
      ClassificationCode: ""
    };
  }
  await server.Job.bulkCreate(jobs);
});

When("создаю для него регистрации {string}", async function(
  registerNames: string
) {
  const Facility = (await server.Facility.findAll())[0];
  const Contact = (await server.Contact.findAll())[0];
  const Resource = (await server.Resource.findAll())[0];
  const registers: IRegister[] = [];
  for (const RegisterName of registerNames.split(", ")) {
    registers.push({
      AssetType: "",
      CreatedBy: Contact[0].GUID,
      ExternalNameID: "",
      ExternalSystemName: "",
      FacilityGUID: Facility.GUID,
      GUID: uuid.v4(),
      ProductType: "",
      RegisterApprovalBy: "",
      RegisterID: 1,
      RegisterName,
      RegisterReference: "",
      RegisterType: "",
      Withdrawn: "No",
      createdAt: new Date(),
      updatedAt: new Date(),
      ResourceGUID: Resource.GUID
    });
  }
  Registers = await server.Register.bulkCreate(registers);
});

/*
  DUMP EXCEL
*/

When("я загружаю файл excel с данными", async function() {
  const file = fs.createReadStream(`${__dirname}/${filename}`);
  const formData = new FormData();

  const Project = await server.Project.findAll();

  formData.append("cimsFile", file);
  formData.append("ProjectGUID", Project[0].GUID);

  const payload = await streamToPromise(formData);
  const lastResponse = await server._server.inject({
    method: "POST",
    url: `${mainURI}/${path.cims}/${path.dump}`,
    payload,
    headers: {
      Authorization,
      ...formData.getHeaders()
    }
  });

  setResponse(lastResponse);
});

When("я загружаю новый файл excel с данными", async function() {
  const file = fs.createReadStream(`${__dirname}/${newFilename}`);
  const formData = new FormData();

  const Project = await server.Project.findAll();

  formData.append("cimsFile", file);
  formData.append("ProjectGUID", Project[0].GUID);

  const payload = await streamToPromise(formData);
  const lastResponse = await server._server.inject({
    method: "POST",
    url: `${mainURI}/${path.cims}/${path.dump2}`,
    payload,
    headers: {
      Authorization,
      ...formData.getHeaders()
    }
  });

  setResponse(lastResponse);
});

Then("вернуть ответ {string}", function(row) {
  const res = getResponse();
  expect(res.result).to.eql(row);
});

Then("в базе появились следующие записи", async function(dataTable) {
  for (const data of dataTable.hashes()) {
    const res: any[] = await server[data.Table].findAll({});
    const fld = `${data.Table}ID`;
    res.sort((a, b) => +a[fld] - +b[fld]);
    const row = res[data.Index].toJSON();

    expect(row[data.Field]).to.eql(data.Value);
  }
});

Then(
  "в файле шаблона ЦИМС на странице с ресурсами должны быть {int} записи",
  function(count) {
    const file = fs.readFileSync(
      `${__dirname}/../../../src/helper/CIMS/${CIMSTemplateFilename}`
    );
    const File = xlsx.read(file, { type: "buffer" });
    expect(File.SheetNames).include(ResourceCIMSSheetName);
    const ResourcesSheet = File.Sheets[ResourceCIMSSheetName];
    const json: IResourceForCIMS[] = xlsx.utils.sheet_to_json(ResourcesSheet);
    expect(json.length).to.eql(count);
    expect(json[0].ResourceIDPick).to.eql("1,ресурс1");
    expect(json[1].ResourceIDPick).to.eql("1,ресурс2");
  }
);

When("я делаю запрос на файл со списком ресурсов", async function() {
  const res = await server._server.inject({
    url: `${mainURI}/${path.cims}/${routeName}`,
    method: "GET",
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then("в файле со списком ресурсов есть {int} записи", function(count) {
  const file = fs.readFileSync(
    `${__dirname}/../../../src/helper/CIMS/${ResourceSheetFilename}`
  );
  const File = xlsx.read(file, { type: "buffer" });
  expect(File.SheetNames).include(ResourceCIMSSheetName);
  const ResourcesSheet = File.Sheets[ResourceCIMSSheetName];
  const json: IResourceForCIMS[] = xlsx.utils.sheet_to_json(ResourcesSheet);
  expect(json.length).to.eql(count);
  expect(json[0].ResourceIDPick).to.eql("1,ресурс1");
  expect(json[1].ResourceIDPick).to.eql("2,ресурс2");
});

Then("появились плановые данные по компонентам", async function() {
  const Plans = await server.Plan.findAll();
  expect(Plans).length.greaterThan(0, "Plans are empty");
});

Then("появились фактические данные по компонентам", async function() {
  const Facts = await server.Fact.findAll();
  expect(Facts).length.greaterThan(0, "Facts are empty");
});

When("я загружаю файл excel с некорректными данными", async function() {
  const file = fs.createReadStream(`${__dirname}/${incorrectFileName}`);
  const formData = new FormData();

  const Project = await server.Project.findAll();

  formData.append("cimsFile", file);
  formData.append("ProjectGUID", Project[0].GUID);

  const payload = await streamToPromise(formData);
  const lastResponse = await server._server.inject({
    method: "POST",
    url: `${mainURI}/${path.cims}/${path.dump}`,
    payload,
    headers: {
      Authorization,
      ...formData.getHeaders()
    }
  });

  setResponse(lastResponse);
});

Then("в базе нет объектов и контактов", async function() {
  const res = getResponse();

  const Facilities = await server.Facility.findAll();
  expect(Facilities.length).to.eql(0);
  const Contacts = await server.Contact.findAll();
  expect(Contacts.length).to.eql(0);
});

Then("у каждого компонента есть привязка к этажу", async function() {
  const Components = await server.Component.findAll();

  for (const Component of Components) {
    expect(Component.FloorGUID).not.empty;
  }
});

Then("в таблице плана появилось {int} записей", async function(count: number) {
  const Plans = await server.Plan.findAll();
  expect(Plans.length).to.eql(count);
});
