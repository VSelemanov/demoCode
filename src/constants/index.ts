export const moduleName = "esb";

export const dumpMethod = "eps_data";

export enum GeneralErrorMessages {
  UNKNOWN_EVENT = "Неизвестный тип события",

  UNKNOWN_METHOD = "Незивестный метод запроса в RPC",

  UNKNOWN_TYPE = "Незивестный тип сущности в RPC",

  UNKNOWMN = "Неизвестная ошибка базы данных",

  SHEET_NOT_FOUND = "Лист для парсинга не найден",

  FILE_NOT_FOUND = "Файл не найден"
}

export enum eventProducerTypes {
  change = "change",
  delete = "delete"
}

export const VERSION = "1.0";

export const mainURI = `/${moduleName}/${VERSION}`;

export const adminPath = `admin`;

export enum path {
  events = "events",
  dump = "dump",
  dump2 = "dump2",
  cims = "cims",
  admin = "admin",
  formdata = "formdata"
}

export const noteForDelete =
  "В качестве строки необходимо передавать GUID записи для удаления";

export const coreURI = "https://unoto.lad24.ru/api/event";

export const usersURI = `${process.env.USERS_URI ||
  "https://esbunoto.lad24.ru:8085"}/internalApi/users/getListByIds`;
export const usersToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY1NjA5MDc1fQ.gojBJrTbhaBkkh83R2KZEsVDP9AHBXEe-VckbwxYsaY";

export const CDNURI = "https://api.selcdn.ru/auth/v1.0";

export const CDNContainerName = "pss";

export const CDNFileBaseURI = "https://165104.selcdn.ru/pss/";

export const filesPath = "./files";

export const ScheduleParamsAttrs = ["startedAt", "finishedAt"];

export const dateFlds = [
  "createdAt",
  "updatedAt",
  "uploadedAt",
  "deadline",
  "dateFrom",
  "dateTo",
  "startedAt",
  "finishedAt"
];
