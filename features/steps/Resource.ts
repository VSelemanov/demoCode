import { When, Then, Given } from "cucumber";
import { Authorization } from "./constants";
import { server } from "../../src/server";
import { mainURI } from "../../src/constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import { routeName } from "../../src/helper/Resource/constants";
import {
  IResourceWithMeasure,
  IResourceTree,
  IResourceWithJob,
  IResource
} from "../../src/helper/Resource/interfaces";
import utils from "../../src/utils";
import { Op } from "sequelize";

Given("я создаю тестовую единицу измерения", async function() {
  await server.Measure.create({ MeasureID: 1, MeasureName: "тест.ед.изм" });
});

Given(
  /я ввожу новый ресурс "(.*?)" в систему с зависимостью от "(.*?)"$/,
  async function(ResourceName: string, ParentResourceName) {
    const Resource = (await server.Resource.findAll({
      where: { ResourceName: ParentResourceName }
    }))[0];

    await server.Resource.create({
      ClassificationID: (Resource.ClassificationID || 0) + 1,
      KSRGUID: "",
      ResourceName,
      ParentGUID: Resource.GUID,
      MeasureGUID: null,
      ClassificationCode: ResourceName.substr(-1, 1)
    });
  }
);

When(
  /я ввожу новый ресурс "(.*?)" в систему( с GUID "(.*?)")?$/,
  async function(ResourceName: string, guid: string) {
    const Measure = (await server.Measure.findAll())[0];
    const payload: any = [
      {
        KSRGUID: "",
        ClassificationID: 1,
        ResourceName,
        MeasureGUID: Measure.GUID,
        ClassificationCode: ResourceName.substr(-1, 1)
      }
    ];

    if (guid) {
      payload[0].GUID = guid;
    }

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "POST",
      payload,
      headers: { Authorization }
    });

    setResponse(res);
  }
);

Then("в ответе массив ресурсов с ресурсом {string}", function(ResourceName) {
  const res: IResource[] = getResponse().result;
  expect(res).length.greaterThan(0);
  expect(res[0]).has.property("GUID");
  expect(res[0]).has.property("ResourceName");
  expect(res[0].ResourceName).to.eql(ResourceName);
});

Then("в ответе должен быть массив ресурсов с ресуром {string}", function(
  ResourceName
) {
  const res = getResponse().result;

  expect(res).length.greaterThan(0, "Resources array is empty");
  expect(res[0]).has.property("GUID");
  expect(res[0]).has.property("ResourceName");
  expect(res[0]).has.property("Measure");
  expect(res[0].ResourceName).to.eql(ResourceName);
});

When("я запрашиваю ресурсы системы {string}", async function(flag) {
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}?isTree=${flag}`,
    method: "GET",
    headers: { Authorization }
  });

  setResponse(res);
});

Then("у {string} есть дочерний элемент {string}", function(
  ParentResourceName,
  ResourceName
) {
  const Resources: IResourceTree[] = getResponse().result;

  expect(Resources[0].ResourceName).to.eql(ParentResourceName);

  expect(Resources[0].children).length.greaterThan(
    0,
    "Resource children array is empty"
  );
  expect(Resources[0].children[0].ResourceName).to.eql(ResourceName);
});

Then(
  "в ответе должен быть массив ресурсов с ресурсами {string} и {string}",
  function(Resource0, Resource1) {
    const res: IResourceWithMeasure[] = getResponse().result;

    expect(res).length.greaterThan(0, "Array of resources list is empty");

    expect(res[0].ResourceName).to.eql(Resource0);
    expect(res[1].ResourceName).to.eql(Resource1);
  }
);

When(
  "я делаю запрос на получение списка ресурсов с работами",
  async function() {
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}?includeJobs=true`,
      method: "GET",
      headers: { Authorization }
    });

    setResponse(res);
  }
);

Then(
  "в ответе должен быть массив ресурсов с ресурсом {string} у которого есть {int} работы",
  function(ResourceName, JobsCount) {
    const res: IResourceWithJob[] = getResponse().result;

    expect(res).length.greaterThan(0);
    expect(res[0].ResourceName).to.eql(ResourceName);

    expect(res[0].Jobs.length).to.eql(JobsCount);
  }
);

When("я делаю запрос удаления ресурсов", async function() {
  const Resource = utils.mapElementsToJSON(await server.Resource.findAll());
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: { Authorization },
    payload: [Resource[0].GUID]
  });

  setResponse(res);
});

Then("список ресурсов должен быть пуст", async function() {
  const Resources = await server.Resource.findAll();

  expect(Resources.length).to.eql(0);
});

When(
  "я делаю запрос обновления данных ресурса {string} на {string}",
  async function(oldResourceName, newRsourceName) {
    const Resource = await server.Resource.findOne({
      where: {
        ResourceName: oldResourceName
      }
    });
    if (!Resource) {
      throw new Error("Resource is null");
    }
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "PUT",
      headers: { Authorization },
      payload: [{ GUID: Resource.GUID, ResourceName: newRsourceName }]
    });

    setResponse(res);
  }
);

Then(
  "в ответе должен быть обновленный ресурс {string} с единицей измерения",
  async function(newResourceName) {
    const Resources: IResource[] = getResponse().result;

    expect(Resources).length.greaterThan(0);

    expect(Resources[0].ResourceName).to.eql(newResourceName);
    expect(Resources[0]).have.property("Measure");
  }
);

Then(
  "в ответе массив ресурсов с ресурсом {string} и полем {string} = {int}",
  function(ResourceName: string, FldName: string, FldValue: number) {
    const res: IResource[] = getResponse().result;
    expect(res).length.greaterThan(0, "Resource array is empty");
    expect(res[0].ResourceName).to.eql(ResourceName);
    expect(res[0][FldName]).to.eql(FldValue);
  }
);

Given("создаю новую работу {string}", async function(JobName: string) {
  const Measure = (await server.Measure.findAll())[0];
  await server.Job.create({
    ClassificationCode: "",
    ENIRGUID: "",
    GESNGUID: "",
    JobID: 1,
    JobName,
    MeasureGUID: Measure.GUID,
    ParentGUID: null
  });
});

When(
  "я делаю запрос на создание связи между ресурсом {string} и работами {string}",
  async function(ResourceName: string, JobNames: string) {
    const Resource = (await server.Resource.findAll({
      where: { ResourceName }
    }))[0];

    const Jobs = await server.Job.findAll({
      where: {
        JobName: { [Op.in]: JobNames.split(",") }
      }
    });

    const res = await server.server.inject({
      method: "POST",
      url: `${mainURI}/${routeName}/linkjob`,
      headers: {
        Authorization
      },
      payload: {
        ResourceGUID: Resource.GUID,
        JobGUIDs: Jobs.map(r => r.GUID)
      }
    });

    setResponse(res);
  }
);
