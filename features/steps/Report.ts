import { Given, When, Then } from "cucumber";
import { server } from "../../src/server";
import fs from "fs";
import { mainURI } from "../../src/constants";
import { routeName, ReportPaths } from "../../src/helper/Report/constants";
import FormData from "form-data";
import streamToPromise from "stream-to-promise";
import { Authorization } from "./constants";
import { setResponse, getResponse } from "./lib/response";
import utils from "../../src/utils";
import { expect } from "chai";
import uuid = require("uuid");
import {
  IReportItem,
  IReportWithFiles,
  IReportTypeBase,
  IReportType
} from "../../src/helper/Report/interfaces";

const filename = "minstroi.xlsx";

async function getReportType(name): Promise<IReportType> {
  return utils.mapElementsToJSON(
    await server.ReportType.findAll({ where: { name } })
  )[0];
}

Given("я создаю тестовый тип отчета", async function() {
  await server.ReportType.create({
    example: "",
    name: "test type"
  });
});
When("я делаю запрос на загрузку отчета в систему", async function() {
  const file = fs.createReadStream(`${__dirname}/${filename}`);
  const formData = new FormData();

  const ReportType = (await server.ReportType.findAll())[0];

  formData.append("ReportFile", file);
  formData.append("ReportTypeGUID", ReportType.GUID);

  const payload = await streamToPromise(formData);
  const lastResponse = await server._server.inject({
    method: "POST",
    url: `${mainURI}/${routeName}/excel`,
    payload,
    headers: {
      Authorization,
      ...formData.getHeaders()
    }
  });

  setResponse(lastResponse);
});
Then("в базе должен появиться новый отчет", async function() {
  const Reports = utils.mapElementsToJSON(await server.Report.findAll());

  expect(Reports.length).to.eql(1);
});
Then("в базе должен появиться новый файл", async function() {
  const ReportFiles = utils.mapElementsToJSON(
    await server.ReportFile.findAll()
  );

  expect(ReportFiles.length).to.eql(1);
});
Then("в базе должны появиться новые элементы", async function() {
  const ReportItems = utils.mapElementsToJSON(
    await server.ReportItem.findAll()
  );

  expect(ReportItems.length).greaterThan(0);
});

// Сценарий получения отчета
Given("в базе есть отчет с привязкой к типу", async function() {
  const ReportType = utils.mapElementsToJSON(
    await server.ReportType.findAll()
  )[0];

  await server.Report.create({
    ReportTypeGUID: ReportType.GUID,
    dateFrom: new Date(),
    dateTo: new Date(),
    orgId: null,
    name: "test"
  });
});

Given("у отчета есть загруженный файл", async function() {
  const Report = utils.mapElementsToJSON(await server.Report.findAll())[0];

  await server.ReportFile.create({
    ReportGUID: Report.GUID,
    extension: "test",
    filename: "test",
    size: 123,
    version: 1,
    UserGUID: uuid.v4()
  });
});

Given("у файла есть элементы отчета", async function() {
  const ReportFile = utils.mapElementsToJSON(
    await server.ReportFile.findAll()
  )[0];

  const ReportItems: IReportItem[] = [];
  for (let i = 0; i < 5; i++) {
    ReportItems.push({
      GUID: uuid.v4(),
      ReportFileGUID: ReportFile.GUID,
      createdAt: new Date(),
      updatedAt: new Date(),
      params: {
        moneyIntervalFact: 0,
        moneyIntervalPlan: 0,
        moneyMonthFact: 0,
        moneyMonthPlan: 0,
        moneyTotalPlan: 0,
        monthFact: 0,
        monthPlan: 0,
        yearFact: 0,
        yearPlan: 0,
        name: `item${i}`
      },
      parentGUID: null
    });
  }
  await server.ReportItem.bulkCreate(ReportItems);
});

When("я делаю запрос на получение отчета", async function() {
  const ReportType = utils.mapElementsToJSON(
    await server.ReportType.findAll()
  )[0];
  const lastResponse = await server._server.inject({
    method: "GET",
    url: `${mainURI}/${routeName}?ReportTypeGUID=${ReportType.GUID}`,
    headers: {
      Authorization
    }
  });

  setResponse(lastResponse);
});

Then("в ответе должен быть массив отчетов с одним отчетом", async function() {
  const Reports = getResponse().result as any[];

  expect(Reports.length).greaterThan(0, "Array of reports is empty");
});

Then("в отчете должен быть массив файлов с одним файлом", async function() {
  const Reports = getResponse().result as IReportWithFiles[];

  expect(Reports[0].ReportFiles.length).greaterThan(
    0,
    "Array of files is empty"
  );
});

Then("в файле должны быть элементы отчета", async function() {
  const Reports = getResponse().result as IReportWithFiles[];

  expect(Reports[0].ReportFiles[0].ReportItems.length).greaterThan(
    0,
    "Array of items is empty"
  );
});

When("я делаю запрос на создание типов отчетов {string}", async function(
  ReportTypeNames: string
) {
  const ReportTypes = ReportTypeNames.split(",").map(
    (name): IReportTypeBase => ({
      example: "",
      name
    })
  );

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}/${ReportPaths.type}`,
    method: "POST",
    headers: {
      Authorization
    },
    payload: ReportTypes
  });

  setResponse(res);
});

Then(
  "в ответе должен быть массив с типами отчетов и с типом {string}",
  function(ReportTypeName) {
    const ReportTypes: IReportType[] = getResponse().result;

    expect(ReportTypes).length.greaterThan(0, "ReportTypes array is empty");
    expect(ReportTypes[0].name).to.eql(ReportTypeName);
  }
);

When("я делаю запрос на удаление типов отчетов {string}", async function(name) {
  const ReportType = await getReportType(name);

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}/${ReportPaths.type}`,
    method: "DELETE",
    headers: {
      Authorization
    },
    payload: [ReportType.GUID]
  });

  setResponse(res);
});

Then("список типов отчетов должен быть пустой", async function() {
  const ReportTypes = await server.ReportType.findAll();

  expect(ReportTypes.length).to.eql(0);
});

When(
  "я делаю запрос на обновление иннформации типа отчета {string} на {string}",
  async function(name, newName) {
    const ReportType = await getReportType(name);

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}/${ReportPaths.type}`,
      method: "PUT",
      headers: {
        Authorization
      },
      payload: [
        {
          GUID: ReportType.GUID,
          name: newName
        }
      ]
    });

    setResponse(res);
  }
);

Then(
  "сервер должен вернуть массив обновленных записей с типом отчетов {string}",
  async function(name) {
    const ReportTypes: IReportType[] = getResponse().result;

    expect(ReportTypes).length.greaterThan(0, "ReportTypes array is empty");

    expect(ReportTypes[0].name).to.eql(name);
  }
);
