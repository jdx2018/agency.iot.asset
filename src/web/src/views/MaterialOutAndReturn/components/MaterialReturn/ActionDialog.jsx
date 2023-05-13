import React, { useState } from 'react';
import dayjs from 'dayjs';

import { Button, Form, Modal } from 'antd';

import { CloseOutlined } from '@ant-design/icons';
import { formItemRender } from 'hooks';
import MaterialPicker from 'components/MaterialPicker';

import clientService from 'api/clientService';
import { Scrollbars } from 'react-custom-scrollbars';

import { exporMaterialReturnExcleStament } from './MaterialReturnExcelStament';

const zhMap = {
  create: '创建',
  detail: '',
  edit: '编辑',
};

export default React.memo(
  ({
    open,
    closeDialog,
    dialogData = { billMain: {}, billDetail: {} },
    type,
    getMaterialListFunc,
    billTitle,
    selectedRowKey,
    billNo,
  }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const { billMain, billDetail } = dialogData;

    const onFinish = async (values) => {
      const dateTimeKeys = dialogData.billMain
        ? Object.keys(dialogData.billMain).filter((key) => dialogData.billMain[key].type === 'dateTime')
        : [];
      dateTimeKeys.forEach((key) => {
        values[key] = values[key] ? dayjs(values[key]).format('YYYY-MM-DD') : null;
      });
      const materialList = values.materialList;
      delete values.materialList;
      if (materialList.some((v) => v.qty === 0)) {
        global.$showMessage({
          type: 'warning',
          message: '退库数量不能为0',
        });
        return;
      }
      const billMain_ = JSON.parse(JSON.stringify(values));
      const func =
        type === 'create'
          ? clientService.bill_tuiku_material.saveBill.bind(null, billMain_, materialList)
          : clientService.bill_tuiku_material.updateBill.bind(null, selectedRowKey, billMain_);
      setConfirmLoading(true);
      const res = await func();
      setConfirmLoading(false);
      if (res.code === 1) {
        global.$showMessage({
          message: `${zhMap[type] + billTitle}成功`,
          type: 'success',
        });
        closeDialog(true);
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    };

    const onFinishFailed = (errors) => {};

    React.useEffect(() => {
      const formValues = {};
      if (billMain) {
        Object.keys(billMain).forEach((key) => {
          formValues[key] = billMain[key].value;
        });
        if (JSON.stringify(billMain) !== '{}') {
          const dateTimeKeys = billMain ? Object.keys(billMain).filter((key) => billMain[key].type === 'dateTime') : [];
          dateTimeKeys.forEach((key) => {
            formValues[key] = formValues[key] ? dayjs(formValues[key]) : null;
          });
          if (billDetail.rows) {
            formValues.materialList = billDetail.rows;
          }
          open && form.setFieldsValue(formValues);
        }
      }
    }, [billDetail.rows, billMain, form, open, type]);

    const handleCloseDialog = () => {
      closeDialog();
    };

    const modalFooterRender = () => {
      if (type !== 'detail')
        return [
          <Button key='2' loading={confirmLoading} type='primary' onClick={form.submit}>
            确认
          </Button>,
          <Button key='1' onClick={handleCloseDialog}>
            取消
          </Button>,
        ];
      return [
        <Button type='primary' key='1' onClick={handleExportStament}>
          导出单据
        </Button>,
        <Button key='1' onClick={handleCloseDialog}>
          取消
        </Button>,
      ];
    };

    function handleExportStament() {
      let { header, rows } = billDetail;
      let template = Object.keys(header).map((item) => {
        return { key: item, desc: header[item].zh };
      });
      let subLendInfo = {
        assetList: rows,
        template,
      };

      const formValues = form.getFieldsValue();
      const dateTimeKeys = billMain ? Object.keys(billMain).filter((key) => billMain[key].type === 'dateTime') : [];
      dateTimeKeys.forEach((key) => {
        formValues[key] = formValues[key] ? dayjs(formValues[key]).format('YYYY-MM-DD') : null;
      });
      let mainLendInfo = {
        billNo: billNo,
        returnEmployeeName: formValues.returnEmployeeId
          ? billMain?.returnEmployeeId.dataSource.find((v) => v.employeeId === formValues.returnEmployeeId).employeeName
          : '',
        returnDate: formValues?.returnDate,
        returnOrgName: formValues.returnOrgId
          ? billMain?.returnOrgId.dataSource.find((v) => v.orgId === formValues.returnOrgId).orgName
          : '',
        operatePersonId: formValues.operatePersonId
          ? billMain?.operatePersonId.dataSource.find((v) => v.employeeId === formValues.operatePersonId).orgName
          : '',
        remarks: formValues.remarks ? formValues.remarks : '',
      };
      exporMaterialReturnExcleStament(mainLendInfo, subLendInfo, `耗材退库申请表-${dayjs().format('YYYY-MM-DD')}`);
    }

    return (
      <Modal
        destroyOnClose
        width={'948px'}
        footer={modalFooterRender()}
        closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
        title={
          <span
            style={{
              fontSize: 16,
              color: '#fff',
            }}
          >
            {zhMap[type] + billTitle}单
          </span>
        }
        visible={open}
        onOk={form.submit}
        onCancel={handleCloseDialog}
      >
        <Scrollbars
          style={{
            height: '62vh',
          }}
        >
          <Form
            preserve={false}
            onFinish={onFinish}
            validateTrigger='onSubmit'
            onFinishFailed={onFinishFailed}
            colon={false}
            labelAlign='left'
            layout='inline'
            form={form}
            requiredMark={false}
          >
            {formItemRender({ billMain, form, type })}
            <br />

            <Form.Item
              name='materialList'
              style={{
                marginBottom: 10,
                width: '100%',
                borderTop: '1px dashed #cfdae5',
              }}
            >
              <MaterialPicker getMaterialListFunc={getMaterialListFunc} type={type} pickerConfig={billDetail} />
            </Form.Item>
          </Form>
        </Scrollbars>
      </Modal>
    );
  }
);
