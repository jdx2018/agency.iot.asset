import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Steps, notification, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./UploadDialog.module.css";
import {
  transformErrorDataPosition,
  analysisUploadExcel,
  exportExcelWithTemplateError,
  exportExcelWithVerifyError,
} from "utils/common";
import dayjs from "dayjs";
import clientService from "api/clientService";

const { Step } = Steps;

const UploadDialog = ({ open, closeDialog, refreshData }) => {
  const [current, setCurrent] = useState(null);
  const [status, setStatus] = useState("wait"); // wait process finish error
  const [resultActionBtn, setResultActionBtn] = useState(null);
  const [isUploading, setIsUploading] = useState(true);
  const [confirmBtnStatus, setConfirmBtnStatus] = useState(false);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const template = useRef(null);

  const dataReadyForUpload = useRef([]);

  const handleStart = () => {
    analysisUploadExcel(afterImportSuccess, template.current.columns, () => {
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
    setConfirmBtnStatus(true);
    const res = await clientService.asset.addAssetList(dataReadyForUpload.current);
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
      // const res = await clientService.asset.checkAssetList(sheets.data[0].data);
      const res = await clientService.exportImport.asset.check(sheets[0].data);
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
                errorDataPosition: transformErrorDataPosition(res.errorList, template.current.columns),
                template: template.current.columns,
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
      const res = await clientService.exportImport.asset.getTemplate();
      if (res.code === 1) {
        template.current = res.data;
      } else {
        global.$showMessage({
          type: "error",
          message: res.message,
        });
      }
    };
    fetchData();
  }, []);

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
    </Modal>
  );
};

export default UploadDialog;
