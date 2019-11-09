import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
import photosSchema from "../schemas/photos/request.schema.json";
import { routeName } from "../constants";

export const read = {
  description: "Получить список фактов по компоненту!",
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
  description: "Ввод факта по компоненту",
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

export const updateDoc = {
  description: "Обновить поля факта",
  notes: "Планируется использование для оценки и комментирования факта",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(updateSchema)
      }
    }
  }
};

export const getPhotosDoc = {
  description: "Получить фотографии фактов для объекта",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(photosSchema)
      }
    }
  }
};
