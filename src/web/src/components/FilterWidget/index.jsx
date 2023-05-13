import { createElement } from 'react'
import EmployeePicker from './components/EmployeePicker'
import SupportPicker from './components/SupportPicker'
import AssetClassPicker from './components/AssetClassPicker'
import AssetPlacePicker from './components/AssetPlacePicker'
import OrgPicker from './components/OrgPicker'

const filterWidgetList = {
  employeePicker: EmployeePicker,
  supplierPicker: SupportPicker,
  assetClassPicker: AssetClassPicker,
  assetPlacePicker: AssetPlacePicker,
  orgPicker: OrgPicker
}


const FilterWidget = ({ widgetConfig, onChange }) => {
  return widgetConfig ? createElement(filterWidgetList[widgetConfig.widgetName], { onChange }) : null
}

export default FilterWidget