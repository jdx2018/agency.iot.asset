import React from "react"
import LeftTree from "./LeftTree"
import TableContent from "./TableContent"
import { Box } from "@material-ui/core"

import clientService from "api/clientService"

export default ({ onChange }) => {
	const [selectedKeys, setSelectedKeys] = React.useState([])

	const [placeFlatData, setPlaceFlatData] = React.useState([])

	const [tableContentData, setTableContentData] = React.useState([])

	const [tableContentHeader, setTableContentHeader] = React.useState([])

	const placeListRef = React.useRef([])
	const filterPlaceListRef = React.useRef([])

	const refreshData = React.useCallback(async () => {
		const res = await clientService.assetPlace.getPlaceList_all()
		if (res.code === 1) {
			placeListRef.current = res.data.rows
			filterPlaceListRef.current = res.data.rows

			setTableContentHeader(res.data.header)

			setPlaceFlatData(
				res.data.rows.map((nodeData) => ({ key: nodeData.placeId, title: nodeData.placeName, ...nodeData }))
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
				setTableContentData(filterPlaceListRef.current)
				return
			}
			onChange(data[0])
			setTableContentData(data.length === 0 ? [] : placeListRef.current.filter((place_) => place_.parentId === data[0]))
		} else if (type === "search") {
			if (data.length === 0) {
				setTableContentData(filterPlaceListRef.current)
				return
			}
			setTableContentData(
				data.length === 0 ? [] : placeListRef.current.filter((place_) => data.includes(place_.placeId))
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
				<LeftTree placeFlatData={placeFlatData} selectedKeys={selectedKeys} onChange={handleTreeChange} />
				<TableContent onSelectedChange={onChange} header={tableContentHeader} tableData={tableContentData} />
			</div>
		</Box>
	)
}
