import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Steps, notification, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./UploadDialog.module.css";
import {
  transformErrorDataPosition,
  analysisUploadExcel,
  exportExcelWithVerifyError,
  exportExcelWithTemplateError,
} from "utils/common";
import dayjs from "dayjs";
// import clientService from 'api/clientService';

const { Step } = Steps;

// const template = {
//   import: [
//     {
//       key: 'status',
//       desc: '资产状态',
//       isTranslate: true,
//     },
//     {
//       key: 'assetId',
//       desc: '资产编码',
//       required: true,
//       isTranslate: true,
//     },
//     {
//       key: 'epc',
//       desc: 'EPC',
//     },
//     {
//       key: 'assetName',
//       desc: '资产名称',
//     },
//     {
//       key: 'classId',
//       desc: '资产分类',
//       isTranslate: true,
//     },
//     {
//       key: 'brand',
//       desc: '品牌',
//     },
//     {
//       key: 'model',
//       desc: '型号',
//     },
//     {
//       key: 'spec',
//       desc: '规格',
//     },
//     {
//       key: 'invoiceType',
//       desc: '发票类型',
//     },
//     {
//       key: 'documentNumber',
//       desc: '凭证号',
//     },
//     {
//       key: 'documentDate',
//       desc: '凭证日期',
//     },
//     {
//       key: 'initialValue',
//       desc: '资产原值',
//     },
//     {
//       key: 'manager',
//       desc: '管理员',
//     },
//     {
//       key: 'ownOrgId',
//       desc: '所属部门',
//       isTranslate: true,
//     },
//     {
//       key: 'useOrgId',
//       desc: '使用部门',
//       isTranslate: true,
//     },
//     {
//       key: 'useDate',
//       desc: '借用/领用日期',
//     },
//     {
//       key: 'placeId',
//       desc: '位置',
//       isTranslate: true,
//     },
//     {
//       key: 'purchaseType',
//       desc: '购置方式',
//     },

//     {
//       key: 'purchaseDate',
//       desc: '购置日期',
//     },
//     {
//       key: 'barcode',
//       desc: '资产条码',
//     },
//     {
//       key: 'serviceLife',
//       desc: '使用年限',
//     },
//     {
//       key: 'supplier',
//       desc: '供应商',
//     },
//     {
//       key: 'purchasePerson',
//       desc: '采购人',
//     },
//     {
//       key: 'amount',
//       desc: '金额',
//     },
//     {
//       key: 'useEmployeeId',
//       desc: '使用人',
//       isTranslate: true,
//     },
//     {
//       key: 'wareHouse',
//       desc: '库房',
//     },
//     {
//       key: 'sn',
//       desc: '设备SN码',
//     },
//     {
//       key: 'useStatus',
//       desc: '使用状态',
//     },
//     {
//       key: 'remarks',
//       desc: '备注',
//     },
//   ],
//   export: [
//     {
//       key: 'status',
//       desc: '资产状态',
//     },
//     {
//       key: 'assetId',
//       desc: '资产编码',
//     },
//     {
//       key: 'epc',
//       desc: 'EPC',
//     },
//     {
//       key: 'assetName',
//       desc: '资产名称',
//     },
//     {
//       key: 'className',
//       desc: '资产分类',
//     },

//     {
//       key: 'brand',
//       desc: '品牌',
//       required: false,
//     },
//     {
//       key: 'model',
//       desc: '型号',
//     },
//     {
//       key: 'spec',
//       desc: '规格',
//     },
//     {
//       key: 'manager',
//       desc: '管理员',
//     },
//     {
//       key: 'ownOrgName',
//       desc: '所属部门',
//     },
//     {
//       key: 'useOrgName',
//       desc: '使用部门',
//     },
//     {
//       key: 'useDate',
//       desc: '借用/领用日期',
//     },
//     {
//       key: 'placeName',
//       desc: '位置',
//     },
//     {
//       key: 'documentNumber',
//       desc: '凭证号',
//     },
//     {
//       key: 'documentDate',
//       desc: '凭证日期',
//     },
//     {
//       key: 'purchaseType',
//       desc: '购置方式',
//     },

//     {
//       key: 'purchaseDate',
//       desc: '购置日期',
//     },
//     {
//       key: 'initialValue',
//       desc: '资产原值',
//     },
//     {
//       key: 'supplier',
//       desc: '供应商',
//     },
//     {
//       key: 'purchasePerson',
//       desc: '采购人',
//     },
//     {
//       key: 'amount',
//       desc: '金额',
//     },
//     {
//       key: 'useEmployeeName',
//       desc: '使用人',
//     },
//     {
//       key: 'wareHouse',
//       desc: '库房',
//     },
//     {
//       key: 'sn',
//       desc: '设备SN码',
//     },
//     {
//       key: 'useStatus',
//       desc: '使用状态',
//     },
//     {
//       key: 'remarks',
//       desc: '备注',
//     },
//   ],
// };

