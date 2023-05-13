import React from "react"
import { AntTable } from "components"
import TableContentToolbar from "./TableContentToolbar"

export default React.memo(({ header, tableData, deleteHandler, updateHandler }) => {
	return (
		<div
			style={{
				flexGrow: 1,
				marginLeft: 10,
				height: "calc(100vh - 166px)"
			}}>
			<AntTable
				toolbarProps={{ deleteHandler, updateHandler }}
				rowKey="orgId"
				useRowSelect={true}
				TableToolbar={TableContentToolbar}
				// height="calc(100vh - 188px)"
				tableData={tableData}
				column={Object.keys(header).map((header_key) => ({
					title: header[header_key].zh,
					dataIndex: header_key,
					width: header[header_key].width
				}))}
			/>
		</div>
	)
})
