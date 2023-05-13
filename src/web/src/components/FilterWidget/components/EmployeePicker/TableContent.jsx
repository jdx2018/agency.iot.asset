import React, { useContext } from "react"
import { AntTable } from "components"
import TableContentToolbar from "./TableContentToolbar"
import { StyleContext } from "./style-context"

export default React.memo(
	({
		header,
		tableData,
		deleteHandler,
		updateHandler,
		addHandler,
		isSearchAll,
		onSearchAllCheckboxChange,
		onSelectedChange
	}) => {
		const { height } = useContext(StyleContext)
		return (
			<div
				style={{
					height: height - 100,
					width: "100%",
					marginLeft: 10
				}}>
				<AntTable
					onSelectedChange={onSelectedChange}
					extraRowSelection={{ type: "radio" }}
					toolbarProps={{ deleteHandler, updateHandler, addHandler, isSearchAll, onSearchAllCheckboxChange }}
					rowKey="employeeId"
					useRowSelect={true}
					TableToolbar={TableContentToolbar}
					tableData={tableData}
					column={Object.keys(header).map((header_key) => ({
						title: header[header_key].zh,
						dataIndex: header_key,
						width: header[header_key].width
					}))}
				/>
			</div>
		)
	}
)
