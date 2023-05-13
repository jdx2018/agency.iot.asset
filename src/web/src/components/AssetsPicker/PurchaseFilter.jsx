import React from "react"
import { Table, Space, Button, Pagination } from "antd"
import { Divider, Card } from "@material-ui/core"

import PerfectScrollbar from "react-perfect-scrollbar"

import app_config from "config/app"
import { SearchInput } from "components"
import clientService from "api/clientService"

export default React.memo(({ onAssetPickerComplete }) => {
	const [tableLoading, setTableLoading] = React.useState(false)
	const selectedRef = React.useRef({})
	const [data, setData] = React.useState()
	const dataRef = React.useRef([])
	const dataOriginRef = React.useRef([])
	const [columns, setColumns] = React.useState([])
	const [selectedRowKeys, setSelectedRowKeys] = React.useState([])
	const [current, setCurrent] = React.useState(1)

	const rowSelection = {
		selectedRowKeys,
		type: "radio",
		onChange: (selectedRowKeys, selectedRows) => {
			selectedRef.current[current] = selectedRowKeys
			setSelectedRowKeys(selectedRowKeys)
		}
	}

	React.useEffect(() => {
		;(async () => {
			setTableLoading(true)
			const res = await clientService.bill_purchase.queryBill_paifa()
			setTableLoading(false)
			if (res.code === 1) {
				const header = res.data.header
				const columns = Object.keys(header).map((header_key) => ({
					title: header[header_key].zh,
					dataIndex: header_key,
					width: header[header_key].width
				}))
				setColumns(columns)
				const data = res.data.rows
				dataRef.current = data
				dataOriginRef.current = data
				setData(data.slice(0, 10))
			} else {
				global.$showMessage({
					message: res.message,
					autoHideDuration: 5000,
					type: "error"
				})
			}
		})()
	}, [])

	const filterDataChange = React.useCallback((data) => {
		dataRef.current = data
		setData(data.slice(0, 10))
	}, [])

	const onChange = (page, pageSize) => {
		setCurrent(page)
		setData(dataRef.current.slice((page - 1) * pageSize, page * pageSize))
		selectedRef.current[current] = selectedRowKeys
		if (selectedRef.current[page]) {
			setSelectedRowKeys(selectedRef.current[page])
		}
	}

	const handleFilterDataChange = React.useCallback(
		(data) => {
			filterDataChange(data)
		},
		[filterDataChange]
	)

	const handleCancel = () => global.$hideModal()

	const handleCanfirm = async () => {
		const selectedKeys_ = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), [])
		const res = await clientService.asset.getAssetList_purchase(selectedKeys_[0])
		if (res.code === 1) {
			global.$showMessage({
				type: "success",
				message: `成功关联${res.data.rows.length}条资产数据`
			})
			onAssetPickerComplete(res.data.rows)
			global.$hideModal()
		} else {
			global.$showMessage({
				type: "error",
				message: res.message,
				autoHideDuration: 5000
			})
		}
	}

	const totalSelectedCount = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), []).length
	const tableRowClassName = (record, index) => {
		if (index % 2 === 0) {
			return "bg-f7f8fa"
		}
	}

	const tableMinWidth = React.useMemo(
		() =>
			columns.reduce((acc, cur) => {
				if (cur.width && typeof cur.width === "number") {
					return acc + cur.width
				}
				return acc + app_config.defaultColumnWidth
			}, 0) + 50,
		[columns]
	)

	return (
		<>
			<Space
				style={{
					marginBottom: 10
				}}>
				<SearchInput data={dataOriginRef.current} columns={columns} onFilterDataChange={handleFilterDataChange} />
				{/* <Checkbox>保留查询结果</Checkbox> */}
			</Space>
			<Card
				style={{
					boxShadow: "none",
					// padding: 5,
					border: "1px solid #f0f0f0",
					marginBottom: 10
				}}>
				<PerfectScrollbar style={{ width: "100%", height: 400 }}>
					<div
						style={{
							minWidth: tableMinWidth
						}}>
						<Table
							loading={tableLoading}
							sticky
							rowKey="billNo"
							rowClassName={tableRowClassName}
							size="middle"
							rowSelection={rowSelection}
							pagination={false}
							columns={columns}
							dataSource={data}
						/>
					</div>
				</PerfectScrollbar>
			</Card>
			<div
				style={{
					// padding: 10,
					paddingLeft: 10,
					paddingRight: 10,
					boxShadow: "none",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 10
				}}>
				<div>
					共&nbsp;
					<span
						style={{
							fontSize: 16,
							color: "#00bcd4",
							backgroundColor: "#fff!important"
						}}>
						{dataRef.current.length}&nbsp;
					</span>
					条数据，当前选中&nbsp;
					<span
						style={{
							fontSize: 16,
							color: "#00bcd4"
						}}>
						{totalSelectedCount}
					</span>
					&nbsp; 条
				</div>
				<div>
					<Pagination
						showSizeChanger={false}
						defaultPageSize={10}
						onChange={onChange}
						current={current}
						total={dataRef.current.length}
					/>
				</div>
			</div>
			<Divider />
			<div
				style={{
					marginTop: 10,
					textAlign: "right"
				}}>
				<Space>
					<Button type="primary" onClick={handleCanfirm}>
						确定
					</Button>
					<Button onClick={handleCancel}>取消</Button>
				</Space>
			</div>
		</>
	)
})
