import React, { useCallback, useEffect } from "react";
import { Button, InputNumber, Card, Input, Radio, Modal } from "antd";
import * as lodash from "lodash";

import QrCode from "./QrCode";
// import JsBarcode from './JsBarcode'
import styles from "./index.module.css";

import { CloseOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import LazyLoad from "react-lazy-load";

import { Scrollbars } from "react-custom-scrollbars";

const INITIAL_PRINT_URL = "http://127.0.0.1";
// const INITIAL_PRINT_URL = "http://192.168.1.52"
const INITIAL_PRINT_PORT = "8078";
const SUB_URL = "/api/printText";

const TagTemplates = {
  1: {
    getJson: (printPpi) => ({
      speed: 2,
      darkness: 20,
      width: 720 * printPpi,
      height: 240 * printPpi,
      gapH: 24 * printPpi,
      gapOffset: 0,
      xOffset: 12 * printPpi,
      yOffset: 0,
      cpnumber: 1,
      lables: [
        {
          textTureTypeWs: [
            {
              x: 36 * printPpi,
              y: 24 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A1",
              data: "资产编号:",
            },
            {
              x: 192 * printPpi,
              y: 24 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A2",
              data: "PECI2457（测试）",
            },
            {
              x: 36 * printPpi,
              y: 66 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A3",
              data: "资产名称:",
            },
            {
              x: 192 * printPpi,
              y: 66 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A4",
              data: "台式电脑-主机（测试）",
            },
            {
              x: 36 * printPpi,
              y: 108 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A5",
              data: "使用部门：",
            },
            {
              x: 192 * printPpi,
              y: 108 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A6",
              data: "适配部（测试）",
            },
            {
              x: 36 * printPpi,
              y: 152 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A7",
              data: "型号规格:",
            },
            {
              x: 192 * printPpi,
              y: 152 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A8",
              data: "同方-超越E500-11130（测试）",
            },
            {
              x: 36 * printPpi,
              y: 191 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A9",
              data: "领用日期:",
            },
            {
              x: 192 * printPpi,
              y: 191 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A10",
              data: "2020.10.23（测试）",
            },
            {
              x: 408 * printPpi,
              y: 191 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A11",
              data: "使用人:",
            },
            {
              x: 528 * printPpi,
              y: 191 * printPpi,
              FHeight: 32 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A12",
              data: "李宁（测试）",
            },
          ],
          qrs: [
            {
              x: 546 * printPpi,
              y: 20 * printPpi,
              w: 0,
              v: 120 * printPpi,
              o: 0,
              r: 6 * printPpi,
              m: 0,
              g: 0,
              s: 0,
              pstr: "http://www.supoin.com/（测试）",
            },
          ],
        },
      ],
    }),
    getDataWithFilled(selectedRows, printCount, printPpi) {
      const print_json = this.getJson(printPpi);
      let print_json_copy = lodash.cloneDeep(print_json);
      print_json_copy.cpnumber = printCount;
      print_json_copy.lables = [];
      selectedRows.forEach((_) => {
        let label_copy = lodash.cloneDeep(print_json.lables[0]);

        label_copy.qrs[0].pstr = _.assetId;
        if (label_copy.rfidLable) {
          label_copy.rfidLable.pstr = _.epc;
        }

        const barndAndModel =
          (_.brand ? _.brand : "") +
          (_.brand && _.model ? "-" : "") +
          (_.model ? _.model : "");
        label_copy.textTureTypeWs[1] &&
          (label_copy.textTureTypeWs[1].data = _.assetId);
        label_copy.textTureTypeWs[3] &&
          (label_copy.textTureTypeWs[3].data = _.assetName ? _.assetName : "");
        label_copy.textTureTypeWs[5] &&
          (label_copy.textTureTypeWs[5].data = _.useOrgName
            ? _.useOrgName
            : "");
        label_copy.textTureTypeWs[7] &&
          (label_copy.textTureTypeWs[7].data = barndAndModel
            ? barndAndModel.slice(0, 49)
            : "");
        label_copy.textTureTypeWs[9] &&
          (label_copy.textTureTypeWs[9].data = _.useDate
            ? _.useDate
            : dayjs().format("YYYY-MM-DD"));
        label_copy.textTureTypeWs[11] &&
          (label_copy.textTureTypeWs[11].data = _.useEmployeeName
            ? _.useEmployeeName
            : "");
        label_copy.textTureTypeWs[13] &&
          (label_copy.textTureTypeWs[13].data = _.placeName ? _.placeName : "");
        print_json_copy.lables.push(label_copy);
      });
      return print_json_copy;
    },
  },
  2: {
    getJson: (printPpi) => ({
      speed: 2,
      darkness: 20,
      width: 600 * printPpi,
      height: 600 * printPpi,
      gapH: 108 * printPpi,
      gapOffset: 0,
      xOffset: 84 * printPpi,
      yOffset: 12 * printPpi,
      cpnumber: 1,
      lables: [
        {
          textTureTypeWs: [
            {
              x: 24 * printPpi,
              y: 36 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A1",
              data: "资产编号:",
            },
            {
              x: 180 * printPpi,
              y: 36 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A2",
              data: "PEMI1570（测试）",
            },
            {
              x: 24 * printPpi,
              y: 72 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A3",
              data: "资产名称:",
            },
            {
              x: 180 * printPpi,
              y: 72 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A4",
              data: "显示器（测试）",
            },
            {
              x: 24 * printPpi,
              y: 108 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A5",
              data: "使用部门:",
            },
            {
              x: 180 * printPpi,
              y: 108 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A6",
              data: "研发部（测试）",
            },
            {
              x: 24 * printPpi,
              y: 144 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A7",
              data: "型号规格:",
            },
            {
              x: 180 * printPpi,
              y: 144 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A8",
              data: "优派-VA2431-H-2（测试）",
            },
            {
              x: 24 * printPpi,
              y: 180 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A9",
              data: "领用日期:",
            },
            {
              x: 180 * printPpi,
              y: 180 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A10",
              data: "2020.10.23（测试）",
            },
            {
              x: 24 * printPpi,
              y: 216 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A11",
              data: "使用人:",
            },
            {
              x: 180 * printPpi,
              y: 216 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A12",
              data: "豆彩霞（测试）",
            },
            {
              x: 24 * printPpi,
              y: 252 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A13",
              data: "使用场所:",
            },
            {
              x: 180 * printPpi,
              y: 252 * printPpi,
              FHeight: 34 * printPpi,
              FWidth: 0,
              FType: "黑体",
              Fspin: 1,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A14",
              data: "统信20楼（测试）",
            },
          ],
          qrs: [
            {
              x: 168 * printPpi,
              y: 300 * printPpi,
              w: 264 * printPpi,
              v: 264 * printPpi,
              o: 0,
              r: 12 * printPpi,
              m: 2,
              g: 0,
              s: 0,
              pstr: "PEMI1570（测试）",
            },
          ],
          rfidLable: {
            nRWMode: 0,
            nWForm: 0,
            nStartBlock: 0,
            nWDataNum: 0,
            nWArea: 0,
            pstr: "20FC00010002000300040004（测试）",
          },
        },
      ],
    }),
    getDataWithFilled(selectedRows, printCount, printPpi) {
      const print_json = this.getJson(printPpi);
      let print_json_copy = lodash.cloneDeep(print_json);
      print_json_copy.cpnumber = printCount;
      print_json_copy.lables = [];
      selectedRows.forEach((_) => {
        let label_copy = lodash.cloneDeep(print_json.lables[0]);

        label_copy.qrs[0].pstr = _.assetId;
        if (label_copy.rfidLable) {
          label_copy.rfidLable.pstr = _.epc;
        }

        const barndAndModel =
          (_.brand ? _.brand : "") +
          (_.brand && _.model ? "-" : "") +
          (_.model ? _.model : "");
        label_copy.textTureTypeWs[1] &&
          (label_copy.textTureTypeWs[1].data = _.assetId);
        label_copy.textTureTypeWs[3] &&
          (label_copy.textTureTypeWs[3].data = _.assetName ? _.assetName : "");
        label_copy.textTureTypeWs[5] &&
          (label_copy.textTureTypeWs[5].data = _.useOrgName
            ? _.useOrgName
            : "");
        label_copy.textTureTypeWs[7] &&
          (label_copy.textTureTypeWs[7].data = barndAndModel
            ? barndAndModel.slice(0, 49)
            : "");
        label_copy.textTureTypeWs[9] &&
          (label_copy.textTureTypeWs[9].data = _.useDate
            ? _.useDate
            : dayjs().format("YYYY-MM-DD"));
        label_copy.textTureTypeWs[11] &&
          (label_copy.textTureTypeWs[11].data = _.useEmployeeName
            ? _.useEmployeeName
            : "");
        label_copy.textTureTypeWs[13] &&
          (label_copy.textTureTypeWs[13].data = _.placeName ? _.placeName : "");
        print_json_copy.lables.push(label_copy);
      });
      return print_json_copy;
    },
  },
  3: {
    getJson: () => ({
      speed: 2,
      darkness: 20,
      width: 320,
      height: 520,
      gapH: 16,
      gapOffset: 0,
      xOffset: 8,
      yOffset: 0,
      cpnumber: 1,
      lables: [
        {
          rectangles: [
            {
              px: 8,
              py: 8,
              thickness: 4,
              pEx: 272,
              pEy: 504,
            },
          ],
          lines: [
            {
              px: 80,
              py: 8,
              pLength: 2,
              pH: 328,
            },
            {
              px: 144,
              py: 8,
              pLength: 2,
              pH: 496,
            },
            {
              px: 208,
              py: 8,
              pLength: 2,
              pH: 496,
            },
            {
              px: 8,
              py: 128,
              pLength: 256,
              pH: 2,
            },
            {
              px: 8,
              py: 336,
              pLength: 136,
              pH: 2,
            },
          ],
          textTureTypeWs: [
            {
              x: 304,
              y: 16,
              FHeight: 36,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A1",
              data: "福田区城市管理和综合执法局",
            },
            {
              x: 248,
              y: 16,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A2",
              data: "资产名称",
            },
            {
              x: 248,
              y: 136,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A3",
              data: "办公椅办公椅办公椅办公椅办公椅办公椅办公椅",
            },
            {
              x: 184,
              y: 16,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A4",
              data: "使用部门",
            },
            {
              x: 184,
              y: 136,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A5",
              data: "办公室",
            },
            {
              x: 120,
              y: 16,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A6",
              data: "规格型号",
            },
            {
              x: 120,
              y: 136,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A7",
              data: "90*40*198CM",
            },
            {
              x: 56,
              y: 16,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A8",
              data: "取得日期",
            },
            {
              x: 56,
              y: 136,
              FHeight: 24,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A9",
              data: "2020-12-14",
            },
            {
              x: 33.6,
              y: 368,
              FHeight: 16,
              FWidth: 0,
              FType: "黑体",
              Fspin: 2,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              id_name: "A10",
              data: "14238333900",
            },
          ],
          qrs: [
            {
              x: 32,
              y: 368,
              w: 0,
              v: 32,
              o: 2,
              r: 5,
              m: 0,
              g: 0,
              s: 0,
              pstr: "6910001022001",
            },
          ],
        },
      ],
    }),
    getDataWithFilled(selectedRows, printCount, printPpi) {
      const print_json = this.getJson(printPpi);
      let print_json_copy = lodash.cloneDeep(print_json);
      print_json_copy.cpnumber = printCount;
      print_json_copy.lables = [];
      selectedRows.forEach((_) => {
        let label_copy = lodash.cloneDeep(print_json.lables[0]);
        const modelAndSpec =
          (_.model ? _.model : "") +
          (_.model && _.spec ? "-" : "") +
          (_.spec ? _.spec : "");

        label_copy.qrs[0].pstr = _.assetId ? _.assetId : "";

        label_copy.textTureTypeWs[2] &&
          (label_copy.textTureTypeWs[2].data = _.assetName ? _.assetName : "");
        label_copy.textTureTypeWs[4] &&
          (label_copy.textTureTypeWs[4].data = _.useOrgName
            ? _.useOrgName
            : "");
        label_copy.textTureTypeWs[6] &&
          (label_copy.textTureTypeWs[6].data = modelAndSpec);
        label_copy.textTureTypeWs[8] &&
          (label_copy.textTureTypeWs[8].data = _.purchaseDate
            ? dayjs(_.purchaseDate).format("YYYY-MM-DD")
            : "");
        label_copy.textTureTypeWs[9] &&
          (label_copy.textTureTypeWs[9].data = _.assetId);

        print_json_copy.lables.push(label_copy);
      });
      return print_json_copy;
    },
  },
  4: {
    getJson: () =>
      //   {
      //   speed: 2,
      //   darkness: 20,
      //   width: 480,
      //   height: 160,
      //   gapH: 16,
      //   gapOffset: 0,
      //   xOffset: 0,
      //   yOffset: 0,
      //   cpnumber: 1,
      //   direction: "B",
      //   lables: [
      //     {
      //       textTureTypeWs: [
      //         {
      //           x: 28,
      //           y: 16,
      //           FHeight: 24,
      //           FWidth: 0,
      //           FType: "黑体",
      //           Fspin: 1,
      //           FWeight: 800,
      //           FItalic: false,
      //           FUnline: false,
      //           FStrikeOut: false,
      //           id_name: "A1",
      //           data: "编号:",
      //         },
      //         {
      //           x: 28,
      //           y: 64,
      //           FHeight: 24,
      //           FWidth: 0,
      //           FType: "黑体",
      //           Fspin: 1,
      //           FWeight: 800,
      //           FItalic: false,
      //           FUnline: false,
      //           FStrikeOut: false,
      //           id_name: "A2",
      //           data: "名称:",
      //         },
      //         {
      //           x: 28,
      //           y: 112,
      //           FHeight: 24,
      //           FWidth: 0,
      //           FType: "黑体",
      //           Fspin: 1,
      //           FWeight: 800,
      //           FItalic: false,
      //           FUnline: false,
      //           FStrikeOut: false,
      //           id_name: "A3",
      //           data: "部门:",
      //         },
      //         {
      //           x: 140,
      //           y: 16,
      //           FHeight: 24,
      //           FWidth: 0,
      //           FType: "黑体",
      //           Fspin: 1,
      //           FWeight: 800,
      //           FItalic: false,
      //           FUnline: false,
      //           FStrikeOut: false,
      //           id_name: "A4",
      //           data: "5645645654",
      //         },
      //         {
      //           x: 140,
      //           y: 64,
      //           FHeight: 24,
      //           FWidth: 0,
      //           FType: "黑体",
      //           Fspin: 1,
      //           FWeight: 800,
      //           FItalic: false,
      //           FUnline: false,
      //           FStrikeOut: false,
      //           id_name: "A12",
      //           data: "电脑",
      //         },
      //         {
      //           x: 140,
      //           y: 112,
      //           FHeight: 24,
      //           FWidth: 0,
      //           FType: "黑体",
      //           Fspin: 1,
      //           FWeight: 800,
      //           FItalic: false,
      //           FUnline: false,
      //           FStrikeOut: false,
      //           id_name: "A13",
      //           data: "后勤保障中心",
      //         },
      //       ],
      //       qrs: [
      //         {
      //           x: 336,
      //           y: 16,
      //           w: 120,
      //           v: 120,
      //           o: 1,
      //           r: 6,
      //           m: 0,
      //           g: 0,
      //           s: 0,
      //           pstr: "5645645654",
      //         },
      //       ],
      //     },
      //   ],
      // }
      ({
        speed: 2,
        darkness: 20,
        width: 480,
        height: 160,
        gapH: 16,
        gapOffset: 0,
        xOffset: 0,
        yOffset: 0,
        cpnumber: 1,
        direction: "B",
        lables: [
          {
            textTureTypeWs: [
              {
                x: 28,
                y: 16,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A1",
                data: "编号:",
              },
              {
                x: 28,
                y: 48,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A2",
                data: "名称:",
              },
              {
                x: 28,
                y: 86,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A3",
                data: "部门:",
              },
              {
                x: 28,
                y: 124,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A3",
                data: "辅助编码:",
              },
              {
                x: 100,
                y: 16,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A4",
                data: "5645645654",
              },
              {
                x: 100,
                y: 48,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A12",
                data: "电脑",
              },
              {
                x: 100,
                y: 86,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A13",
                data: "后勤保障中心",
              },
              {
                x: 140,
                y: 124,
                FHeight: 24,
                FWidth: 0,
                FType: "黑体",
                Fspin: 1,
                FWeight: 800,
                FItalic: false,
                FUnline: false,
                FStrikeOut: false,
                id_name: "A13",
                data: "后勤保障中心",
              },
            ],
            qrs: [
              {
                x: 350,
                y: 32,
                w: 120,
                v: 120,
                o: 1,
                r: 5,
                m: 0,
                g: 0,
                s: 0,
                pstr: "5645645654",
              },
            ],
          },
        ],
      }),
    getDataWithFilled(selectedRows, printCount, printPpi) {
      const print_json = this.getJson(printPpi);
      let print_json_copy = lodash.cloneDeep(print_json);
      print_json_copy.cpnumber = printCount;
      print_json_copy.lables = [];
      selectedRows.forEach((_) => {
        let label_copy = lodash.cloneDeep(print_json.lables[0]);

        label_copy.qrs[0].pstr = _.assetId;
        if (label_copy.rfidLable) {
          label_copy.rfidLable.pstr = _.epc;
        }

        label_copy.textTureTypeWs[4] &&
          (label_copy.textTureTypeWs[4].data = _.assetId);
        label_copy.textTureTypeWs[5] &&
          (label_copy.textTureTypeWs[5].data = _.assetName ? _.assetName : "");
        label_copy.textTureTypeWs[6] &&
          (label_copy.textTureTypeWs[6].data = _.useOrgName
            ? _.useOrgName
            : "");
        label_copy.textTureTypeWs[7] &&
          (label_copy.textTureTypeWs[7].data = _.barcode ? _.barcode : "");
        print_json_copy.lables.push(label_copy);
      });
      return print_json_copy;
    },
  },
  5: {
    getJson: (printDpi) => ({
      gapH: 16 * printDpi,
      width: 767 * printDpi,
      height: 413 * printDpi,
      direction: "B",
      speed: 2,
      cpnumber: 1,
      darkness: 20,
      gapOffset: 0,
      xOffset: 30 * printDpi,
      yOffset: 0,
      lables: [
        {
          textTureTypeWs: [
            {
              x: 30 * printDpi,
              y: 20 * printDpi,
              data: "固定资产卡片",
              id_name: "A1",
              FHeight: 60 * printDpi,
              FWidth: 0,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 30 * printDpi,
              y: 143 * printDpi,
              data: "资产编号:",
              id_name: "A3",
              FHeight: 37 * printDpi,
              FWidth: 0,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 30 * printDpi,
              y: 201 * printDpi,
              data: "资产名称:",
              id_name: "A4",
              FHeight: 36 * printDpi,
              FWidth: 0,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 30 * printDpi,
              y: 256 * printDpi,
              data: "规格型号:",
              id_name: "A5",
              FHeight: 35 * printDpi,
              FWidth: 0,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 30 * printDpi,
              y: 307 * printDpi,
              data: "所属部门:",
              id_name: "A6",
              FHeight: 34 * printDpi,
              FWidth: 0,
              FWeight: 800,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 215 * printDpi,
              y: 144 * printDpi,
              data: "11415257496",
              id_name: "A7",
              FHeight: 40 * printDpi,
              FWidth: 0,
              FWeight: 400,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 215 * printDpi,
              y: 201 * printDpi,
              data: "120L可回收桶",
              id_name: "A8",
              FHeight: 38 * printDpi,
              FWidth: 0,
              FWeight: 400,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 215 * printDpi,
              y: 255 * printDpi,
              data: "A9测试",
              id_name: "A9",
              FHeight: 37 * printDpi,
              FWidth: 0,
              FWeight: 400,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
            {
              x: 215 * printDpi,
              y: 304 * printDpi,
              data: "福田区城市管理和综合执法局",
              id_name: "A10",
              FHeight: 37 * printDpi,
              FWidth: 0,
              FWeight: 400,
              FItalic: false,
              FUnline: false,
              FStrikeOut: false,
              Fspin: 1,
              FType: "黑体",
            },
          ],
          barCodes: [],
          qrs: [
            {
              x: 580 * printDpi,
              y: 40 * printDpi,
              w: 100,
              v: 100,
              o: 0,
              r: 7 * printDpi,
              m: 0,
              g: 0,
              s: 0,
              pstr: "http://www.supoin.com/",
            },
          ],
          lines: [],
          rectangles: [],
          rfidLable: {
            nRWMode: 0,
            nWForm: 0,
            nStartBlock: 0,
            nWDataNum: 0,
            nWArea: 0,
            pstr: "20FC00010002000300040004",
          },
        },
      ],
    }),
    getDataWithFilled(selectedRows, printCount, printPpi) {
      const print_json = this.getJson(printPpi);
      let print_json_copy = lodash.cloneDeep(print_json);
      print_json_copy.cpnumber = printCount;
      print_json_copy.lables = [];

      selectedRows.forEach((_) => {
        let label_copy = lodash.cloneDeep(print_json.lables[0]);

        label_copy.qrs[0].pstr = _.epc;

        label_copy.rfidLable.pstr = _.epc;

        const specAndModel = (_.spec ? _.spec : "") + (_.model ? _.model : "");
        label_copy.textTureTypeWs[5] &&
          (label_copy.textTureTypeWs[5].data = _.assetId);
        label_copy.textTureTypeWs[6] &&
          (label_copy.textTureTypeWs[6].data = _.assetName ? _.assetName : "");
        label_copy.textTureTypeWs[7] &&
          (label_copy.textTureTypeWs[7].data = specAndModel
            ? specAndModel.slice(0, 49)
            : "");
        label_copy.textTureTypeWs[8] &&
          (label_copy.textTureTypeWs[8].data = _.ownOrgName
            ? _.ownOrgName
            : "");
        print_json_copy.lables.push(label_copy);
      });
      return print_json_copy;
    },
  },
};

export default React.memo(({ open, closeDialog, selectedRows }) => {
  const [confirmBtnLoading, setConfirmBtnLoading] = React.useState(false);
  const [printPpi, setPrintPpi] = React.useState(1);
  const [printCount, setPrintCount] = React.useState(1);
  const [printUrl, setPrintUrl] = React.useState(INITIAL_PRINT_URL);
  const [printPort, setPrintPort] = React.useState(INITIAL_PRINT_PORT);
  const [printTemplate, setPrintTemplate] = React.useState(1);

  const onChange = (value) => {
    setPrintCount(value);
  };

  const onPrintPpiChange = (e) => {
    setPrintPpi(e.target.value);
  };

  const handleConfirm = () => {
    const tagConfig = {
      printPpi,
      printCount,
      printUrl,
      printPort,
      printTemplate,
    };
    asyncLastConfig({ type: "set", data: tagConfig });
    const print_json_copy = TagTemplates[printTemplate].getDataWithFilled(
      selectedRows,
      printCount,
      printPpi
    );
    // console.log(print_json_copy);
    // return;
    setConfirmBtnLoading(true);
    const p = printUrl + ":" + printPort + SUB_URL;
    fetch(p, {
      method: "POST",
      body: JSON.stringify(print_json_copy),
    })
      .then((response) => response.json())
      .then((response) => {
        global.$showMessage({
          message: "提交打印请求成功",
          type: "success",
        });
        setConfirmBtnLoading(false);
        closeDialog();
      })
      .catch((error) => {
        global.$showMessage({
          message: "提交打印请求失败，未检测到打印机服务",
          type: "error",
          autoHideDuration: 5000,
        });
        setConfirmBtnLoading(false);
      });
  };

  // const handleTestPrint = () => {
  //   const print_json = getJson(printTemplate, printPpi)
  //   let print_json_copy = lodash.cloneDeep(print_json)
  //   const p = printUrl + ':' + printPort + SUB_URL
  //   fetch(p, {
  //     method: 'POST',
  //     body: JSON.stringify(print_json_copy),
  //   }).then(response => response.json()
  //   )
  //     .then(response => {
  //       global.$showMessage({
  //         message: '提交测试打印请求成功',
  //         type: "success",
  //       })
  //       setConfirmBtnLoading(false)
  //       closeDialog()
  //     })
  //     .catch(error => {
  //       global.$showMessage({
  //         message: '测试提交打印请求失败，未检测到打印机服务',
  //         type: "error",
  //         autoHideDuration: 5000,
  //       })
  //       setConfirmBtnLoading(false)
  //     });
  // }

  const onPrintTemplateChange = (e) => {
    setPrintTemplate(e.target.value);
  };

  const asyncLastConfig = useCallback(({ type, data = null }) => {
    const localStorage = window.localStorage;
    if (type === "get") {
      const tagPrintConfig = JSON.parse(
        localStorage.getItem("APP_CONFIG")
      )?.TagPrint;
      if (tagPrintConfig) {
        const { printPpi, printCount, printUrl, printPort, printTemplate } =
          tagPrintConfig;
        setPrintPpi(printPpi);
        setPrintCount(printCount);
        setPrintUrl(printUrl);
        setPrintPort(printPort);
        setPrintTemplate(printTemplate);
      }
    } else if (type === "set") {
      let appConfig = JSON.parse(localStorage.getItem("APP_CONFIG"));
      if (appConfig) {
        appConfig.TagPrint = data;
        localStorage.setItem("APP_CONFIG", JSON.stringify(appConfig));
      } else {
        const appConfig = {
          TagPrint: data,
        };
        localStorage.setItem("APP_CONFIG", JSON.stringify(appConfig));
      }
    }
  }, []);

  useEffect(() => {
    const action = {
      type: "get",
    };
    asyncLastConfig(action);
  }, [asyncLastConfig]);

  return (
    <Modal
      width={"948px"}
      destroyOnClose
      footer={[
        //   <Button key="1" onClick={handleTestPrint}>
        //     测试打印
        // </Button>,
        <Button
          key="2"
          loading={confirmBtnLoading}
          type="primary"
          onClick={handleConfirm}
        >
          确定打印
        </Button>,
        <Button key="3" onClick={() => closeDialog()}>
          关闭
        </Button>,
      ]}
      closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
      title={
        <span
          style={{
            fontSize: 16,
            color: "#fff",
          }}
        >
          {`标签打印（${selectedRows && selectedRows.length}）`}
        </span>
      }
      visible={open}
      onCancel={() => closeDialog()}
    >
      <Scrollbars style={{ height: "62vh" }}>
        <div
          style={{
            position: "sticky",
            top: "10%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginLeft: 300,
          }}
        >
          <div
            style={{
              marginBottom: 10,
              width: "50%",
            }}
          >
            <span
              style={{ display: "inline-block", width: 100, textAlign: "left" }}
            >
              打印模板：
            </span>
            <div
              style={{
                display: "inline-block",
              }}
            >
              <Radio.Group
                onChange={onPrintTemplateChange}
                value={printTemplate}
              >
                <Radio value={1}>模板一</Radio>
                <Radio value={2}>模板二</Radio>
                <Radio value={3}>模板三</Radio>
                <Radio value={4}>模板四</Radio>
                <Radio value={5}>模板五</Radio>
              </Radio.Group>
            </div>
          </div>
          <div
            style={{
              marginBottom: 10,
              width: "50%",
            }}
          >
            <span
              style={{ display: "inline-block", width: 100, textAlign: "left" }}
            >
              打印机参数：
            </span>
            <div
              style={{
                display: "inline-block",
              }}
            >
              <Radio.Group onChange={onPrintPpiChange} value={printPpi}>
                <Radio value={1}>300点</Radio>
                <Radio value={2}>600点</Radio>
                <Radio value={3}>203点</Radio>
              </Radio.Group>
            </div>
          </div>
          <div
            style={{
              marginBottom: 10,
              width: "50%",
            }}
          >
            <span
              style={{ display: "inline-block", width: 100, textAlign: "left" }}
            >
              份数：
            </span>
            <div
              style={{
                display: "inline-block",
              }}
            >
              <InputNumber
                style={{
                  width: 86,
                }}
                onChange={onChange}
                min={1}
                max={10}
                value={printCount}
              />
            </div>
          </div>
          <div
            style={{
              marginBottom: 10,
              width: "50%",
            }}
          >
            <span
              style={{ display: "inline-block", width: 100, textAlign: "left" }}
            >
              打印服务地址：
            </span>
            <Input
              value={printUrl}
              onChange={(e) => {
                setPrintUrl(e.target.value);
              }}
              style={{ width: 170 }}
            />
          </div>
          <div
            style={{
              marginBottom: 10,
              width: "50%",
            }}
          >
            <span
              style={{ display: "inline-block", width: 100, textAlign: "left" }}
            >
              服务端口：
            </span>
            <Input
              value={printPort}
              onChange={(e) => {
                setPrintPort(e.target.value);
              }}
              style={{ width: 170 }}
            />
          </div>
          <div
            style={{
              marginBottom: 10,
              marginTop: 50,
              width: "50%",
            }}
          >
            <code>
              {printUrl}:{printPort}
              {SUB_URL}
            </code>
          </div>
        </div>
        <div
          style={{
            marginTop: -240,
            minHeight: 400,
          }}
        >
          {selectedRows &&
            selectedRows.map((_) => {
              return (() => {
                if (printTemplate === 1) {
                  return (
                    <Card
                      key={_.assetId}
                      bodyStyle={{
                        padding: 10,
                      }}
                      style={{ width: 320, marginBottom: 10 }}
                    >
                      <LazyLoad>
                        <QrCode
                          style={{
                            float: "right",
                          }}
                          width={80}
                          height={80}
                          info={_.assetId}
                        />
                      </LazyLoad>
                      <div>资产编号：{_.assetId}</div>
                      <div>资产名称：{_.assetName}</div>
                      <div>使用部门：{_.useOrgName}</div>
                      <div>
                        型号规格：{_.model ? String(_.model).slice(0, 49) : ""}
                      </div>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          领用日期：
                          {_.useDate ? _.useDate : dayjs().format("YYYY-MM-DD")}
                        </div>
                        <div>使用人：{_.useEmployeeName}</div>
                      </div>
                    </Card>
                  );
                }
                if (printTemplate === 2) {
                  return (
                    <Card
                      key={_.assetId}
                      bodyStyle={{
                        padding: 10,
                      }}
                      style={{ width: 280, marginBottom: 10 }}
                    >
                      <div>资产编号：{_.assetId}</div>
                      <div>资产名称：{_.assetName}</div>
                      <div>使用部门：{_.useOrgName}</div>
                      <div>型号规格：{_.model}</div>
                      <div>
                        领用日期：
                        {_.useDate ? _.useDate : dayjs().format("YYYY-MM-DD")}
                      </div>
                      <div>使用人：{_.useEmployeeName}</div>
                      <div>使用场所：{_.placeName}</div>
                      <div
                        style={{
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <LazyLoad>
                          <QrCode width={150} height={150} info={_.assetId} />
                        </LazyLoad>
                      </div>
                    </Card>
                  );
                }
                if (printTemplate === 3) {
                  const modalAndSpec =
                    (_.model ? _.model : "") +
                    (_.model && _.spec ? "-" : "") +
                    (_.spec ? _.spec : "");
                  return (
                    <Card
                      key={_.assetId}
                      bodyStyle={{
                        padding: 10,
                      }}
                      style={{ width: 280, marginBottom: 10 }}
                    >
                      <div
                        style={{
                          fontSize: 19,
                        }}
                      >
                        福田区城市管理和综合执法局
                      </div>
                      <table border="1" width="260">
                        <tbody>
                          <tr className={styles.tr}>
                            <td className={styles.td} width="20%">
                              资产名称
                            </td>
                            <td className={styles.td} colSpan="2">
                              {_.assetName}
                            </td>
                          </tr>
                          <tr className={styles.tr}>
                            <td className={styles.td} width="20%">
                              使用部门
                            </td>
                            <td className={styles.td} colSpan="2">
                              {_.useOrgName}
                            </td>
                          </tr>
                          <tr className={styles.tr}>
                            <td className={styles.td} width="20%">
                              规格型号
                            </td>
                            <td className={styles.td} width="40%">
                              {modalAndSpec}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                              width="40%"
                              rowSpan="2"
                            >
                              <LazyLoad>
                                <QrCode
                                  width={100}
                                  height={100}
                                  info={_.assetId}
                                />
                              </LazyLoad>
                              {_.assetId}
                            </td>
                          </tr>
                          <tr className={styles.tr}>
                            <td className={styles.td} width="20%">
                              取得日期
                            </td>
                            <td className={styles.td} width="40%">
                              {_.purchaseDate}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Card>
                  );
                }
                if (printTemplate === 4) {
                  return (
                    <Card
                      key={_.assetId}
                      bodyStyle={{
                        padding: 10,
                      }}
                      style={{ width: 320, marginBottom: 10 }}
                    >
                      <LazyLoad>
                        <QrCode
                          style={{
                            float: "right",
                          }}
                          width={80}
                          height={80}
                          info={_.assetId}
                        />
                      </LazyLoad>
                      <div>编号：{_.assetId}</div>
                      <div>名称：{_.assetName}</div>
                      <div>部门：{_.useOrgName}</div>
                      <div>辅助编码：{_.barcode}</div>
                    </Card>
                  );
                }
                if (printTemplate === 5) {
                  const specAndModel =
                    (_.spec ? _.spec : "") + (_.model ? _.model : "");
                  return (
                    <Card
                      key={_.assetId}
                      bodyStyle={{
                        padding: 10,
                      }}
                      style={{ width: 320, marginBottom: 10 }}
                    >
                      <LazyLoad>
                        <QrCode
                          style={{
                            float: "right",
                          }}
                          width={80}
                          height={80}
                          info={_.epc}
                        />
                      </LazyLoad>
                      <div
                        style={{
                          maginTop: 20,
                          marginBottom: 15,
                          fontWeight: 900,
                          fontSize: 24,
                        }}
                      >
                        固定资产卡片
                      </div>
                      <div>资产编号：{_.assetId}</div>
                      <div>资产名称：{_.assetName}</div>
                      <div>
                        规格型号：
                        {specAndModel ? specAndModel.slice(0, 49) : ""}
                      </div>
                      <div>所属部门：{_.ownOrgName}</div>
                    </Card>
                  );
                }
              })();
            })}
        </div>
      </Scrollbars>
    </Modal>
  );
});
