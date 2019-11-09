import { dateFlds, CDNFileBaseURI, CDNContainerName } from "../constants";
import moment, { isDate } from "moment";
import { Instance, Model } from "sequelize";
import * as Sequelize from "sequelize";
import fs from "fs";
import { Op } from "sequelize";
import { Stream } from "stream";
import { server } from "../server";
import uuid = require("uuid");
import logger from "./logger";

interface ICreateOptions {
  upsert?: boolean;
  logging?: boolean;
}

const utils = {
  tree: <T extends object>(
    nullLevel: T[],
    allRows: T[],
    pkFld: string = "id",
    parentFld: string = "parentId",
    childrenFld: string = "children"
  ): T[] => {
    return nullLevel.map(row => {
      const obj = { ...(row as object) } as T;
      const children = utils.tree(
        allRows.filter(r => r[parentFld] === row[pkFld]),
        allRows,
        pkFld,
        parentFld,
        childrenFld
      );
      obj[childrenFld] = children;
      return obj;
    });
  },
  destructTree: <T extends object>(
    tree: T[],
    childrenFldName: string,
    resArray: T[]
  ) => {
    const notree: T[] = [];
    for (const row of tree) {
      if (row[childrenFldName] && row[childrenFldName].length) {
        const childrenRows = utils.destructTree(
          row[childrenFldName],
          childrenFldName,
          resArray
        );
        resArray.concat(childrenRows);
      }
      delete row[childrenFldName];
      notree.push(row);
      resArray.push(row);
    }
    return notree;
  },
  createRows: async <T extends object, R>(
    rows: T[],
    model: Sequelize.Model<Sequelize.Instance<R>, T>,
    options: ICreateOptions = {
      upsert: false,
      logging: false
    }
  ): Promise<Array<Sequelize.Instance<R> & R>> => {
    const result: Array<Sequelize.Instance<R> & R> = [];
    for (const row of rows) {
      if (options.upsert) {
        const res: [Sequelize.Instance<R> & R, boolean] = (await model.upsert(
          utils.prepareRow(row),
          {
            returning: true,
            logging: options.logging
          }
        )) as any;
        result.push(res[0]);
      } else {
        const res: Sequelize.Instance<R> & R = (await model.create(
          utils.prepareRow(row),
          { returning: true, logging: options.logging }
        )) as Sequelize.Instance<R> & R;
        result.push(res);
      }
    }
    return result;
  },
  updateRows: async <T extends object>(
    rows: T[],
    model: Sequelize.Model<Sequelize.Instance<T>, T>,
    whereFld: string = "GUID"
  ): Promise<Array<Sequelize.Instance<T>>> => {
    const newRows: Array<Sequelize.Instance<T>> = [];
    for (const row of rows) {
      const newRow = await model.update(row, {
        where: {
          [whereFld]: row[whereFld]
        },
        returning: true
      });
      if (newRow[0] > 0) {
        newRows.push(newRow[1][0]);
      }
    }
    return newRows;
  },
  deleteRows: async <T extends object>(
    GUIDs: string[],
    model: Sequelize.Model<Sequelize.Instance<T>, T>
  ): Promise<boolean> => {
    const res = await model.destroy({
      where: {
        GUID: {
          [Op.in]: GUIDs
        }
      },
      // @ts-ignore
      secDisable: true
    });

    return res === GUIDs.length;
  },
  cleanResponseUsingAttr: <T>(
    rows: Array<Sequelize.Instance<T>>,
    attributes: string[]
  ) => {
    return rows.map(r => {
      const row = r.toJSON();
      for (const key of Object.keys(row)) {
        if (!attributes.includes(key)) {
          delete row[key];
        }
      }
      return row;
    });
  },
  mapElementsToJSON: <T>(
    rows: Array<Sequelize.Instance<T>>,
    childrenFld = "children",
    resourceFld = "resources"
  ) => {
    return rows.map(r => {
      const row = r.toJSON();
      if (r[childrenFld]) {
        row[childrenFld] = utils.mapElementsToJSON(r[childrenFld]);
      }
      if (r[resourceFld]) {
        row[resourceFld] = utils.mapElementsToJSON(r[resourceFld]);
      }
      return row;
    });
  },
  prepareRow: <T extends object>(row: T, pkFld: string = "id") => {
    const r = { ...(row as object) } as T;
    if (r[pkFld] === null) {
      delete r[pkFld];
    }

    for (const key of Object.keys(r)) {
      // Преобразовываем дату в нужный вид
      if (r[key] !== null) {
        if (dateFlds.includes(key)) {
          r[key] = moment(r[key]).toISOString();
        } else if (
          typeof r[key] === "object" &&
          !Array.isArray(r[key]) &&
          !isDate(r[key])
        ) {
          r[key] = utils.prepareRow(r[key]);
        }
      }
    }

    return r;
  },
  getFilesFromPayload: (payload, keySubString: string): any[] => {
    return Object.keys(payload)
      .map(key => {
        if (key.includes(keySubString)) {
          return payload[key];
        }
      })
      .filter(r => r);
  },
  sendFileToCDN: async (stream): Promise<string> => {
    const client = server.createSwiftClient();
    logger.info("sending to cdn");
    // const container = server.SwiftClient.container(CDNContainerName);
    const container = client.container(CDNContainerName);
    logger.info("container created");
    const filename = `${uuid.v4()}.${utils.getExtension(stream.hapi.filename)}`;
    logger.info("filename ", filename);
    try {
      await container.create(filename, stream);
    } catch (err) {
      logger.error(err);
    }
    logger.info("file created");
    return `${CDNFileBaseURI}${filename}`;
  },
  sumFloat: (arg1: number, arg2: number): number => {
    const a = 100;
    return Math.round(arg1 * a + arg2 * a) / a;
  },
  createFolder: dirName => {
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
  },
  totalTrim: (row: string): string => {
    return row.replace(/\s+/g, " ").trim();
  },
  getExtension: (filename: string): RegExpExecArray => {
    const ext: any = /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : null;
    if (!ext) {
      ext[0] = [""];
      ext.index = null;
      ext.input = filename;
    }
    return ext;
  },
  mapToArray: map => {
    return Object.keys(map).map(rkey => {
      return map[rkey];
    });
  },
  gaussRound: (num: number, decimalPlaces: number = 0) => {
    const d = decimalPlaces,
      m = Math.pow(10, d),
      n = +(d ? num * m : num).toFixed(8),
      i = Math.floor(n),
      f = n - i,
      e = 1e-8,
      r = f > 0.5 - e && f < 0.5 + e ? (i % 2 == 0 ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
  }
};

export default utils;
