/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react"
import TableToolbar from "./TableToolbar"
import { AntTable } from "components"
import { Box } from "@material-ui/core"

import { PurchaseDialog } from "components"
import clientService from "api/clientService"

const BILL_TITLE = "采购"

export default React.memo(() => {
	const [column, setColumn] = useState([])
	const [tableData, setTableData] = useState([])
	const [loading, setLoading] = useState(false)
	const [filterConfig, setFilterConfig] = useState({})
	const [open, setOpen] = useState(false)
	const [dialogData, setDialogData] = useState({ billMain: {}, billDetail: {} })
	const filterRef = React.useRef(null)

	const [getMaterialListFunc, setGetMaterialListFunc] = React.useState(null)
	const [formType, setFormType] = React.useState("create")
	const [billDetail, setBillDetail] = React.useState(null)

	const [addBtnLoading, setAddBtnLoading] = React.useState(false)
	const [editBtnLoading, setEditBtnLoading] = React.useState(false)

	const [selectedRowKeys, setSelectedRowKeys] = React.useState([])

	const refreshData = React.useCallback(async (filter = null) => {
		let f = null
		if (!filter) {
			f = filterRef.current
		} else if (JSON.stringify(filter) === "{}") {
			filterRef.current = null
			f = filterRef.current
		} else {
			filterRef.current = filter
			f = filterRef.current
		}
		setLoading(true)
		const filter_ = JSON.parse(JSON.stringify(f))
		const res = await clientService.bill_purchase.queryBill(filter_)
		setLoading(false)
		if (res.code === 1) {
			const header = res.data.header
			const column = Object.keys(header).map((header_key) => {
				const column_ = {
					title: header[header_key].zh,
					dataIndex: header_key,
					width: header[header_key].width
				}
				if (header_key === "billNo") {
					column_.render = (text, row, index) => {
						return (
							<a
								onClick={async () => {
									setOpen(true)
									setFormType("detail")
									const res = await clientService.bill_purchase.queryBillDetail(text)
									if (res.code === 1) {
										setDialogData(res.data)
									} else {
										global.$showMessage({
											message: res.message,
											type: "error",
											autoHideDuration: 5000
										})
									}
								}}>
								{text}
							</a>
						)
					}
				}
				return column_
			})
			setColumn(column)
			setTableData(res.data.rows)
			setFilterConfig(res.data.filter)
		} else {
			global.$showMessage({
				message: res.message,
				type: "error",
				autoHideDuration: 5000
			})
		}
	}, [])

	const handleCloseDialog = React.useCallback(
		(isRefresh = false) => {
			setOpen(false)
			if (isRefresh) {
				refreshData()
			}
		},
		[refreshData]
	)

	const handleCreate = async () => {
		setAddBtnLoading(true)
		const res = await clientService.bill_purchase.getBillMainTemplate()
		setAddBtnLoading(false)
		setFormType("create")
		setOpen(true)
		if (res.code === 1) {
			setDialogData(res.data)
			setBillDetail(res.data.billDetail)
			setGetMaterialListFunc(res.method)
		} else {
			global.$showMessage({
				message: res.message,
				autoHideDuration: 5000,
				type: "error"
			})
		}
	}

	const handleEdit = async () => {
		setEditBtnLoading(true)
		const res = await clientService.bill_purchase.queryBillDetail(selectedRowKeys[0])
		setEditBtnLoading(false)
		setFormType("edit")
		setOpen(true)
		if (res.code === 1) {
			setDialogData(res.data)
			// setGetMaterialListFunc(res.method)
		} else {
			global.$showMessage({
				message: res.message,
				autoHideDuration: 5000,
				type: "error"
			})
		}
	}

	const updateSelectedRowKeys = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys)
	}

	return (
		<Box
			p={1}
			style={{
				height: "calc(100% - 76px)"
			}}>
			{!open ? (
				<AntTable
					billTitle={BILL_TITLE}
					loading={loading}
					rowKey="billNo"
					useRowSelect={true}
					column={column}
					TableToolbar={TableToolbar}
					tableData={tableData}
					filterConfig={filterConfig}
					toolbarProps={{ refreshData, addBtnLoading, editBtnLoading, handleCreate, handleEdit, updateSelectedRowKeys }}
				/>
			) : null}
			<PurchaseDialog
				billTitle={BILL_TITLE}
				dialogData={dialogData}
				open={open}
				closeDialog={handleCloseDialog}
				billDetail={billDetail}
				getMaterialListFunc={getMaterialListFunc}
				type={formType}
				selectedRowKey={selectedRowKeys}
			/>
		</Box>
	)
})
