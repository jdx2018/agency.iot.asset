/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import { Space, Button } from "antd"
import { PrinterOutlined, AlignLeftOutlined } from "@ant-design/icons"
import { Card } from "@material-ui/core"

import { PrintDialog } from "components"

import { ColumnMenuSwitch, SearchInput, ToggleAllBtn, RefreshBtn, AdvanSearch } from "components"

export default React.memo(
	({
		originData,
		filterData,
		columns,
		setColumn,
		setFilterData,
		refreshData,
		selected,
		setSelectedRowKeys,
		filterConfig,
		pageSize
	}) => {
		const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), [])
		const mapObj = {}
		originData.forEach((item) => {
			mapObj[item.assetId] = item
		})
		const selectedRows = selectedRowKeys.map((_) => mapObj[_])
		const [open, setOpen] = React.useState(false)
		const [drawerOpen, setDrawerOpen] = React.useState(false)

		const handleOpenDrawer = () => {
			setDrawerOpen(true)
		}

		const handleCloseDrawer = React.useCallback(() => {
			setDrawerOpen(false)
		}, [])

		const handlePrintTag = () => {
			setOpen(true)
		}

		const handleCloseDialog = React.useCallback(
			(isRefresh = false) => {
				setOpen(false)
				if (isRefresh) {
					refreshData()
				}
			},
			[refreshData]
		)

		const handleValuesChange = React.useCallback(
			(filters) => {
				refreshData(filters)
			},
			[refreshData]
		)

		return (
			<>
				<Card
					style={{
						marginTop: 10,
						marginBottom: 10,
						padding: 10,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						boxShadow: "none"
					}}>
					<Space size={10}>
						<Button
							type="primary"
							icon={<PrinterOutlined />}
							onClick={handlePrintTag}
							disabled={selectedRowKeys.length === 0}>
							标签打印
						</Button>
					</Space>

					<Space>
						<ToggleAllBtn
							originDataWithKey={filterData.map((v) => v.assetId)}
							setSelectedRowKeys={setSelectedRowKeys}
							pageSize={pageSize}
						/>
						<SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
						<ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
						<a onClick={handleOpenDrawer}>
							<AlignLeftOutlined /> <span style={{ userSelect: "none" }}>高级筛选</span>
						</a>
						<RefreshBtn refreshData={refreshData} />
					</Space>
				</Card>
				<AdvanSearch
					formConfg={filterConfig}
					open={drawerOpen}
					closeDrawer={handleCloseDrawer}
					valuesChange={handleValuesChange}
				/>
				<PrintDialog selectedRows={selectedRows} open={open} closeDialog={handleCloseDialog} />
			</>
		)
	}
)
