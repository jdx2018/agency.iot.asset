import React, { useState } from "react";
import dayjs from "dayjs";
import { Dropdown, Button, Menu } from "antd";
import {
  ExportOutlined,
  DownOutlined,
  DownloadOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  SelectOutlined,
} from "@ant-design/icons";

import UploadDialog from "./UploadDialog";

import { useSelector, useDispatch } from "react-redux";
import { brandList, fetchBrandList } from "store/slices/brand";
import { classList, fetchClassList } from "store/slices/class";
import { employeeList, fetchEmployeeList } from "store/slices/employee";
import { orgList, fetchOrgList } from "store/slices/org";
import { placeList, fetchPlaceList } from "store/slices/place";
import { exportExcelWithManySheet } from "utils/common";
import clientService from "api/clientService";

const template = {
  import: [
    {
      key: "status",
      desc: "资产状态",
      isTranslate: true,
    },
    {
      key: "assetId",
      desc: "资产编码",
      required: true,
      isTranslate: true,
    },
    {
      key: "epc",
      desc: "EPC",
    },
    {
      key: "assetName",
      desc: "资产名称",
    },
    {
      key: "classId",
      desc: "资产分类",
      isTranslate: true,
    },
    {
      key: "brand",
      desc: "品牌",
    },
    {
      key: "model",
      desc: "型号",
    },
    {
      key: "spec",
      desc: "规格",
    },
    {
      key: "invoiceType",
      desc: "发票类型",
    },
    {
      key: "documentNumber",
      desc: "凭证号",
    },
    {
      key: "documentDate",
      desc: "凭证日期",
    },
    {
      key: "initialValue",
      desc: "资产原值",
    },
    {
      key: "manager",
      desc: "管理员",
    },
    {
      key: "ownOrgId",
      desc: "所属部门",
      isTranslate: true,
    },
    {
      key: "useOrgId",
      desc: "使用部门",
      isTranslate: true,
    },
    {
      key: "useDate",
      desc: "借用/领用日期",
    },
    {
      key: "placeId",
      desc: "位置",
      isTranslate: true,
    },
    {
      key: "purchaseType",
      desc: "购置方式",
    },

    {
      key: "purchaseDate",
      desc: "购置日期",
    },
    {
      key: "barcode",
      desc: "资产条码(辅助编码)",
    },
    {
      key: "serviceLife",
      desc: "使用年限",
    },
    {
      key: "supplier",
      desc: "供应商",
    },
    {
      key: "purchasePerson",
      desc: "采购人",
    },
    {
      key: "amount",
      desc: "金额",
    },
    {
      key: "useEmployeeId",
      desc: "使用人",
      isTranslate: true,
    },
    {
      key: "wareHouse",
      desc: "库房",
    },
    {
      key: "sn",
      desc: "设备SN码",
    },
    {
      key: "useStatus",
      desc: "使用状态",
      isTranslate: true,
    },
    {
      key: "remarks",
      desc: "备注",
    },
  ],
  export: [
    {
      key: "status",
      desc: "资产状态",
    },
    {
      key: "assetId",
      desc: "资产编码",
    },
    {
      key: "epc",
      desc: "EPC",
    },
    {
      key: "assetName",
      desc: "资产名称",
    },
    {
      key: "className",
      desc: "资产分类",
    },

    {
      key: "brand",
      desc: "品牌",
      required: false,
    },
    {
      key: "model",
      desc: "型号",
    },
    {
      key: "spec",
      desc: "规格",
    },
    {
      key: "managerName",
      desc: "管理员",
    },
    {
      key: "ownOrgName",
      desc: "所属部门",
    },
    {
      key: "useOrgName",
      desc: "使用部门",
    },
    {
      key: "useDate",
      desc: "借用/领用日期",
    },
    {
      key: "placeName",
      desc: "位置",
    },
    {
      key: "documentNumber",
      desc: "凭证号",
    },
    {
      key: "documentDate",
      desc: "凭证日期",
    },
    {
      key: "purchaseType",
      desc: "购置方式",
    },

    {
      key: "purchaseDate",
      desc: "购置日期",
    },
    {
      key: "barcode",
      desc: "资产条码(辅助编码)",
    },
    {
      key: "initialValue",
      desc: "资产原值",
    },
    {
      key: "supplier",
      desc: "供应商",
    },
    {
      key: "purchasePerson",
      desc: "采购人",
    },
    {
      key: "amount",
      desc: "金额",
    },
    {
      key: "useEmployeeName",
      desc: "使用人",
    },
    {
      key: "wareHouse",
      desc: "库房",
    },
    {
      key: "sn",
      desc: "设备SN码",
    },
    {
      key: "useStatus",
      desc: "使用状态",
    },
    {
      key: "remarks",
      desc: "备注",
    },
  ],
};

