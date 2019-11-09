import { When, Then, Given } from "cucumber";
import { Authorization } from "./constants";
import { server } from "../../src/server";
import { mainURI } from "../../src/constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import { IJobBase, IJob, IJobTree } from "../../src/helper/Job/interfaces";
import { routeName } from "../../src/helper/Job/constants";
import utils from "../../src/utils";

Given(
  "создаю новую работу {string} по ресурсу {string} с подчинением работе {string}",
  async function(JobName: string, ResourceName: string, ParentJobName: string) {
    const Measure = (await server.Measure.findAll())[0];
    const Resource = (await server.Resource.findAll({
      where: { ResourceName }
    }))[0];
    const ParentJob = (await server.Job.findAll({
      where: { JobName: ParentJobName }
    }))[0];
    const res = await server._server.inject({
      url: `${mainURI}/job`,
      method: "POST",
      payload: [
        {
          ENIRGUID: "",
          GESNGUID: "",
          ResourceGUID: Resource.GUID,
          JobName,
          MeasureGUID: Measure.GUID,
          ParentGUID: ParentJob.GUID,
          ClassificationCode: `${JobName.slice(-1)}-job`
        }
      ] as Array<IJobBase & { ResourceGUID: string }>,
      headers: { Authorization }
    });
  }
);

When("создаю новую работу {string} по ресурсу {string}", async function(
  JobName: string,
  ResourceName: string
) {
  const Measure = (await server.Measure.findAll())[0];
  const Resource = (await server.Resource.findAll({
    where: { ResourceName }
  }))[0];
  const res = await server._server.inject({
    url: `${mainURI}/job/single`,
    method: "POST",
    payload: {
      ENIRGUID: "",
      GESNGUID: "",
      ResourceGUID: Resource.GUID,
      JobName,
      MeasureGUID: Measure.GUID,
      ClassificationCode: `${JobName.slice(-1)}-job`
    } as IJobBase & { ResourceGUID: string },
    headers: { Authorization }
  });

  setResponse(res);
});

Then("в ответе новая работа {string}", function(JobName) {
  const res = getResponse().result;

  expect(res).has.property("GUID");
  expect(res).has.property("JobName");
  expect(res.JobName).to.eql(JobName);
});

When("я запрашиваю работы системы {string} по ресурсу {string}", async function(
  flag: string,
  ResourceName: string
) {
  const Resource = (await server.Resource.findAll({
    where: { ResourceName }
  }))[0];

  const res = await server._server.inject({
    url: `${mainURI}/job?ResourceGUID=${Resource.GUID}&isTree=${flag}`,
    method: "GET",
    headers: { Authorization }
  });

  setResponse(res);
});

Then("в ответе должен быть массив работ с работой {string}", function(JobName) {
  const res = getResponse().result;

  expect(res).with.length.greaterThan(0);
  expect(res[0]).has.property("GUID");
  expect(res[0]).has.property("JobName");
  expect(res[0]).has.property("Measure");
  expect(res[0].JobName).to.eql(JobName);
});

Then(
  "в ответе должен быть массив работ с работами {string} и {string}",
  function(JobName0, JobName1) {
    const res: IJob[] = getResponse().result;

    expect(res).with.length.greaterThan(0);
    expect(res[0].JobName).to.eql(JobName0);
    expect(res[1].JobName).to.eql(JobName1);
  }
);

Then(
  "в ответе должен быть массив работ в виде дерева с работой {string} у которой есть работа {string}",
  async function(JobName0: string, ChildJobName0: string) {
    const res: IJobTree[] = getResponse().result;

    expect(res).length.greaterThan(0, "Jobs array is empty");
    expect(res[0].JobName).to.eql(JobName0);
    expect(res[0].children).length.greaterThan(
      0,
      "Job children array is empty"
    );
    expect(res[0].children[0].JobName).to.eql(ChildJobName0);
  }
);

When("я запрашиваю все работы системы", async function() {
  const res = await server._server.inject({
    url: `${mainURI}/job`,
    method: "GET",
    headers: { Authorization }
  });
  setResponse(res);
});

Then("в ответе должен быть массив с {int} работами", function(count: number) {
  const res: IJob[] = getResponse().result;

  expect(res.length).to.eql(count);
});

When("я делаю запрос удаления работы {string}", async function(
  JobName: string
) {
  const Job = await server.Job.findOne({ where: { JobName } });
  if (!Job) {
    throw new Error("Job is null");
  }

  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: { Authorization },
    payload: [Job.GUID]
  });

  setResponse(res);
});

Then(
  "в списке работ ресурса {string} должна быть {int} работа {string}",
  async function(ResourceName: string, length: number, JobName: string) {
    const Resource = await server.Resource.findOne({ where: { ResourceName } });
    if (!Resource) {
      throw new Error("Resource is null");
    }
    const Jobs = utils.mapElementsToJSON(
      await server.Job.findAll({ where: { ResourceGUID: Resource.GUID } })
    );

    expect(Jobs.length).to.eql(length);

    expect(Jobs[0].JobName).to.eql(JobName);
  }
);

When(
  "я делаю запрос обновления данных работы {string} на {string}",
  async function(oldJobName, newJobName) {
    const Job = await server.Job.findOne({ where: { JobName: oldJobName } });
    if (!Job) {
      throw new Error("Job is null");
    }

    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "PUT",
      headers: { Authorization },
      payload: [{ GUID: Job.GUID, JobName: newJobName }]
    });

    setResponse(res);
  }
);

Then(
  "в ответе должен быть обновленная работа {string} с единицей измерения",
  function(JobName) {
    const Jobs: IJob[] = getResponse().result;

    expect(Jobs).length.greaterThan(0);

    expect(Jobs[0].JobName).to.eql(JobName);
    expect(Jobs[0]).have.property("Measure");
  }
);

Then("в ответе новая работа {string} с полем {string} = {int}", async function(
  JobName: string,
  FldName: string,
  FldValue: number
) {
  const res: IJob = getResponse().result;
  // expect(res).length.greaterThan(0, "Jobs array is empty");
  expect(res.JobName).to.eql(JobName);
  expect(res[FldName]).to.eql(FldValue);
});
