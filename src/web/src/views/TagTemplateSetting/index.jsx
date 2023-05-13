/* eslint-disable jsx-a11y/anchor-is-valid */
//* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Form, Checkbox, Button, Tag, InputNumber, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Box, Card } from "@material-ui/core";

export default () => {
  const [form] = Form.useForm();
  // const plainOptions = ["模板一", "模板二", "模板三"];
  const Options = ["标签专用纸", "A4纸"];

  const onFinish = async (values) => { };

  const onFinishFailed = (errors) => { };
  return (
    <Box p={1} style={{}}>
      <Card
        style={{
          boxShadow: "none",
          height: "calc(100vh - 64px)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            width: "100%",
            height: 50,
            padding: 10,
            borderBottom: "3px solid #f7f8fa",
            marginBottom: 30,
          }}
        // ghost={false}
        // onBack={false}
        // title="标签设置"
        // subTitle="web端配置打印机纸张长、宽比为2.5可得到最佳打印效果。如：纸带宽度为18mm，设置长度为45mm最佳；纸带宽度为24mm，设置长度为60最佳"
        >
          标签设置
        </div>
        <div
          style={{
            // width: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "none",
          }}
        >
          <Form
            preserve={false}
            style={{
              width: "70%",
            }}
            onFinish={onFinish}
            validateTrigger="onSubmit"
            onFinishFailed={onFinishFailed}
            colon={false}
            // labelAlign="left"
            // layout="inline"
            form={form}
            requiredMark={false}
          >
            <Form.Item
              // name=""
              style={{
                marginBottom: 30,
              }}
              label={
                <span
                  style={{
                    width: 150,
                    textAlign: "left",
                    color: "red",
                  }}
                >
                  温馨提示
                </span>
              }
            >
              web端配置打印机纸张长、宽比为2.5可得到最佳打印效果。如：纸带宽度为18mm，设置长度为45mm最佳；纸带宽度为24mm，设置长度为60最佳
              <a> 如何设置打印机？</a>
            </Form.Item>
            <Form.Item
              // name="标签模板"
              style={{
                marginBottom: 30,
              }}
              label={
                <span
                  style={{
                    width: 150,
                    textAlign: "left",
                  }}
                >
                  选择标签模板
                </span>
              }
            >
              {/* <Checkbox.Group options={plainOptions} defaultValue={["模板一"]} /> */}
              <Space
              // style={{
              //   display: "flex",
              // }}
              >
                <div
                  style={{
                    width: 250,
                    height: 120,
                    padding: 10,
                    border: "1px dotted #ddd",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      borderBottom: "1px dotted #ddd",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    模板一
                    <Checkbox checked></Checkbox>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    自定义选取字段
                    <img
                      style={{
                        height: 60,
                        width: 60,
                        float: "right",
                      }}
                      src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMjgwMTE3NDA3MjA2ODExODIyQTlFMUVFRDNDQUZCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxRjQzNTk2MTEyRDQxMUU3QjM2MTk0Q0JCRkMxRUQyMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxRjQzNTk2MDEyRDQxMUU3QjM2MTk0Q0JCRkMxRUQyMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDk0OUYxNEEyQTIwNjgxMTgyMkE5RTFFRUQzQ0FGQkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDI4MDExNzQwNzIwNjgxMTgyMkE5RTFFRUQzQ0FGQkUiLz4gPC9yZGY6RGVzY3Jp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"
                      alt="preview"
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: 186,
                    height: 120,
                    padding: 10,
                    border: "1px dotted #ddd",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      borderBottom: "1px dotted #ddd",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    模板二
                    <Checkbox></Checkbox>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 75,
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: 15,
                    }}
                  >
                    自定义选取字段
                    <img
                      style={{
                        height: 20,
                        width: 159,
                        float: "right",
                      }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAAAUCAYAAAB8roTFAAABX0lEQVRoQ+2awQ7DIAxD4f8/utPGqEqEMRmnSW+XqVMLxSSOHVZLKVd5fK6rXdZaP9/9ut+ifn+OsXre3dfH7/dl54/Px/nU+k7Xpd47jnu6vrgPcX1Z3LLv5+Z3+N7PE3jrRHOJojZidwOyieU2nsATjOk28pQRYLyG8G5Aw3ihxGczN8sECvC4YS5RYLwRoV2mfws5NN5C0xJ4Q3jccKjKQuAJ1e2AgfGaqVQVx1UWhy/mImhQXO1osgi8r/aLmaaYCXOBuZi6K6eZcLXz/qnCTSgKXG1WMxF4BF6qH+SYTGVmto/ktBilllJLqZ20aU4Z3bnKbP8zm/huflwt7ZQBgd2zd5cYBF5wuw6QyAScXDREYDyOzKaB4LQxrjYg4EyA6ss5qnfjYi4wF5iLH0qZS6yspHCNd0otpZZSOxOdLnPo480P17OMAuPx1/epbndtiV33nO23qcT+V3PxAtsIAEyPIepdAAAAAElFTkSuQmCC"
                      alt="preview"
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: 106,
                    height: 120,
                    padding: 10,
                    border: "1px dotted #ddd",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      borderBottom: "1px dotted #ddd",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    模板三
                    <Checkbox></Checkbox>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 90,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        height: 60,
                        width: 60,
                        float: "right",
                      }}
                      src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMjgwMTE3NDA3MjA2ODExODIyQTlFMUVFRDNDQUZCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxRjQzNTk2MTEyRDQxMUU3QjM2MTk0Q0JCRkMxRUQyMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxRjQzNTk2MDEyRDQxMUU3QjM2MTk0Q0JCRkMxRUQyMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDk0OUYxNEEyQTIwNjgxMTgyMkE5RTFFRUQzQ0FGQkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDI4MDExNzQwNzIwNjgxMTgyMkE5RTFFRUQzQ0FGQkUiLz4gPC9yZGY6RGVzY3Jp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"
                      alt="preview"
                    />
                  </div>
                </div>
              </Space>
            </Form.Item>
            <Form.Item
              // name="自定义选取字段"
              style={{
                marginBottom: 30,
              }}
              label={
                <span
                  style={{
                    width: 150,
                    textAlign: "left",
                  }}
                >
                  自定义选取字段
                </span>
              }
            >
              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <Button
                  type="primary"
                  size="small"
                  style={{
                    marginRight: 30,
                  }}
                >
                  <PlusOutlined />
                  添加字段
                </Button>
                <span>
                  <span
                    style={{
                      color: "#00bcd4",
                    }}
                  >
                    注:&nbsp;
                  </span>
                  不能超过三个字段
                </span>
              </div>
              <div>
                <Tag closable>资产状态</Tag>
                <Tag closable>品牌</Tag>
              </div>
            </Form.Item>

            <Form.Item
              // name="扫描二维码页面展示字段"
              style={{
                marginBottom: 30,
              }}
              label={
                <span
                  style={{
                    width: 150,
                    textAlign: "left",
                  }}
                >
                  扫描二维码页面展示字段
                </span>
              }
            >
              <Button
                type="primary"
                size="small"
                style={{
                  marginBottom: 20,
                }}
              >
                <PlusOutlined />
                添加字段
              </Button>
              <div>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  人员姓名
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  公司
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  部门
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  资产状态
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  资产编码
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  资产名称
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  资产分类
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  品牌
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  型号
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  管理员
                </Tag>
                <Tag
                  style={{
                    marginBottom: 10,
                  }}
                  closable
                >
                  所在位置
                </Tag>
              </div>
            </Form.Item>
            <Form.Item
              // name="标签模板"
              style={{
                marginBottom: 30,
              }}
              label={
                <span
                  style={{
                    width: 150,
                    textAlign: "left",
                  }}
                >
                  设置打印纸类型
                </span>
              }
            >
              <Checkbox.Group options={Options} defaultValue={["标签专用纸"]} />
            </Form.Item>
            <Form.Item
              // name="标签模板"
              style={{
                marginBottom: 30,
              }}
              label={
                <span
                  style={{
                    width: 150,
                    textAlign: "left",
                  }}
                >
                  标签字体大小设置
                </span>
              }
            >
              <InputNumber defaultValue={10} />
              <span
                style={{
                  marginLeft: 20,
                }}
              >
                <span
                  style={{
                    color: "#00bcd4",
                  }}
                >
                  注:&nbsp;
                </span>
                10号字体大小为最佳效果
              </span>
            </Form.Item>
            <Form.Item
              // name="标签模板"
              style={{
                marginBottom: 30,
              }}
              label={
                <span
                  style={{
                    width: 150,
                    textAlign: "left",
                  }}
                >
                  打印预览
                </span>
              }
            >
              <div
                style={{
                  width: 340,
                  height: 144,
                  border: "1px dotted #ddd",
                  padding: "15px 30px",
                }}
              >
                <div
                  style={{
                    boxShadow: "0 0 5px 2px #ddd",
                    width: "100%",
                    height: "100%",
                    padding: 15,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    资产状态
                    <br />
                    品牌
                  </div>
                  <img
                    style={{
                      height: 86,
                      width: 86,
                      float: "right",
                    }}
                    src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMjgwMTE3NDA3MjA2ODExODIyQTlFMUVFRDNDQUZCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxRjQzNTk2MTEyRDQxMUU3QjM2MTk0Q0JCRkMxRUQyMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxRjQzNTk2MDEyRDQxMUU3QjM2MTk0Q0JCRkMxRUQyMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDk0OUYxNEEyQTIwNjgxMTgyMkE5RTFFRUQzQ0FGQkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDI4MDExNzQwNzIwNjgxMTgyMkE5RTFFRUQzQ0FGQkUiLz4gPC9yZGY6RGVzY3Jp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"
                    alt="preview"
                  />
                </div>
              </div>
            </Form.Item>
            <Form.Item
              // name="标签模板"
              style={{
                marginBottom: 30,
                textAlign: "center",
              }}
            // label={
            //   <span
            //     style={{
            //       width: 150,
            //       textAlign: "left",
            //     }}
            //   >
            //     打印预览
            //   </span>
            // }
            >
              <Button type="primary">保存</Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </Box>
  );
};
