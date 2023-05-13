/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import { Space, Modal } from "antd"
import { AntTable } from "components"
import TreeNodeActionDialogContent from "./TreeNodeActionDialogContent"

export default React.memo(({ header, tableData, deleteHandler, updateHandler, topTreeId }) => {
	const column = React.useMemo(() => {
		let c = Object.keys(header).map((header_key) => ({
			title: header[header_key].zh,
			dataIndex: header_key,
			width: header[header_key].width
		}))

		const handleEdit = (row) => {
			let currentPlaceId = row.placeId
			let currentPlaceName = row.placeName
			let placeId = row.parentId
			global.$showModal({
				zIndex: 9998,
				content: (
					<TreeNodeActionDialogContent
						updateHandler={updateHandler}
						type="edit"
						initialFormValues={{ currentPlaceId, currentPlaceName, placeId }}
					/>
				),
				title: `编辑位置`
			})
		}

		const handleDelete = (id) => {
			Modal.confirm({
				title: "警告",
				content: "确认删除位置信息？子位置信息也会一并删除",
				onOk: async () => {
					deleteHandler({ placeId: id }, () => {
						global.$showMessage({
							message: "删除位置成功",
							type: "success"
						})
					})
				}
			})
		}

		c.push({
			title: "操作",
			width: 100,
			render: (text, row) => {
				return (
					<Space>
						{row.placeId !== topTreeId && <a onClick={handleEdit.bind(null, row)}>编辑</a>}
						{row.placeId !== topTreeId && <a onClick={handleDelete.bind(null, row.placeId)}>删除</a>}
					</Space>
				)
			}
		})
		return c
	}, [deleteHandler, header, topTreeId, updateHandler])
	return (
		<div
			style={{
				flexGrow: 1,
				marginLeft: 10,
				height: "calc(100vh - 154px)"
			}}>
			<AntTable
				toolbarProps={{ deleteHandler, updateHandler }}
				rowKey="placeId"
				tableData={tableData}
				column={column}
			/>
		</div>
	)
})
