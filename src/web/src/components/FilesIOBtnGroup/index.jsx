import React from 'react'
import dayjs from 'dayjs'
import { Dropdown, Button, Menu } from 'antd'
import {
  ExportOutlined,
  DownOutlined,
  DownloadOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  SelectOutlined,
} from '@ant-design/icons'
import { exportExcelWithManySheet, analysisUploadExcel } from 'utils/common'

export default React.memo(
  ({ template = {}, data = { filterData: [], selectedData: [], originData: [] }, afterResolvedSuccess = () => {} }) => {
    const { filterData, selectedData, originData } = data
    const isEnableExport = template.hasOwnProperty('export')
    const isEnableImport = template.hasOwnProperty('import')

    const handleMenuClick = (target) => {
      switch (target.key) {
        case '1':
          exportExcelWithManySheet({
            excelName: `模板`,
            sheetsConfig: [{data: [], template: template.import, sheetName: "模板"}]
          })
          return
        case '2':
          analysisUploadExcel(afterResolvedSuccess, {
            template: template.import,     
          })
          return
        case '3':
          exportExcelWithManySheet({
            excelName: `导出查询结果-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
            sheetsConfig: [{data: filterData, template: template.export}]
          })
          return
        case '4':
          exportExcelWithManySheet({
            excelName: `导出选中项-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
            sheetsConfig: [{data: selectedData, template: template.export}]
          })
          return
        case '5':
          exportExcelWithManySheet({
            excelName: `导出全部-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
            sheetsConfig: [{data: originData, template: template.export}]
          })
          return
        default:
          return
      }
    }
    const menu = (
      <Menu onClick={handleMenuClick}>
        {isEnableImport && (
          <Menu.Item key='1' icon={<DownloadOutlined />}>
            下载导入模板
          </Menu.Item>
        )}
        {isEnableImport && (
          <Menu.Item key='2' icon={<FileAddOutlined />}>
            批量导入
          </Menu.Item>
        )}
        {isEnableImport && <Menu.Divider />}
        {isEnableExport && !!selectedData && Array.isArray(selectedData) && (
          <Menu.Item key='4' icon={<SelectOutlined />}>
            导出选中项({selectedData.length})
          </Menu.Item>
        )}
        {isEnableExport && !!originData && Array.isArray(originData) && (
          <Menu.Item key='5' icon={<ExportOutlined />}>
            导出全部
          </Menu.Item>
        )}
        {isEnableExport && !!filterData && Array.isArray(filterData) && (
          <Menu.Item key='3' icon={<FileSearchOutlined />}>
            导出查询结果
          </Menu.Item>
        )}
      </Menu>
    )

    return (
      <Dropdown overlay={menu}>
        <Button>
          导入/导出 <DownOutlined />
        </Button>
      </Dropdown>
    )
  }
)
