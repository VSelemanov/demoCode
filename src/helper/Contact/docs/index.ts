import enjoi from "enjoi";

import readSchema from "../schemas/read/request.schema.json";

export const read = {
  description: "Получить список контактов",
  /*notes:
    "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", "contact"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};
