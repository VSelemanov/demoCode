import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";
import readAdminSchema from "../schemas/read/requestAdmin.schema.json";
import factReportSchema from "../schemas/factReport/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import createFormDataSchema from "../schemas/create/formdataRequest.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
import updateFormDataSchema from "../schemas/update/formdataRequest.schema.json";

import { noteForDelete } from "../../../constants";
import { routeName } from "../constants";

export const read = {
  description: "Получить список объектов строительства",
  notes:
    "Параметры: ProjectGUID - для получения списка объектов по проекту, GUID - для получения информации по объекту",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};

export const readAdmin = {
  description: "Получить список всех объектов строительства (ADMIN)",
  notes: "q - строка для фильтрации по имени",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readAdminSchema)
      }
    }
  }
};

export const factReport = {
  description: "Получить отчет динамики ввода фактов",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(factReportSchema)
      }
    }
  }
};

export const create = {
  description: "Создать объекты строительства",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(createSchema)
      }
    }
  }
};

export const deleteDoc = {
  description: "Удалить объекты строительства",
  notes: noteForDelete,
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(deleteSchema)
      }
    }
  }
};

export const updateDoc = {
  description: "Обновить объекты строительства",
  // notes: "",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(updateSchema)
      }
    }
  }
};

export const createFormDataDoc = {
  description: "Создать объект (formdata)",
  // notes: "",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(createFormDataSchema)
      }
    }
  }
};

export const updateFormDataDoc = {
  description: "Обновить объект (formdata)",
  // notes: "",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(updateFormDataSchema)
      }
    }
  }
};
