import React from "react"
import LeftTree from "./LeftTree"
import TableContent from "./TableContent"
import { Box } from "@material-ui/core"

import clientService from "api/clientService"

export default ({ onChange }) => {
	const [selectedKeys, setSelectedKeys] = React.useState([])

	const [classFlatData, setClassFlatData] = React.useState([])

	const [tableContentData, setTableContentData] = React.useState([])

	const [tableContentHeader, setTableContentHeader] = React.useState([])

	const classListRef = React.useRef([])
	const filterClassListRef = React.useRef([])

	const refreshData = React.useCallback(async () => {
		const res = await clientService.assetClass.getAssetClass_all()
		if (res.code === 1) {
			classListRef.current = res.data.rows
			filterClassListRef.current = res.data.rows

			setTableContentHeader(res.data.header)

			setClassFlatData(
				res.data.rows.map((nodeData) => ({ key: nodeData.classId, title: nodeData.className, ...nodeData }))
			)
		} else {
			global.$showMessage({
				message: res.message,
				type: "error",
				autoHideDuration: 5000
			})
		}
	}, [])

	const handleTreeChange = ({ type, data }) => {
		if (type === "select") {
			setSelectedKeys(data)
			if (data.length === 0) {
				setTableContentData(filterClassListRef.current)
				return
			}
			onChange(data[0])
			setTableContentData(data.length === 0 ? [] : classListRef.current.filter((class_) => class_.parentId === data[0]))
		} else if (type === "search") {
			if (data.length === 0) {
				setTableContentData(filterClassListRef.current)
				return
			}
			setTableContentData(
				data.length === 0 ? [] : classListRef.current.filter((class_) => data.includes(class_.classId))
			)
		} else {
			throw new Error("no such type")
		}
	}

	React.useEffect(() => {
		refreshData()
	}, [refreshData])

	return (
		<Box p={1}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between"
				}}>
				<LeftTree classFlatData={classFlatData} selectedKeys={selectedKeys} onChange={handleTreeChange} />
				<TableContent onSelectedChange={onChange} header={tableContentHeader} tableData={tableContentData} />
			</div>
		</Box>
	)
}