export default React.memo(function ({ data, selectedRowKeys, originData, refreshData }) {
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
  const dispatch = useDispatch();
  const brand = useSelector(brandList);
  const class_ = useSelector(classList);
  const employee = useSelector(employeeList);
  const org = useSelector(orgList);
  const place = useSelector(placeList);

  const selectedData = React.useMemo(
    () => originData.filter((row) => selectedRowKeys.includes(row.assetId)),
    [originData, selectedRowKeys]
  );
  const handleMenuClick = async (target) => {
    switch (target.key) {
      case "1":
        // const templateSheet = {
        //   sheetName: '资产列表模板',
        //   data: [],
        //   template: template.import,
        //   hasPromptTitle: true,
        //   //titleMessage: ["这里有很多必填的数据", "这里有需要注意的数据"]
        // };
        // const brandSheets = {
        //   sheetName: '品牌',
        //   data: brand.map((_) => ({ 品牌名称: _.text, 品牌编号: _.value })),
        // };
        // const classSheets = {
        //   //sheetName: '资产分类',
        //   data: class_.map((_) => ({ 资产分类名称: _.className, 资产分类编号: _.classId })),
        // };
        // const employeeSheets = {
        //   sheetName: '员工列表',
        //   data: employee.map((_) => ({
        //     员工名称: _.employeeName,
        //     员工编号: _.employeeId,
        //     '所属组织/部门编号': _.orgId,
        //   })),
        // };
        // const orgSheets = {
        //   sheetName: '组织部门',
        //   data: org.map((_) => ({ '组织/部门名称': _.orgName, '组织/部门编号': _.orgId })),
        // };
        // const placeSheets = {
        //   sheetName: '位置',
        //   data: place.map((_) => ({ 位置名称: _.placeName, 位置编号: _.placeId })),
        // };
        // let config = {
        //   excelName: '资产列表模板',
        //   sheetsConfig: [templateSheet, brandSheets, classSheets, employeeSheets, orgSheets, placeSheets],
        // };
        // exportManySheetsWithStyle(config);

        const res = await clientService.exportImport.asset.getTemplate();
        if (res.code === 1) {
          exportExcelWithManySheet({
            excelName: `资产导入模板`,
            sheetsConfig: [
              {
                data: [],
                template: res.data.columns,
                sheetName: "模板",
                titleMessage: res.data.warnningTextList,
                hasPromptTitle: true,
              },
            ],
          });
        } else {
          global.$showMessage({
            type: "error",
            message: res.message,
          });
        }
        return;
      case "2":
        setUploadDialogVisible(true);
        return;
      case "3":
        exportExcelWithManySheet({
          excelName: `资产列表-${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
          sheetsConfig: [{ data: data, template: template.export }],
        });
        return;
      case "4":
        exportExcelWithManySheet({
          excelName: `资产列表-${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
          sheetsConfig: [
            {
              data: selectedData,
              template: template.export,
            },
          ],
        });
        return;
      case "5":
        exportExcelWithManySheet({
          excelName: `资产列表-${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
          sheetsConfig: [{ data: originData, template: template.export }],
        });
        return;
      default:
        return;
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<DownloadOutlined />}>
        下载导入模板
      </Menu.Item>
      <Menu.Item key="2" icon={<FileAddOutlined />}>
        批量导入资产
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<FileSearchOutlined />}>
        导出查询结果
      </Menu.Item>
      <Menu.Item key="4" icon={<SelectOutlined />}>
        导出选中资产({selectedRowKeys.length})
      </Menu.Item>
      <Menu.Item key="5" icon={<ExportOutlined />}>
        导出全部
      </Menu.Item>
    </Menu>
  );

  React.useEffect(() => {
    brand.length === 0 && dispatch(fetchBrandList());
    class_.length === 0 && dispatch(fetchClassList());
    employee.length === 0 && dispatch(fetchEmployeeList());
    org.length === 0 && dispatch(fetchOrgList());
    place.length === 0 && dispatch(fetchPlaceList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dropdown overlay={menu}>
        <Button>
          导入/导出 <DownOutlined />
        </Button>
      </Dropdown>
      <UploadDialog
        refreshData={refreshData}
        open={uploadDialogVisible}
        closeDialog={() => setUploadDialogVisible(false)}
      />
    </>
  );
});
