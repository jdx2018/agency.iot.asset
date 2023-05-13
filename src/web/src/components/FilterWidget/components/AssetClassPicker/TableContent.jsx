/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react"
import { AntTable } from "components"
import { StyleContext } from "./style-context"

export default React.memo(({ header, tableData, onSelectedChange }) => {
	const { height } = useContext(StyleContext)
	const column = React.useMemo(() => {
		let c = Object.keys(header).map((header_key) => ({
			title: header[header_key].zh,
			dataIndex: header_key,
			width: header[header_key].width
		}))
		return c
	}, [header])
	return (
		<div
			style={{
				height: height - 40,
				width: "100%",
				marginLeft: 10
			}}>
			<AntTable
				onSelectedChange={(selectedKeys) => onSelectedChange(selectedKeys[0])}
				rowKey="classId"
				useRowSelect={true}
				extraRowSelection={{ type: "radio" }}
				tableData={tableData}
				column={column}
			/>
		</div>
	)
})
