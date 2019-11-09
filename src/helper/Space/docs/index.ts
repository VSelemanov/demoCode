import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
import { noteForDelete } from "../../../constants/";
import { routeName } from "../constants/";

export const read = {
  description: "Получить список помещений",
  /*notes:
    "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};

export const create = {
  description: "Создать помещения",
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
  description: "Удалить помещения",
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
  description: "Обновить помещения",
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
