
export default function getJson(template, printPpi = 1) {
  switch (template) {
    case 1:
      return {
        "speed": 2,
        "darkness": 20,
        "width": 720 * printPpi,
        "height": 240 * printPpi,
        "gapH": 24 * printPpi,
        "gapOffset": 0,
        "xOffset": 12 * printPpi,
        "yOffset": 0,
        "cpnumber": 1,
        "lables": [
          {
            "textTureTypeWs": [
              {
                "x": 36 * printPpi,
                "y": 24 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A1",
                "data": "资产编号:"
              },
              {
                "x": 192 * printPpi,
                "y": 24 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A2",
                "data": "PECI2457（测试）"
              },
              {
                "x": 36 * printPpi,
                "y": 66 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A3",
                "data": "资产名称:"
              },
              {
                "x": 192 * printPpi,
                "y": 66 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A4",
                "data": "台式电脑-主机（测试）"
              },
              {
                "x": 36 * printPpi,
                "y": 108 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A5",
                "data": "使用部门："
              },
              {
                "x": 192 * printPpi,
                "y": 108 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A6",
                "data": "适配部（测试）"
              },
              {
                "x": 36 * printPpi,
                "y": 152 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A7",
                "data": "型号规格:"
              },
              {
                "x": 192 * printPpi,
                "y": 152 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A8",
                "data": "同方-超越E500-11130（测试）"
              },
              {
                "x": 36 * printPpi,
                "y": 191 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A9",
                "data": "领用日期:"
              },
              {
                "x": 192 * printPpi,
                "y": 191 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A10",
                "data": "2020.10.23（测试）"
              },
              {
                "x": 408 * printPpi,
                "y": 191 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A11",
                "data": "使用人:"
              },
              {
                "x": 528 * printPpi,
                "y": 191 * printPpi,
                "FHeight": 32 * printPpi,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A12",
                "data": "李宁（测试）"
              }
            ],
            "qrs": [
              {
                "x": 546 * printPpi,
                "y": 20 * printPpi,
                "w": 0,
                "v": 120 * printPpi,
                "o": 0,
                "r": 6 * printPpi,
                "m": 0,
                "g": 0,
                "s": 0,
                "pstr": "http://www.supoin.com/（测试）"
              }
            ]

          }
        ]
      }
    case 2:
      return {
        "speed": 2,
        "darkness": 20,
        "width": 600 * printPpi,
        "height": 600 * printPpi,
        "gapH": 108 * printPpi,
        "gapOffset": 0,
        "xOffset": 84 * printPpi,
        "yOffset": 12 * printPpi,
        "cpnumber": 1,
        "lables": [
          {
            "textTureTypeWs": [
              {
                "x": 24 * printPpi,
                "y": 36 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A1",
                "data": "资产编号:"
              },
              {
                "x": 180 * printPpi,
                "y": 36 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A2",
                "data": "PEMI1570（测试）"
              },
              {
                "x": 24 * printPpi,
                "y": 72 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A3",
                "data": "资产名称:"
              },
              {
                "x": 180 * printPpi,
                "y": 72 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A4",
                "data": "显示器（测试）"
              },
              {
                "x": 24 * printPpi,
                "y": 108 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A5",
                "data": "使用部门:"
              },
              {
                "x": 180 * printPpi,
                "y": 108 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A6",
                "data": "研发部（测试）"
              },
              {
                "x": 24 * printPpi,
                "y": 144 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A7",
                "data": "型号规格:"
              },
              {
                "x": 180 * printPpi,
                "y": 144 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A8",
                "data": "优派-VA2431-H-2（测试）"
              },
              {
                "x": 24 * printPpi,
                "y": 180 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A9",
                "data": "领用日期:"
              },
              {
                "x": 180 * printPpi,
                "y": 180 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A10",
                "data": "2020.10.23（测试）"
              },
              {
                "x": 24 * printPpi,
                "y": 216 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A11",
                "data": "使用人:"
              },
              {
                "x": 180 * printPpi,
                "y": 216 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A12",
                "data": "豆彩霞（测试）"
              },
              {
                "x": 24 * printPpi,
                "y": 252 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A13",
                "data": "使用场所:"
              },
              {
                "x": 180 * printPpi,
                "y": 252 * printPpi,
                "FHeight": 34 * printPpi,
                "FWidth": 0,
                "FType": "新宋体",
                "Fspin": 1,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A14",
                "data": "统信20楼（测试）"
              }
            ],
            "qrs": [
              {
                "x": 168 * printPpi,
                "y": 300 * printPpi,
                "w": 264 * printPpi,
                "v": 264 * printPpi,
                "o": 0,
                "r": 12 * printPpi,
                "m": 2,
                "g": 0,
                "s": 0,
                "pstr": "PEMI1570（测试）"
              }
            ],
            "rfidLable": {
              "nRWMode": 0,
              "nWForm": 0,
              "nStartBlock": 0,
              "nWDataNum": 0,
              "nWArea": 0,
              "pstr": "20FC00010002000300040004（测试）"
            }
          }
        ]
      }
    case 3:
      return {
        "speed": 2,
        "darkness": 20,
        "width": 320,
        "height": 520,
        "gapH": 16,
        "gapOffset": 0,
        "xOffset": 16,
        "yOffset": 0,
        "cpnumber": 1,
        "lables": [
          {
            "rectangles": [
              {
                "px": 16,
                "py": 16,
                "thickness": 4,
                "pEx": 264,
                "pEy": 488
              }
            ],
            "barCodes": [
              {
                "px": 96,
                "py": 128,
                "pdirec": 1,
                "pCode": "E30",
                "pHorizontal": 3,
                "pVertical": 6,
                "pbright": 56,
                "ptext": "C",
                "pstr": "6910001022002"
              }
            ],
            "textTureTypeWs": [
              {
                "x": 304,
                "y": 16,
                "FHeight": 36,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A1",
                "data": "福田区城市管理和综合执法局"
              },
              {
                "x": 240,
                "y": 32,
                "FHeight": 28,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A2",
                "data": "资产名称:"
              },
              {
                "x": 240,
                "y": 160,
                "FHeight": 28,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A3",
                "data": "办公椅办公椅办公椅办公椅办公椅办公椅办公椅办公椅办公椅办公椅"
              },
              {
                "x": 208,
                "y": 160,
                "FHeight": 28,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A3-1",
                "data": "办公椅"
              },
              {
                "x": 176,
                "y": 32,
                "FHeight": 28,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A4",
                "data": "规格型号:"
              },
              {
                "x": 176,
                "y": 160,
                "FHeight": 28,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A5",
                "data": "null"
              },
              {
                "x": 144,
                "y": 32,
                "FHeight": 28,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A6",
                "data": "取得日期:"
              },
              {
                "x": 144,
                "y": 160,
                "FHeight": 28,
                "FWidth": 0,
                "FType": "宋体",
                "Fspin": 2,
                "FWeight": 800,
                "FItalic": false,
                "FUnline": false,
                "FStrikeOut": false,
                "id_name": "A7",
                "data": "2020-12-14"
              }
            ]
          }
        ]
      }
    default:
      return;
  }
}