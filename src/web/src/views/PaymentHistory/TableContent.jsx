/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react"
import { AntTable } from "components"
import TableContentToolbar from "./TableContentToolbar"
import { PurchaseDialog } from "components"
import clientService from "api/clientService"
import { Modal } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { Scrollbars } from "react-custom-scrollbars"

export default React.memo(({ header, tableData, refreshData }) => {
	const [open, setOpen] = useState(false)
	const [dialogData, setDialogData] = useState(null)

	const getColumns = () =>
		Object.keys(header).map((header_key) => {
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
								const res = await clientService.bill_purchase.queryBillDetail(text)
								if (res.code === 1) {
									setDialogData({ ...res.data, title: `采购单-${text}` })
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

	return (
		<div
			style={{
				flexGrow: 1,
				marginLeft: 10,
				height: "calc(100vh - 164px)"
			}}>
			<AntTable
				rowKey="billNo"
				useRowSelect={true}
				toolbarProps={{ refreshData }}
				TableToolbar={TableContentToolbar}
				// height="calc(100vh - 158px)"
				tableData={tableData}
				column={getColumns()}
			/>
			<Modal
				onCancel={() => setOpen(false)}
				destroyOnClose
				width={"948px"}
				footer={null}
				closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
				title={
					<span
						style={{
							fontSize: 16,
							color: "#fff"
						}}>
						采购单
					</span>
				}
				visible={open}>
				<Scrollbars
					style={{
						height: "62vh"
					}}>
					<PurchaseDialog type="detail" dialogData={dialogData} open={open} closeDialog={() => setOpen(false)} />
				</Scrollbars>
			</Modal>
		</div>
	)
})
