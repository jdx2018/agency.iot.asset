import React, { useState } from 'react';
import dayjs from 'dayjs';

import { Button, Form, Modal, Skeleton } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { formItemRender } from 'hooks';

import AssetsPicker from 'components/AssetsPicker';

import clientService from 'api/clientService';
import { Scrollbars } from 'react-custom-scrollbars';

import { exportLendExcleStament } from './LendExcelStament';

const zhMap = {
  create: '创建',
  detail: '',
  edit: '编辑',
};

export default React.memo(({ open, closeDialog, type, dialogData, loading, billNo }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { billMain, billDetail, method } = dialogData || { billMain: null, billDetail: null, method: null };

  const onFinish = async (values) => {
    const dateTimeKeys = billMain ? Object.keys(billMain).filter((key) => billMain[key].type === 'dateTime') : [];
    dateTimeKeys.forEach((key) => {
      values[key] = values[key] ? dayjs(values[key]).format('YYYY-MM-DD') : null;
    });
    const assetList = values.assetList;
    delete values.assetList;
    const billMain_ = JSON.parse(JSON.stringify(values));
    const func = clientService.bill_jiechu.saveBill.bind(null, billMain_, assetList);
    setConfirmLoading(true);
    const res = await func();
    setConfirmLoading(false);
    if (res.code === 1) {
      global.$showMessage({
        message: `${zhMap[type]}借出单成功`,
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
      const dateTimeKeys = billMain ? Object.keys(billMain).filter((key) => billMain[key].type === 'dateTime') : [];
      dateTimeKeys.forEach((key) => {
        formValues[key] = formValues[key] ? dayjs(formValues[key]) : null;
      });
    }
    if (billDetail && billDetail.rows) {
      formValues.assetList = billDetail.rows;
    }
    open && form.setFieldsValue(formValues);
  }, [billDetail, billMain, form, open]);

  const modalFooterRender = () => {
    if (type !== 'detail')
      return [
        <Button key='2' loading={confirmLoading} type='primary' onClick={form.submit}>
          确认
        </Button>,
        <Button key='1' onClick={closeDialog}>
          取消
        </Button>,
      ];
    return [
      <Button type='primary' key='1' onClick={handleExportStament}>
        导出单据
      </Button>,
      <Button key='1' onClick={closeDialog}>
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
      useEmployeeName: formValues.useEmployeeId
        ? billMain?.useEmployeeId.dataSource.find((v) => v.employeeId === formValues.useEmployeeId).employeeName
        : '',
      borrowDate: formValues?.borrowDate,
      returnDate: formValues?.returnDate,
      useOrgName: formValues.useOrgId
        ? billMain?.useOrgId.dataSource.find((v) => v.orgId === formValues.useOrgId).orgName
        : '',
      placeName: formValues.placeId
        ? billMain?.placeId.dataSource.find((v) => v.placeId === formValues.placeId).placeName
        : '',
      operatePersonName: formValues.operatePersonId
        ? billMain?.operatePersonId.dataSource.find((v) => v.employeeId === formValues.operatePersonId).orgName
        : '',
      remarks: formValues.remarks ? formValues.remarks : '',
    };
    exportLendExcleStament(mainLendInfo, subLendInfo, `借用申请表-${dayjs().format('YYYY-MM-DD')}`);
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
          {zhMap[type]}借出单
        </span>
      }
      visible={open}
      onOk={form.submit}
      onCancel={closeDialog}
    >
      <Scrollbars
        style={{
          height: '62vh',
        }}
      >
        <Skeleton active loading={loading}>
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
              name='assetList'
              style={{
                marginBottom: 10,
                width: '100%',
                borderTop: '1px dashed #cfdae5',
              }}
            >
              <AssetsPicker type={type} getAssetListFunc={method} pickerConfig={billDetail} />
            </Form.Item>
          </Form>
        </Skeleton>
      </Scrollbars>
    </Modal>
  );
});
