import { When, Then } from "cucumber";
import { server } from "../../src/server";
import { mainURI, path } from "../../src/constants";
import { routeName } from "../../src/helper/Project/constants";
import { Authorization } from "./constants";
import { IProjectBase, IProject } from "../../src/helper/Project/interfaces";
import { setResponse, getResponse } from "./lib/response";
import streamToPromise from "stream-to-promise";
import FormData from "form-data";
import fs from "fs";

import { expect } from "chai";
import utils from "../../src/utils";
import moment = require("moment");

When("я делаю запрос на создание проектов {string}", async function(
  ProjectsName: string
) {
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "POST",
    headers: {
      Authorization
    },
    payload: ProjectsName.split(",").map(
      name =>
        ({
          FacilityCount: 0,
          name,
          region: "test",
          street: "test",
          totalArea: 10,
          town: "test",
          PlanFacilities: 1
        } as IProjectBase)
    ) as IProjectBase[]
  });

  setResponse(res);
});

When("я делаю запрос на создание проекта {string}", async function(
  ProjectName
) {
  const formData = new FormData();
  const filename = "1.jpg";
  const file = fs.createReadStream(`${__dirname}/${filename}`);

  formData.append("FacilityCount", "0");
  formData.append("name", ProjectName);
  formData.append("region", "test");
  formData.append("street", "test");
  formData.append("totalArea", "10");
  formData.append("town", "test");

  formData.append("previewImg", file);
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
});

Then("в ответе должен быть массив проектов с проектом {string}", function(
  ProjectName
) {
  const Projects: IProject[] = getResponse().result;

  expect(Projects).length.greaterThan(0);

  expect(Projects[0]).to.have.property("GUID");
  expect(Projects[0].name).to.eql(ProjectName);
});

When("я делаю запрос на получение списка проектов", async function() {
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "GET",
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

When("я делаю запрос на получение списка проектов админ", async function() {
  const res = await server._server.inject({
    url: `${mainURI}/${path.admin}/${routeName}`,
    method: "GET",
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

When("я делаю запрос на удаление проектов", async function() {
  const Project = utils.mapElementsToJSON(await server.Project.findAll())[0];
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: {
      Authorization
    },
    payload: [Project.GUID]
  });

  setResponse(res);
});

Then("список проектов должен быть пустой", async function() {
  const Projects = await server.Project.findAll();

  expect(Projects.length).to.eql(0);
});

When(
  "я делаю запрос на обновление иннформации по проектам {string}",
  async function(newProjectName: string) {
    const Project = utils.mapElementsToJSON(await server.Project.findAll())[0];
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "PUT",
      headers: {
        Authorization
      },
      payload: [{ GUID: Project.GUID, name: newProjectName }]
    });

    setResponse(res);
  }
);

Then("вернуть массив обновленных записей с проектом {string}", function(
  newProjectName: string
) {
  const res: IProject[] = getResponse().result;

  expect(res[0].name).to.eql(newProjectName);
});

Then("у проекта {string} есть превью и главная картинки", function(name) {
  const Project: IProject = getResponse().result[0];

  expect(Project.name).to.eql(name);

  expect(Project).have.property("mainImg");
  expect(Project.mainImg).not.empty;
  expect(Project).have.property("previewImg");
  expect(Project.previewImg).not.empty;
});

When(
  "я делаю запрос на обновление проекта {string} на проект {string}",
  async function(name, newname) {
    const Project: IProject = (await server.Project.findAll({
      where: { name }
    }))[0];

    const formData = new FormData();
    const filename = "1.jpg";
    const file = fs.createReadStream(`${__dirname}/${filename}`);

    formData.append("name", newname);
    formData.append("GUID", Project.GUID);
    formData.append("previewImg", file);
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

When("я делаю запрос на получение отчета ввода объектов", async function() {
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}/facilityCountReport?dateFrom=${moment().format(
      "YYYY-MM-DD"
    )}&dateTo=${moment().format("YYYY-MM-DD")}`,
    method: "GET",
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then("в ответе должен быть массив данных отчета", async function() {
  const res = getResponse().result;

  expect(Array.isArray(res)).to.eql(true);
});
