import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";

import { routeName } from "../constants/";
import { noteForDelete } from "../../../constants/";

export const read = {
  description: "Получить список систем",
  notes: "Параметры (один из): FacilityGUID, FloorGUID, SpaceGUID",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};

export const createDoc = {
  description: "Создать системы",
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
  description: "Удалить системы",
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
  description: "Обновить системы",
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
