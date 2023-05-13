/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react"
import { Space, Button, Modal } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined, AlignLeftOutlined } from "@ant-design/icons"
import { Card } from "@material-ui/core"
import TableActionDialog from "./TableActionDialog"
import { SearchInput, ColumnMenuSwitch, ToggleAllBtn, RefreshBtn, AdvanSearch, HideButtonWithAuth } from "components"

export default React.memo(
	({
		selected,
		setSelectedRowKeys,
		filterData,
		deleteHandler,
		updateHandler,
		addHandler,
		originData,
		columns,
		setColumn,
		setFilterData,
		refreshData,
		pageSize,
		filterConfig
		// onTableDataChange,
	}) => {
		const [open, setOpen] = useState(false)
		const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), [])
		const handleAdd = () => {
			global.$showModal({
				zIndex: 9998,
				width: 948,
				content: <TableActionDialog addHandler={addHandler} type="create" />,
				title: `新增耗材`
			})
		}

		const handleRemove = async () => {
			Modal.confirm({
				title: "警告",
				content: "确认删除耗材信息？",
				onOk: async () => {
					deleteHandler({ materialId: selectedRowKeys[0] }, () => {
						global.$showMessage({
							message: "删除耗材成功",
							type: "success"
						})
						const selected_clone = JSON.parse(JSON.stringify(selected))
						Object.keys(selected_clone).forEach((key) => (selected_clone[key] = []))
						setSelectedRowKeys(selected_clone)
					})
				},
				noDialogActions: true
			})
		}
		const handleEdit = () => {
			const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), [])
			const row = originData.find((d) => selectedRowKeys.includes(d.materialId))
			global.$showModal({
				width: 948,
				zIndex: 9998,
				content: <TableActionDialog updateHandler={updateHandler} type="edit" initialFormValues={row} />,
				title: `编辑耗材`
			})
		}

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
						marginBottom: 10,
						padding: 10,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						boxShadow: "none"
					}}>
					<Space size={10}>
						<HideButtonWithAuth funcId="haocai_add">
							<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
								新增耗材
							</Button>
						</HideButtonWithAuth>
						<HideButtonWithAuth funcId="haocai_delete">
							<Button
								disabled={selectedRowKeys.length !== 1}
								type="primary"
								icon={<DeleteOutlined />}
								onClick={handleRemove}>
								删除耗材
							</Button>
						</HideButtonWithAuth>
						<HideButtonWithAuth funcId="haocai_edit">
							<Button
								disabled={selectedRowKeys.length !== 1}
								type="primary"
								icon={<EditOutlined />}
								onClick={handleEdit}>
								编辑耗材
							</Button>
						</HideButtonWithAuth>
					</Space>
					<Space size={10}>
						<ToggleAllBtn
							originDataWithKey={filterData.map((v) => v.materialId)}
							setSelectedRowKeys={setSelectedRowKeys}
							pageSize={pageSize}
						/>
						<SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
						<ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
						<a onClick={() => setOpen(true)}>
							<AlignLeftOutlined /> <span style={{ userSelect: "none" }}>高级筛选</span>
						</a>
						<RefreshBtn refreshData={refreshData} />
					</Space>
				</Card>
				<AdvanSearch
					formConfg={filterConfig}
					open={open}
					closeDrawer={() => setOpen(false)}
					valuesChange={handleValuesChange}
				/>
			</>
		)
	}
)
