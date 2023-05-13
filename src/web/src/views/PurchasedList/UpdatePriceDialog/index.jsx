import React, { useState } from "react"
import { Button } from "antd"
import { EditOutlined } from "@ant-design/icons"
import ActionDialog from "./ActionDialog"
import clientService from "api/clientService"

const UpdatePriceDialog = ({ selectedKeys, refreshData }) => {
	const [dataConfigCanUpdatePrice, setDataConfigCanUpdatePrice] = useState(null)
	const [open, setOpen] = useState(false)

	return (
		<>
			<Button
				// loading={!!dataConfigCanUpdatePrice}
				disabled={selectedKeys.length !== 1}
				icon={<EditOutlined />}
				onClick={async () => {
					setDataConfigCanUpdatePrice(null)
					const assetRes = clientService.bill_purchase.getAssetList_forPriceUpdate(selectedKeys[0])
					const materialRes = clientService.bill_purchase.getMaterialList_forPriceUpdate(selectedKeys[0])
					Promise.all([assetRes, materialRes]).then((resArr) => {
						console.log(resArr)
						const isAllComplete = resArr.every((item) => item.code === 1)
						if (isAllComplete) {
							const data = {
								assetListConfig: resArr[0].data,
								materialListConfig: resArr[1].data
							}
							setDataConfigCanUpdatePrice(data)
							setOpen(true)
						} else {
							global.$showMessage({
								type: "error",
								message: "准备数据获取失败"
							})
						}
					})
				}}>
				修改价格
			</Button>
			<ActionDialog
				data={dataConfigCanUpdatePrice}
				open={open}
				closeDialog={() => {
					setOpen.call(null, false)
					refreshData()
				}}
			/>
		</>
	)
}

export default UpdatePriceDialog
