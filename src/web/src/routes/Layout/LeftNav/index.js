import React, { createElement, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useHistory, useLocation } from "react-router-dom";
import appConfig from "config/app";
import { getTreeFromFlatData } from "react-sortable-tree";
import { getPageData } from "utils/auth";

import { Menu } from 'antd';

import { AntIcons } from 'components'

const { SubMenu } = Menu;


const menuRender = (menu) => {
  return menu.children ? <SubMenu
    key={menu.id}
    title={
      <span>
        {AntIcons[menu.pageName] ? createElement(AntIcons[menu.pageName]) : null}
        <span>{menu.pageDesc}</span>
      </span>
    }
  >
    {
      menu.children.map(child => child.children ? child.children.map(c_child => menuRender(c_child)) : <Menu.Item key={child.id}><span>
        {AntIcons[child.pageName] ? createElement(AntIcons[child.pageName]) : null}
        <span>{child.pageDesc}</span>
      </span></Menu.Item>)
    }
  </SubMenu> : <Menu.Item key={menu.id}><span>
    {AntIcons[menu.pageName] ? createElement(AntIcons[menu.pageName]) : null}
    <span>{menu.pageDesc}</span>
  </span></Menu.Item>
}

function LeftNav({ originMenuData, loginSuccess }) {

  const [selectedKeys, setSelectedKeys] = useState([])
  const [openKeys, setOpenKeys] = useState([])

  const location = useLocation();
  const history = useHistory()
  const { pathname } = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const menuList = getTreeFromFlatData({
    flatData: originMenuData,
    getKey: (node) => node.pageId,
    getParentKey: (node) => node.parentId,
    rootKey: "0",
  })

  const handleMenuOpenChange = (openKeys) => {
    setOpenKeys(openKeys)
  }

  const handleMenuSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    setSelectedKeys(selectedKeys)
    const nextPage = originMenuData.find(o_menu => String(o_menu.id) === key)
    history.push(`/${nextPage.componentName}`)
  }


  useEffect(() => {
    const currentPage = originMenuData.find(o_menu => o_menu.pageName === pathname.slice(1))
    if (currentPage) {
      setSelectedKeys(currentPage ? [String(currentPage.id)] : [])
      setOpenKeys(originMenuData.reduce((acc, cur) => cur.pageId === currentPage.parentId ? [...acc, String(cur.id)] : acc, []))
    }
  }, [originMenuData, pathname])


  useEffect(() => {
    const currentMenu = originMenuData.filter((menu) => menu.componentName && `/${menu.componentName}` === pathname);
    if (currentMenu.length > 0) {
      document.title = currentMenu[0].pageDesc + " - " + appConfig.title;
    } else {
      document.title = appConfig.title;
    }
  }, [originMenuData, pathname]);

  useEffect(() => {
    if (originMenuData.length === 0 && getPageData()) {
      loginSuccess()
      if (from.pathname !== location.pathname) {
        history.push(location.pathname)
      } else {
        history.push(from.pathname)
      }
    }
  }, [from.pathname, history, location.pathname, loginSuccess, originMenuData])

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 48px)",
          backgroundColor: "#3b4966",
        }}
      >
        <PerfectScrollbar>
          <Menu
            style={{
              backgroundColor: '#3B4A66',
              color: '#b3bed5',
              width: '100%',
              height: "100%"
            }}
            forceSubMenuRender
            onOpenChange={handleMenuOpenChange}
            onSelect={handleMenuSelect}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            mode="inline"
          >
            {menuList?.map(menu => menuRender(menu))}
          </Menu>
        </PerfectScrollbar>
      </div>
    </div>
  );
}

export default LeftNav;
