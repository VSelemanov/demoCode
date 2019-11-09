import { When, Then } from "cucumber";
import { server } from "../../src/server";
import uuid from "uuid";
import { mainURI } from "../../src/constants";
import { setResponse, getResponse } from "./lib/response";
import { Authorization } from "./constants";
import fs from "fs";
import streamToPromise from "stream-to-promise";
import FormData from "form-data";

import { expect } from "chai";

When("я ввожу факт {string} с {int} фото по компоненту", async function(
  SisResource: string,
  count: number
) {
  const isResource = SisResource === "true";
  const Component = (await server.Component.findAll())[0];
  const Register = await server.Register.findByPk(Component.RegisterGUID, {
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

  if (!Register) {
    throw new Error("Register is empty (fact test)");
  }

  const formData = new FormData();
  const filename = "1.jpg";
  const file = fs.createReadStream(`${__dirname}/${filename}`);

  formData.append("ComponentGUID", Component.GUID);
  formData.append("JobGUID", (Register as any).Resource.Jobs[0].GUID);
  formData.append("value", 100);
  formData.append("isResource", `${isResource}`);
  formData.append("uploadedAt", new Date().toISOString());

  for (let i = 0; i < count; i++) {
    formData.append(`photofact${i}`, file, `${i}.jpg`);
  }

  formData.append("UserGUID", "5cde92fc74fadd9e9015eb7c");

  const payload = await streamToPromise(formData);

  const res = await server._server.inject({
    url: `${mainURI}/fact`,
    method: "POST",
    headers: {
      Authorization,
      ...formData.getHeaders()
    },
    payload
  });

  setResponse(res);
});

Then("в ответе новый факт", function() {
  const res = getResponse().result;

  expect(res).has.property("value");
  expect(res).has.property("GUID");
  expect(res).has.property("ComponentGUID");
});

Then("в таблице фото факта появились {int} записи", async function(count) {
  const PhotoFacts = await server.PhotoFact.findAll();

  expect(PhotoFacts.length).eql(count);
});

When("запрашиваю список фактов по компоненту", async function() {
  const Component = (await server.Component.findAll())[0];
  const res = await server._server.inject({
    url: `${mainURI}/fact?ComponentGUID=${Component.GUID}`,
    method: "GET",
    headers: { Authorization }
  });

  setResponse(res);
});

Then(
  "в ответе должен быть объект с двумя свойствами-массивами {string} и {string}",
  function(JobFactsName: string, ResourceFactsName: string) {
    const res = getResponse().result;

    expect(res)
      .has.property(JobFactsName)
      .with.length.greaterThan(0, "Array is empty");
    expect(res)
      .has.property(ResourceFactsName)
      .with.length.greaterThan(0, "Array is empty");
  }
);

When("я оставляю комментарий к факту и ставлю оценку", async function() {
  const Fact = await server.Fact.findAll();

  const res = await server._server.inject({
    url: `${mainURI}/fact`,
    method: "PUT",
    headers: { Authorization },
    payload: [
      {
        GUID: Fact[0].GUID,
        Comment: "Комментарий",
        Mark: 7
      }
    ]
  });

  setResponse(res);
});

Then(
  "в ответе массив фактов с фактом у которого есть комментарий и оценка",
  function() {
    const res = getResponse().result;

    expect(res).length.greaterThan(0);
    expect(res[0]).have.property("Comment");
    expect(res[0]).have.property("Mark");
    expect(res[0].Comment).to.eql("Комментарий");
    expect(+res[0].Mark).to.eql(7);
  }
);
