import React from "react"
import { AntTable } from "components"
import TableContentToolbar from "./TableContentToolbar"

export default React.memo(
	({ header, tableData, deleteHandler, updateHandler, addHandler, isSearchAll, onSearchAllCheckboxChange }) => {
		return (
			<div
				style={{
					flexGrow: 1,
					marginLeft: 10,
					height: "calc(100vh - 166px)"
				}}>
				<AntTable
					toolbarProps={{ deleteHandler, updateHandler, addHandler, isSearchAll, onSearchAllCheckboxChange }}
					rowKey="employeeId"
					useRowSelect={true}
					TableToolbar={TableContentToolbar}
					// height="calc(100vh - 158px)"
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
