import enjoi from "enjoi";

import readSchema from "../schemas/Report/read/request.schema.json";

import readTypeSchema from "../schemas/ReportType/read/request.schema.json";
import createTypeSchema from "../schemas/ReportType/create/request.schema.json";
import deleteTypeSchema from "../schemas/ReportType/delete/request.schema.json";
import updateTypeSchema from "../schemas/ReportType/update/request.schema.json";

import readFileSchema from "../schemas/ReportFile/read/request.schema.json";
import parseXlsSchema from "../schemas/Report/parseXls/request.schema.json";
import { noteForDelete } from "../../../constants/";
import { routeName } from "../constants/";

export const read = {
  description: "Отчёты из Excel",
  // notes: "",
  tags: ["api", "report"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readSchema)
      }
    }
  }
};

export const readType = {
  description: "Типы отчётов из Excel",
  // notes: "",
  tags: ["api", "report"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readTypeSchema)
      }
    }
  }
};

export const createType = {
  description: "Создать типы отчётов",
  // notes: "",
  tags: ["api", "report"],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(createTypeSchema)
      }
    }
  }
};

export const deleteType = {
  description: "Удалить типы отчетов",
  notes: noteForDelete,
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(deleteTypeSchema)
      }
    }
  }
};

export const updateType = {
  description: "Обновить типы отчетов",
  // notes: "",
  tags: ["api", routeName],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(updateTypeSchema)
      }
    }
  }
};

export const readFile = {
  description: "Получить файл исходного Excel",
  // notes: "",
  tags: ["api", "report"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(readFileSchema)
      }
    }
  }
};

export const BIDoc = {
  description: "Данные для экспорта в BI",
  // notes:
  //   "В ответе возвращается объект с полями BIData  и csv. BIData - массив объектов с данными для csv. csv - сформированные строки для файла",
  tags: ["api", "report"],
  plugins: {
    "hapi-swagger": {}
  }
};

export const parseXls = {
  description: "Отчёты из Excel. Парсер",
  // notes: "",
  tags: ["api", "report"],
  plugins: {
    "hapi-swagger": {
      validate: {
        payload: enjoi.schema(parseXlsSchema)
      }
    }
  }
};
