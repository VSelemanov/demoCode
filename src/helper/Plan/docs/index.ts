import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import { routeName } from "../constants/";

export const read = {
  description: "Получить список планов по компоненту",
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
  description: "Ввод плана по компоненту",
  /*notes:
    "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(createSchema)
      }
    }
  }
};
