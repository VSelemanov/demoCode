import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";

export const read = {
  description: "Получить список register",
  /*notes:
    "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", "register"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};
