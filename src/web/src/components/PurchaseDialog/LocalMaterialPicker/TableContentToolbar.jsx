import React from "react"
import { Space } from "antd"
import { Card } from "@material-ui/core"
import { SearchInput } from "components"

export default React.memo(({ originData, columns, setFilterData }) => {
	return (
		<>
			<Card
				style={{
					padding: 10,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					boxShadow: "none"
				}}>
				<Space size={10}>
					<SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
				</Space>
			</Card>
		</>
	)
})
