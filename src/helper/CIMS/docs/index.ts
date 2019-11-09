import enjoi from "enjoi";

import cimsRequest from "../schemas/upload/request.schema.json";
import cimsTemplateRequest from "../schemas/template/request.schema.json";

export const cims = {
  description: "Загрузить ЦИМС модель",
  tags: ["api", "cims"],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(cimsRequest)
      }
    }
  }
};

export const readTemplate = {
  description: "Получить файл шаблона ЦИМС",
  tags: ["api", "cims"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(cimsTemplateRequest)
      }
    }
  }
};

export const readResourceSheet = {
  description: "Получить файл с листом ресурсов системы",
  tags: ["api", "cims"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(cimsTemplateRequest)
      }
    }
  }
};
