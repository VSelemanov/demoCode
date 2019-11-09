import xlsx from "xlsx";
import uuid from "uuid";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "AA",
  "AB",
  "AC",
  "AD"
];

export default (xlsFile: xlsx.WorkBook): IParsedXls => {
  const res: IParsedXls = {
    floors: [],
    registers: [],
    steps: []
  };

  const floorRows = getDataRows(xlsFile.Sheets[SheetNames.floors], 1, 2);

  for (const floorRow of floorRows) {
    if (!floorRow[1] && !floorRow[2]) {
      continue;
    }
    const blockName = floorRow[1] || "";
    const floorName = floorRow[2] || "";
    const floorID = Number(floorRow[0]) || 0;

    res.floors.push({
      guid: uuid.v4(),
      name: [blockName, floorName].join(". ").trim(),
      floorID
    });
  }

  const registerRows = getDataRows(xlsFile.Sheets[SheetNames.registers], 1, 2);

  for (const registerRow of registerRows) {
    if (!registerRow[1] && !registerRow[2]) {
      continue;
    }
    const resourceName = registerRow[1] || "";
    const registerName = registerRow[2] || "";
    const registerID = Number(registerRow[0].trim()) || 0;

    res.registers.push({
      guid: uuid.v4(),
      name: registerName.trim(),
      resourceName: resourceName.trim(),
      registerID
    });
  }

  const planDataRows = getDataRows(xlsFile.Sheets[SheetNames.plan], 2, 30);

  let n = 0;
  // TODO: переделать на splice
  while (n < planDataRows.length) {
    const rows = planDataRows.slice(n, n + 2);
    const stepMeta = getStepMeta(rows);
    n += 2;

    const step: IParsedStep = {
      name: stepMeta.stepName,
      comment: stepMeta.comment,
      startDate: new Date(stepMeta.startDate),
      finishDate: new Date(stepMeta.finishDate),
      smetaName: stepMeta.smetaName,
      components: []
    };

    while (planDataRows[n] && !planDataRows[n][1]) {
      const componentRows = planDataRows.slice(n, n + 2);
      // console.log({ componentRows });

      const componentMeta = getComponentMeta(componentRows);
      if (
        componentMeta.jobName &&
        componentMeta.registerName &&
        componentMeta.name
      ) {
        step.components.push({
          registerName: componentMeta.registerName,
          jobName: componentMeta.jobName,
          floors: componentMeta.floors,
          componentName: componentMeta.name,
          componentID: componentMeta.componentID
        });
      }
      n += 2;
    }

    res.steps.push(step);
  }

  return res;
};

function getStepMeta(
  rows: any[]
): {
  stepName: string;
  startDate: string;
  finishDate: string;
  comment: string;
  smetaName: string;
} {
  return {
    stepName: rows[0][1],
    startDate: rows[0][2],
    finishDate: rows[1][2],
    smetaName: rows[1][3],
    comment: rows[0][4]
  };
}

interface IComponentMeta {
  name: string;
  componentID: number;
  jobName: string;
  registerName: string;
  comment: string;
  floors: Array<{
    name: string;
    value: number;
    // guid: string;
  }>;
}

function getComponentMeta(rows: any[]): IComponentMeta {
  // console.log({ rowsInJobMeta: rows });
  if (!rows[1]) {
    rows[1] = [];
  }
  const ret: IComponentMeta = {
    name: rows[0][3],
    comment: rows[0][4],
    registerName: rows[0][5],
    componentID: rows[0][0],
    jobName: rows[1][5],
    floors: []
  };

  for (let n = 9; n < 30; n++) {
    const floorName = rows[0][n];
    const floorValue = rows[1][n];
    if (floorName) {
      ret.floors.push({
        name: floorName.trim(),
        value: +floorValue
        // guid: uuid.v4()
      });
    }
  }

  return ret;
}

function getDataRows(
  sheet: xlsx.WorkSheet,
  startRow: number,
  width: number = 0
): any[][] {
  const ret: any[][] = [];
  let rowNum = startRow + 1;

  let row = getRow(sheet, rowNum, width);
  while (!row.isLast) {
    ret.push(row.data);
    rowNum++;
    row = getRow(sheet, rowNum, width);
    row.data.push(row.isLast);
  }

  return ret;
}

function getRow(
  sheet: xlsx.WorkSheet,
  rowNum: number,
  width: number = 0
): { data: any[]; isLast: boolean } {
  const ret: any[] = [];
  let x: number = 0;
  let isLast = true;
  for (const letter of alphabet) {
    const cell = sheet[letter + rowNum];
    if (width || cell) {
      if (cell) {
        isLast = false;
      }
      ret.push(cell ? cell.v : null);
    }

    if (width && x++ > width) {
      break;
    }
  }

  return {
    data: ret,
    isLast
  };
}

enum SheetNames {
  floors = "Схема помещений объекта",
  registers = "Конструктивы объекта",
  plan = "План работ"
}

interface IParsedStep {
  name: string;
  comment: string;
  smetaName: string;
  startDate: Date;
  finishDate: Date;
  components: Array<{
    componentName: string;
    registerName: string;
    componentID: number;
    jobName: string;
    floors: Array<{
      name: string;
      value: number;
      // guid: string;
    }>;
  }>;
}

interface IParsedXls {
  floors: Array<{
    guid: string;
    name: string;
    floorID: number;
  }>;
  registers: Array<{
    guid: string;
    name: string;
    resourceName: string;
    registerID: number;
  }>;
  steps: IParsedStep[];
}

interface IJobsDicts {
  [guid: string]: string;
}
