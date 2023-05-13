import React from "react"
import { Space, Button, Modal } from "antd"
import { PlusOutlined, ImportOutlined } from "@ant-design/icons"
import { Card } from "@material-ui/core"
import TreeNodeActionDialogContent from "./TreeNodeActionDialogContent"
import { HideButtonWithAuth } from "components"

export default React.memo(({ selected, setSelectedRowKeys, deleteHandler, updateHandler, originData }) => {
	const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), [])

	const handleRemove = async () => {
		Modal.confirm({
			title: "警告",
			content: "确认删除组织信息？子组织信息也会一并删除",
			onOk: async () => {
				deleteHandler({ orgId: selectedRowKeys[0] }, () => {
					global.$showMessage({
						message: "删除组织成功",
						type: "success"
					})
					const selected_clone = JSON.parse(JSON.stringify(selected))
					Object.keys(selected_clone).forEach((key) => (selected_clone[key] = []))
					setSelectedRowKeys(selected_clone)
				})
			}
		})
	}
	const handleEdit = () => {
		const row = originData.find((d) => d.orgId === Object.values(selected)[0][0])
		global.$showModal({
			zIndex: 9998,
			content: (
				<TreeNodeActionDialogContent
					updateHandler={updateHandler}
					type="edit"
					initialFormValues={{ currentorgId: row.orgId, currentorgName: row.orgName, orgId: row.parentId }}
				/>
			),
			title: `编辑组织`
		})
	}

	React.useEffect(() => {
		setSelectedRowKeys([])
	}, [originData, setSelectedRowKeys])
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
					<HideButtonWithAuth funcId="jigou_delete">
						<Button
							disabled={selectedRowKeys.length !== 1}
							type="primary"
							icon={<PlusOutlined />}
							onClick={handleRemove}>
							删除组织
						</Button>
					</HideButtonWithAuth>
					<HideButtonWithAuth funcId="jigou_edit">
						<Button
							disabled={selectedRowKeys.length !== 1}
							type="primary"
							icon={<ImportOutlined />}
							onClick={handleEdit}>
							编辑组织
						</Button>
					</HideButtonWithAuth>
				</Space>
			</Card>
		</>
	)
})
