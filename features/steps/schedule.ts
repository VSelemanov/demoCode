// import { Given, When, Then } from "cucumber";
// import { server } from "../../src/server";
// // import planFactCtrl from "../../src/controllers/planFact";
// import { mainURI } from "../../src/constants";
// import { expect } from "chai";
// import dataFactCtrl from "../../src/controllers/dataFact";
// import moment = require("moment");

// import { getResponse, setResponse } from "./lib/response";

// import { Authorization } from "./constants";

// const bimObjectId = "b5645f1e-427c-11e9-9a9b-3c77e6ef04ce";

// const schedule = {
//   id: "b8aa5176-09e5-4bd4-9aa9-daf0f40362c4",
//   name: "test gantt",
//   bimObjectId
// };

// const testScheduleItems: any[][] = [
//   [
//     {
//       id: "8172e1ea-92f6-4816-9614-be879e557f5c",
//       name: "level0",
//       parentId: null,
//       elementId: "988c6199-46d2-11e9-8c62-3c77e6ef04ce"
//     }
//   ],
//   [
//     {
//       id: "422dc39c-b605-463d-9ff5-fc7cc934ff71",
//       name: "level1.1",
//       parentId: "8172e1ea-92f6-4816-9614-be879e557f5c",
//       elementId: "b9406343-46fc-11e9-ae70-002590a9359d"
//     },
//     {
//       id: "ae2206dd-d69c-4598-8b62-c1400421a39a",
//       name: "level1.2",
//       parentId: "8172e1ea-92f6-4816-9614-be879e557f5c",
//       elementId: "65773fc1-46d5-11e9-8c62-3c77e6ef04ce"
//     }
//   ],
//   [
//     {
//       id: "c2745117-b900-4c12-8958-235146cf387a",
//       name: "level2.1",
//       parentId: "422dc39c-b605-463d-9ff5-fc7cc934ff71"
//     },
//     {
//       id: "865b6de2-1e69-410d-9178-9c699cd7b18c",
//       name: "level2.2",
//       parentId: "422dc39c-b605-463d-9ff5-fc7cc934ff71"
//     }
//   ]
// ];

// Given("в расписании данных нет", async function() {
//   await server.schedule.truncate({ cascade: true });
// });

// Given("в элементах расписания данных нет", async function() {
//   await server.scheduleItem.truncate({ cascade: true });
// });

// Given("в расписании создана запись для типового дома", async function() {
//   await server.schedule.create(schedule);
// });

// Given(
//   "в элементах созданы записи {int} уровня с начальной датой {string} и датой окончания {string}",
//   async function(level, startedAt, finishedAt) {
//     const rows = testScheduleItems[level];

//     for (const r of rows) {
//       r.scheduleId = schedule.id;
//       r.startedAt = dateParse(startedAt);
//       r.finishedAt = dateParse(finishedAt);
//       r.duration = 0;
//     }

//     await server.scheduleItem.bulkCreate(rows);
//   }
// );

// When(
//   "я отправляю запрос на получение данных для диаграммы Гантта по типовому объекту",
//   async function() {
//     const lastResponse = await server._server.inject({
//       method: "GET",
//       url: `${mainURI}/schedule?bimObjectId=${bimObjectId}`,
//       headers: {
//         Authorization
//       }
//     });
//     setResponse(lastResponse);
//   }
// );

// Then(
//   "дата начала интервала равна {string} дата окончания равна {string}",
//   function(dateFrom, dateTo) {
//     const lastResponse = getResponse();
//     const res = lastResponse.result[0];
//     expect(moment(dateParse(dateFrom)).unix()).to.eql(
//       moment(res.dateFrom).unix()
//     );
//     expect(moment(res.dateTo).unix()).to.eql(moment(dateParse(dateTo)).unix());
//   }
// );

// Then("даты в дереве соответствуют таблице:", function(dataTable) {
//   const lastResponse = getResponse();
//   const scheduleItems = lastResponse.result[0].scheduleItems;

//   for (const data of dataTable.hashes()) {
//     const item = getItemByLvl(scheduleItems, +data.level);

//     expect(moment(item.startedAt).unix()).to.eql(
//       moment(dateParse(data.startedAt)).unix(),
//       `
//       ${item.startedAt} are not equal ${data.startedAt}, level = ${data.level}
//       `
//     );

//     expect(moment(item.finishedAt).unix()).to.eql(
//       moment(dateParse(data.finishedAt)).unix(),
//       `
//       ${item.finishedAt} are not equal ${data.finishedAt}, level = ${data.level}
//       `
//     );
//   }
// });

// Then("в конструктивах указаны следующие проценты готовности:", function(
//   dataTable
// ) {
//   const lastResponse = getResponse();
//   const scheduleItems = lastResponse.result[0].scheduleItems;

//   for (const data of dataTable.hashes()) {
//     const scheduleItem = getItemByElementId(scheduleItems, data.constructiveId);
//     expect(scheduleItem).not.null;
//     expect(scheduleItem.percents).to.eql(
//       +data.percents,
//       `
//       percents of element in scheduleItem ${
//         scheduleItem.percents
//       } are not equal to ${data.percents}
//     `
//     );
//   }
// });

// function dateParse(date) {
//   return moment.utc(date, "DD.MM.YYYY").toISOString();
// }

// function getItemByLvl(scheduleItems, itemLevel) {
//   for (const item of scheduleItems) {
//     if (itemLevel === 0) {
//       return item;
//     } else {
//       return getItemByLvl(item.children, itemLevel - 1);
//     }
//   }
// }

// function getItemByElementId(scheduleItems, elementId) {
//   for (const si of scheduleItems) {
//     if (si.elementId === elementId) {
//       return si;
//     } else if (si.children && si.children.length) {
//       const el = getItemByElementId(si.children, elementId);
//       if (el) {
//         return el;
//       }
//     }
//   }
//   return null;
// }
