import React from "react";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Input, Modal } from "antd";
import Switch from "./Switch";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

import SelectPicker from "./SelectPicker";
import TreeSelectPicker from "./TreeSelectPicker";

// to be replace
import { getEnum_useStatus } from "api/param/paramEnum";

import { UploadImage } from "components";
import AssetCodeGenerateInput from "./AssetCodeGenerateInput";

import {
  // brandList,
  add as brandList_add,
} from "store/slices/brand";
import { classList } from "store/slices/class";
import { employeeList } from "store/slices/employee";
import { orgList } from "store/slices/org";
import { placeList } from "store/slices/place";
import { Scrollbars } from "react-custom-scrollbars";
import { formItemRender } from "hooks";
import { cloneDeep } from "lodash";

const clientService = require("api/clientService");
const { TextArea } = Input;

export default React.memo(({ open, closeDialog, formValues, type, changeFormType }) => {
  // const brand = useSelector(brandList)
  const class_ = useSelector(classList);
  const employee = useSelector(employeeList);
  const org = useSelector(orgList);
  const place = useSelector(placeList);

  const dispatch = useDispatch();

  // const dateTimeKeyList = billMain

  const [form] = Form.useForm();
  const [cancelBtnVisible, setCancelBtnVisible] = React.useState(false);
  const [confirmBtnLoading, setConfirmBtnLoading] = React.useState(false);
  const [billMain, setBillMain] = React.useState(null);
  const dateTimeKeysList = React.useMemo(
    () => (billMain ? Object.keys(billMain).filter((key) => billMain[key].type === "dateTime") : []),
    [billMain]
  );

  React.useEffect(() => {
    if (formValues) {
      const f = cloneDeep(formValues);
      dateTimeKeysList.forEach((key) => {
        if (!f[key]) {
          f[key] = null;
          return;
        }
        f[key] = dayjs(f[key]);
      });
      setTimeout(() => {
        form.setFieldsValue(f);
      }, 0);
    } else {
      open && form.resetFields();
    }
  }, [dateTimeKeysList, form, formValues, open]);

  const onFinish = async (values) => {
    if (values.image) {
      values.image = values.image[0];
    }
    dateTimeKeysList.forEach((key) => {
      if (values[key]) {
        values[key] = dayjs(values[key]).format("YYYY-MM-DD");
      } else {
        values[key] = null;
      }
    });
    setConfirmBtnLoading(true);

    if (formValues && type === "edit") {
      const res = await clientService.asset.updateAsset(values.assetId, values);
      if (res.code === 1) {
        dispatch(brandList_add({ text: values.brand, value: values.brand }));

        global.$showMessage({
          message: "资产信息更新成功",
          type: "success",
        });

        closeDialog(true);
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    } else {
      const res = await clientService.asset.addAsset(values);
      if (res.code === 1) {
        dispatch(brandList_add({ text: values.brand, value: values.brand }));
        global.$showMessage({
          message: "资产信息提交成功",
          type: "success",
        });
        closeDialog(true);
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    }
    setConfirmBtnLoading(false);
  };

  const onFinishFailed = (errors) => {};

  const handleEdit = () => {
    changeFormType("edit");
    setCancelBtnVisible(true);
  };

  const handleCancel = () => {
    changeFormType("detail");
    setCancelBtnVisible(false);
  };

  const handleConfirm = () => {
    form.submit();
  };

  React.useEffect(() => {
    const dialogContentRender = async () => {
      const res = await clientService.asset.getTemplate();
      if (res.code === 1) {
        setBillMain(res.data);
        // initialFormValues && form.setFieldsValue(initialFormValues);
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    };
    dialogContentRender();
  }, []);

  const modalFooterRender = () => {
    let btnGroups = [
      <Button key="3" onClick={() => closeDialog()}>
        关闭
      </Button>,
    ];
    if (type === "detail")
      btnGroups.push(
        <Button key="0" type="primary" onClick={handleEdit}>
          <EditOutlined />
          编辑
        </Button>
      );
    if (type !== "detail" && cancelBtnVisible)
      btnGroups.push(
        <Button key="1" loading={confirmBtnLoading} type="primary" onClick={handleConfirm}>
          确认
        </Button>,
        <Button key="2" type="primary" onClick={handleCancel}>
          取消
        </Button>
      );
    if (type !== "detail" && !cancelBtnVisible)
      btnGroups.push(
        <Button key="1" loading={confirmBtnLoading} type="primary" onClick={handleConfirm}>
          确认
        </Button>
      );
    return btnGroups;
  };

  return (
    <Modal
      destroyOnClose
      width={"948px"}
      footer={modalFooterRender()}
      closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
      title={
        <span
          style={{
            fontSize: 16,
            color: "#fff",
          }}
        >
          {type === "detail" ? "资产明细" : (type === "edit" ? "编辑" : "新增") + "资产"}
        </span>
      }
      visible={open}
      onOk={handleConfirm}
      onCancel={() => closeDialog()}
    >
      <Scrollbars
        style={{
          height: "62vh",
        }}
      >
        <Form
          preserve={false}
          validateTrigger="onSubmit"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          colon={false}
          labelAlign="left"
          layout="inline"
          form={form}
          initialValues={{}}
          requiredMark={false}
        >
          <div
            style={{
              borderBottom: "1px dashed #aeafb0",
              fontSize: 16,
              width: "100%",
              marginBottom: 20,
            }}
          >
            基本信息
          </div>
          <Form.Item
            name="assetId"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>资产编码</div>}
          >
            <AssetCodeGenerateInput disabled={type === "detail"} setFieldsValue={form.setFieldsValue} />
          </Form.Item>
          <Form.Item
            name="isMonitor"
            style={{
              marginBottom: 10,
              width: 278,
            }}
            label={<div style={{ width: 80 }}>是否开启监测</div>}
          >
            <Switch disabled={type === "detail"} />
          </Form.Item>
          <Form.Item
            name="barcode"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>条码/辅助编码</div>}
          >
            <Input
              disabled={type === "detail"}
              style={{
                width: 180,
                marginRight: 30,
              }}
              placeholder="请输入条码"
            />
          </Form.Item>
          <Form.Item
            name="epc"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>EPC</div>}
          >
            <Input
              disabled={type === "detail"}
              style={{
                width: 180,
                marginRight: 30,
              }}
              placeholder="请输入EPC"
            />
          </Form.Item>
          <Form.Item
            name="assetName"
            style={{
              marginBottom: 10,
            }}
            label={
              <div style={{ width: 80 }}>
                资产名称<span style={{ color: "red" }}>*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: "资产名称不能为空",
              },
            ]}
          >
            <Input
              disabled={type === "detail"}
              style={{
                width: 180,
                marginRight: 30,
              }}
              placeholder="请输入资产名称"
            />
          </Form.Item>
          <Form.Item
            name="classId"
            style={{
              marginBottom: 10,
            }}
            label={
              <div style={{ width: 80 }}>
                资产分类<span style={{ color: "red" }}>*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: "资产分类不能为空",
              },
            ]}
          >
            <TreeSelectPicker
              disabled={type === "detail"}
              key_="classId"
              label="className"
              desc="资产分类"
              data={class_}
              cacheField="class"
              FetchDataFunc={clientService.assetClass.getAssetClass_list}
            />
          </Form.Item>
          <Form.Item
            name="placeId"
            style={{
              marginBottom: 10,
            }}
            label={
              <div style={{ width: 80 }}>
                所在位置<span style={{ color: "red" }}>*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: "所在位置不能为空",
              },
            ]}
          >
            <TreeSelectPicker
              disabled={type === "detail"}
              desc="所在位置"
              label="placeName"
              key_="placeId"
              data={place}
              cacheField="place"
              FetchDataFunc={clientService.assetPlace.getPlaceList_list}
            />
          </Form.Item>
          <Form.Item
            name="manager"
            style={{
              marginBottom: 10,
            }}
            label={
              <div style={{ width: 80 }}>
                管理员<span style={{ color: "red" }}>*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: "管理员不能为空",
              },
            ]}
          >
            <SelectPicker
              disabled={type === "detail"}
              desc="管理员"
              label="employeeName"
              key_="employeeId"
              data={employee}
              cacheField="employee"
              FetchDataFunc={clientService.employee.getEmployeeList_list}
            />
          </Form.Item>
          <Form.Item
            name="ownOrgId"
            style={{
              marginBottom: 10,
            }}
            label={
              <div style={{ width: 80 }}>
                所属部门<span style={{ color: "red" }}>*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: "所属部门不能为空",
              },
            ]}
          >
            <TreeSelectPicker
              disabled={type === "detail"}
              key_="orgId"
              label="orgName"
              desc="所属部门"
              data={org}
              cacheField="org"
              FetchDataFunc={clientService.org.getOrgList_list}
            />
          </Form.Item>
          <Form.Item
            name="useStatus"
            style={{
              marginBottom: 10,
            }}
            label={
              <div style={{ width: 80 }}>
                使用状况<span style={{ color: "red" }}>*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: "使用状况不能为空",
              },
            ]}
          >
            <SelectPicker
              disabled={type === "detail"}
              label="text"
              key_="value"
              desc="使用状况"
              FetchDataFunc={getEnum_useStatus}
            />
          </Form.Item>
          {formItemRender({ billMain, type, form })}
          <Form.Item
            name="remarks"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>备注</div>}
          >
            <TextArea
              disabled={type === "detail"}
              autoSize={{
                minRows: 4,
              }}
              style={{
                width: 557,
                marginRight: 30,
              }}
              placeholder="请输入备注"
            />
          </Form.Item>

          <Form.Item
            name="image"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>资产图片</div>}
          >
            <UploadImage disabled={type === "detail"} />
          </Form.Item>

          <div
            style={{
              borderBottom: "1px dashed #aeafb0",
              fontSize: 16,
              width: "100%",
              marginBottom: 20,
            }}
          >
            维保信息
          </div>
          <Form.Item
            name="supplier"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>供应商</div>}
          >
            <Input
              disabled={type === "detail"}
              style={{
                width: 180,
                marginRight: 30,
              }}
              placeholder="请输入供应商"
            />
          </Form.Item>
          <Form.Item
            name="linkPerson"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>联系人</div>}
          >
            <Input
              disabled={type === "detail"}
              style={{
                width: 180,
                marginRight: 30,
              }}
              placeholder="请输入联系人"
            />
          </Form.Item>
          <Form.Item
            name="telNo"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>联系电话</div>}
          >
            <Input
              disabled={type === "detail"}
              style={{
                width: 180,
                marginRight: 30,
              }}
              placeholder="请输入联系电话"
            />
          </Form.Item>
          <Form.Item
            name="expired"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>维保到期时间</div>}
          >
            <Input
              disabled={type === "detail"}
              style={{
                width: 180,
                marginRight: 30,
              }}
              placeholder="请选择维保到期时间"
            />
          </Form.Item>
          <Form.Item
            name="mContent"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>维保说明</div>}
          >
            <TextArea
              disabled={type === "detail"}
              autoSize={{
                minRows: 4,
              }}
              style={{
                width: 466,
                marginRight: 30,
              }}
              placeholder="请输入维保说明"
            />
          </Form.Item>
        </Form>
      </Scrollbars>
    </Modal>
  );
});
