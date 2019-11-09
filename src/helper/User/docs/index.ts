import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";

export const read = {
  description: "Получить список фактов по компоненту",
  /*notes:
    "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", "plan"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};

export const create = {
  description: "Ввод факта по компоненту",
  /*notes:
    "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", "plan"],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(createSchema)
      }
    }
  }
};