const UploadDialog = ({ open, closeDialog, refreshData, uploadConfig }) => {
  const { getTemplateFunc, checkFunc, uploadFunc } = uploadConfig;
  const [current, setCurrent] = useState(null);
  const [status, setStatus] = useState("wait"); // wait process finish error
  const [resultActionBtn, setResultActionBtn] = useState(null);
  const [isUploading, setIsUploading] = useState(true);
  const [confirmBtnStatus, setConfirmBtnStatus] = useState(false);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [globalStatus, setGlobalStatus] = useState(true);
  const templateRef = useRef(null);

  const dataReadyForUpload = useRef([]);

  const handleStart = () => {
    analysisUploadExcel(afterImportSuccess, templateRef.current, () => {
      setCurrent(0);
      setStatus("process");
      setIsProcessingExcel(true);
    });
  };

  const handleReset = () => {
    setCurrent(null);
    setStatus("wait");
    setIsUploading(true);
    dataReadyForUpload.current = [];
  };

  const handleConfirm = async () => {
    // const chunks = lodash.chunk(
    //   sheets[0].data.map((j) => ({
    //     ...j,
    //     status: 0,
    //     useStatus: 0,
    //     amount: !j.amount || j.amount === '' ? 0 : j.amount,
    //   })),
    //   2000
    // )
    // Promise.all(chunks.map(async (v) => await clientService.asset.addAssetList(v))).then((values) => {
    //   console.log(values)
    // })
    setConfirmBtnStatus(true);
    const res = await uploadFunc(dataReadyForUpload.current);
    setConfirmBtnStatus(false);
    if (res.code === 1) {
      global.$showMessage({
        message: "上传成功",
        type: "success",
      });
      handleReset();
      closeDialog();
      refreshData();
    } else {
      notification.error({
        message: "发生错误",
        description: res.message,
      });
    }
  };

  const afterImportSuccess = async (sheets) => {
    setIsProcessingExcel(false);
    setIsUploading(false);
    if (sheets[0].code === 1) {
      setCurrent(1);
      setResultActionBtn(null);
      setIsProcessingExcel(true);
      setStatus("process");
      await setTimeout(() => {}, 5000);
      const res = await checkFunc(sheets[0].data);
      if (res.code === 1) {
        setCurrent(3);
        setResultActionBtn(null);
        setIsProcessingExcel(false);
        setStatus("finish");
        dataReadyForUpload.current = sheets[0].data;
      } else {
        setStatus("error");
        setIsProcessingExcel(false);
        setResultActionBtn(
          <Button
            onClick={async () => {
              setIsProcessingExcel(true);
              await exportExcelWithVerifyError({
                sheet: sheets[0].sheet,
                errorDataPosition: transformErrorDataPosition(res.errorList, templateRef.current),
                template: templateRef.current,
                excelName: `数据验证结果-${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
              });
              setIsProcessingExcel(false);
            }}
          >
            下载数据验证结果
          </Button>
        );
      }
    } else {
      setStatus("error");
      setResultActionBtn(
        <Button
          onClick={async () => {
            setIsProcessingExcel(true);
            await exportExcelWithTemplateError(sheets[0]);
            setIsProcessingExcel(false);
          }}
        >
          下载模板匹配结果
        </Button>
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTemplateFunc();
      if (res.code === 1) {
        templateRef.current = res.data.columns;
      } else {
        setGlobalStatus(false);
      }
    };
    fetchData();
  }, [getTemplateFunc]);

  return (
    <Modal
      width={"1000px"}
      footer={[
        <Button key="0" onClick={handleReset}>
          重新上传
        </Button>,
        <Button key="1" onClick={closeDialog}>
          取消
        </Button>,
        <Button loading={confirmBtnStatus} disabled={current !== 3} key="2" type="primary" onClick={handleConfirm}>
          开始上传
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
          上传
        </span>
      }
      visible={open}
      onOk={handleConfirm}
      onCancel={closeDialog}
    >
      {globalStatus ? (
        <div>
          <Steps current={current} status={status}>
            <Step title="解析模板" description="验证传入模板是否符合要求" />
            <Step title="解析数据" description="验证待上传数据格式是否有误" />
            <Step title="确认上传" description="验证完成，确认上传" />
          </Steps>
          {isProcessingExcel ? (
            <div className={styles.actionArea}>
              <Spin />
              <div>解析数据中...</div>
            </div>
          ) : (
            <div>
              {current === 3 ? (
                <div className={styles.actionArea}>校验已完成，请点击开始上传</div>
              ) : isUploading ? (
                <div className={styles.inputfile} onClick={handleStart}>
                  <span className={styles.inputfileDescText}>
                    点击此处，选择要上传的文件导入（超过20w条数据请分批次导入）
                  </span>
                </div>
              ) : (
                <div className={styles.actionArea}>
                  <div>{resultActionBtn ? "解析完成" : "解析中..."} </div>
                  <div>{resultActionBtn}</div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        "获取模版数据出错，请检查网络或者联系管理员"
      )}
    </Modal>
  );
};

export default UploadDialog;
