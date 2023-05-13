import React from "react";
import { Avatar } from "@material-ui/core";
import { Block } from "components/style";
import { getUserinfo } from "utils/auth";

const personInfo = getUserinfo();

const Enum = {
  userId: {
    label: "用户ID",
    icon: "icon-ic-alphabetical-sorting-za",
  },
  fullName: {
    label: "OA用户名",
    icon: "icon-ic-manager",
  },
  userName: {
    label: "用户名",
    icon: "icon-ic-businessman",
  },
  // SEX: {
  //   label: "性别",
  //   icon: "icon-ic-decision",
  // },
  telNo: {
    label: "电话号码",
    icon: "icon-ic-phone",
  },
  mobile: {
    label: "手机号码",
    icon: "icon-ic-iphone",
  },
  email: {
    label: "邮箱",
    icon: "icon-ic-invite",
  },
};

// const Enum = {
//   USERSN: {
//     label: "用户编号",
//     icon: "icon-ic-alphabetical-sorting-za",
//   },
//   CMBCOANAME: {
//     label: "OA用户名",
//     icon: "icon-ic-manager",
//   },
//   SN: {
//     label: "用户名",
//     icon: "icon-ic-businessman",
//   },
//   SEX: {
//     label: "性别",
//     icon: "icon-ic-decision",
//   },
//   TELEPHONENUMBER: {
//     label: "电话号码",
//     icon: "icon-ic-phone",
//   },
//   MOBILE: {
//     label: "手机号码",
//     icon: "icon-ic-iphone",
//   },
//   MAIL: {
//     label: "邮箱",
//     icon: "icon-ic-invite",
//   },
// };

export default () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 75px)",
      }}
    >
      <Block width="500px" height="400px">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Avatar
            style={{
              width: 80,
              height: 80,
              marginTop: 15,
            }}
          >
            {personInfo.userName}
          </Avatar>
        </div>
        <div
          style={{
            width: "60%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 400,
              marginTop: 15,
              color: "#454545",
            }}
          >
            {personInfo.SN}
          </div>
          {Object.keys(Enum).map((key) => (
            <div
              key={key}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                fontWeight: 400,
                marginTop: 10,
              }}
            >
              <div>
                <svg
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                  className="icon"
                  aria-hidden="true"
                >
                  <use xlinkHref={"#" + Enum[key].icon}></use>
                </svg>
                <span style={{ color: "#9e9e9e" }}>
                  {" " + Enum[key].label}
                </span>
              </div>
              <span
                style={{
                  color: "#ccc",
                }}
              >
                {personInfo[key]}
              </span>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
};
