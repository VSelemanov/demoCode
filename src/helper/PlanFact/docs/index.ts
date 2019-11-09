import enjoi from "enjoi";

import planfactSchema from "../schemas/read/request.schema.json";

export const readPlanFact = {
  description: "Планфактный анализ объекта строительства",
  //   notes: "",
  tags: ["api", "planfact"],
  plugins: {
    "hapi-swagger": {
      validate: {
        query: enjoi.schema(planfactSchema)
      }
    }
  }
};
