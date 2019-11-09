import { When, Then } from "cucumber";
import { server } from "../../src/server";
import { mainURI } from "../../src/constants";
import { routeName } from "../../src/helper/Measure/constants";
import { Authorization } from "./constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import { IMeasure } from "../../src/helper/Measure/interfaces";
import utils from "../../src/utils";

When("я создаю новую единицу измерения {string}", async function(MeasureName) {
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "POST",
    payload: [
      {
        MeasureName,
        MeasureID: 1
      }
    ],
    headers: {
      Authorization
    }
  });
  setResponse(res);
});
Then("в ответе новая единица измерения {string}", function(MeasureName) {
  const res: IMeasure[] = getResponse().result;

  expect(res).length.greaterThan(0);

  expect(res[0].MeasureName).to.eql(MeasureName);
});

When("я запрашиваю список единиц измерения системы", async function() {
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "GET",
    headers: {
      Authorization
    }
  });
  setResponse(res);
});

Then(
  "в ответе должен быть массив единиц измерения с единицей измерения {string}",
  function(MeasureName) {
    const res: IMeasure[] = getResponse().result;

    expect(res.length).greaterThan(0, "Array of measures is empty");

    expect(res[0].MeasureName).to.eql(MeasureName);
  }
);

When("я делаю запрос удаления единицы измерения {string}", async function(
  MeasureName
) {
  const Measure = utils.mapElementsToJSON(
    await server.Measure.findAll({ where: { MeasureName } })
  );
  const res = await server._server.inject({
    url: `${mainURI}/${routeName}`,
    method: "DELETE",
    headers: { Authorization },
    payload: [Measure[0].GUID]
  });

  setResponse(res);
});

Then("список единиц измерения должен быть пуст", async function() {
  const Measures = await server.Measure.findAll();
  expect(Measures.length).to.eql(0);
});

When(
  "я делаю запрос обновления данных единицы измерения {string} на {string}",
  async function(oldMeasureName, newMeasureName) {
    const Measure = await server.Measure.findOne({
      where: {
        MeasureName: oldMeasureName
      }
    });
    if (!Measure) {
      throw new Error("Measure is null");
    }
    const res = await server._server.inject({
      url: `${mainURI}/${routeName}`,
      method: "PUT",
      headers: { Authorization },
      payload: [{ GUID: Measure.GUID, MeasureName: newMeasureName }]
    });

    setResponse(res);
  }
);

Then(
  "в ответе должен быть массив с обновленной единицей измерения {string}",
  function(newMeasureName) {
    const Resources: IMeasure[] = getResponse().result;

    expect(Resources).length.greaterThan(0);

    expect(Resources[0].MeasureName).to.eql(newMeasureName);
  }
);
