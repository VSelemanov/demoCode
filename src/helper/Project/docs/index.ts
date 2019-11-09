import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import createFormDataSchema from "../schemas/create/formdataRequest.schema.json";
import facilityCountReportSchema from "../schemas/facilityCountReport/request.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
import updateFormDataSchema from "../schemas/update/formdataRequest.schema.json";
import { noteForDelete } from "../../../constants";
import { routeName } from "../constants/";

export const read = {
  description: "Получить список проектов",
  // notes: "",
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
  description: "Получить список проектов (Админка)",
  // notes: "",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};

export const facilityCountReport = {
  description: "Получить отчет количества введенных объектов",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(facilityCountReportSchema)
      }
    }
  }
};
export const createDoc = {
  description: "Создать проекты",
  // notes: "",
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
  description: "Удалить проекты",
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
  description: "Обновить проекты",
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
  description: "Создать проект (formdata)",
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
  description: "Обновить проект (formdata)",
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
