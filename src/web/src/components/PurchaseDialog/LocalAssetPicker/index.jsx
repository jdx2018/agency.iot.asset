import React, { useState, useEffect, useRef, memo, useMemo } from "react"

import { Button, Space, Table, Pagination, Modal } from "antd"

import { Card } from "@material-ui/core"

import PerfectScrollbar from "react-perfect-scrollbar"

import LocalAssetPickerDialogContent from "./LocalAssetPickerDialogContent"

import app_config from "config/app"

import _ from "lodash"

const chunkobj2list = (chunkobj) => {
	return Object.values(chunkobj).reduce((acc, cur) => acc.concat(cur), [])
}

export default memo(({ value, type, onChange, pickerConfig = null }) => {
	const selectedRef = useRef({})
	const dataRef = useRef([])
	const [data, setData] = useState([])
	const [columns, setColumns] = useState([])

	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [pageSize, setPageSize] = useState(10)
	const [current, setCurrent] = useState(1)
	const curAction = useRef(null)

	// const [drawerVisible, setDrawerVisible] = useState(false)

	const notinSelectedKeysRef = useRef([])

	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedRowKeys, selectedRows) => {
			selectedRef.current[current] = selectedRowKeys
			setSelectedRowKeys(selectedRef.current[current])
			notinSelectedKeysRef.current = dataRef.current
				.filter((_) => !chunkobj2list(selectedRef.current).includes(_.assetId))
				.map((_) => _.assetId)
			onChange(dataRef.current.filter((_) => chunkobj2list(selectedRef.current).includes(_.assetId)))
		}
	}

	const tableMinWidth = useMemo(
		() =>
			columns.reduce((acc, cur) => {
				if (cur.width && typeof cur.width === "number") {
					return acc + cur.width
				}
				return acc + app_config.defaultColumnWidth
			}, 0) + 50,
		[columns]
	)
	const isDisableRemoveBtn = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), []).length === 0
	const tableRowClassName = (record, index) => {
		if (index % 2 === 0) {
			return "bg-f7f8fa"
		}
	}
	const totalSelectedCount = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), []).length

	const handleAddAsset = (asset) => {
		if (curAction.current !== null) {
			dataRef.current = dataRef.current.filter((v) => v.assetId !== curAction.current)
		}
		dataRef.current = [...dataRef.current, { ...asset, assetId: dataRef.current.length++ }]
		console.log(dataRef.current)
		setData(dataRef.current.slice((current - 1) * pageSize, current * pageSize))
		if (curAction.current !== null) {
			onChange(dataRef.current.filter((_) => chunkobj2list(selectedRef.current).includes(_.assetId)))
		}
		// selectedRef.current[current] = [...selectedRef.current[current], assetId]
		// setSelectedRowKeys(selectedRef.current[current])
	}

	const onPageChange = (page, pageSize) => {
		setCurrent(page)
		setData(dataRef.current.slice((page - 1) * pageSize, page * pageSize))
		if (selectedRef.current[page]) {
			setSelectedRowKeys(selectedRef.current[page])
		}
	}

	useEffect(() => {
		if (value) {
			dataRef.current = value
			setData(dataRef.current.slice(0, pageSize))
		}
	}, [pageSize])

	useEffect(() => {
		;(async () => {
			if (pickerConfig) {
				let header
				header = pickerConfig.header
				if (header) {
					const columns = Object.keys(header).map((header_key) => ({
						title: header[header_key].zh,
						dataIndex: header_key,
						width: header[header_key].width
					}))
					setColumns(columns)
				}
			}
		})()
	}, [pickerConfig])

	useEffect(() => {
		//TODO
		if (pickerConfig && pickerConfig.rows) {
			dataRef.current = pickerConfig.rows.slice()
			dataRef.current.forEach((v, index) => {
				v.assetId = index + 10000
			})
			setData(dataRef.current.slice((current - 1) * pageSize, current * pageSize))
			let obj = {}
			_.chunk(
				dataRef.current.map((v) => v.assetId),
				20
			).forEach((v, index) => {
				obj[index + 1] = v
			})
			selectedRef.current = obj
			setSelectedRowKeys(selectedRef.current[current] ? selectedRef.current[current] : [])
		}
	}, [pageSize, pickerConfig, type])

	useEffect(() => {
		if (type === "create") {
			dataRef.current = []
			setData(dataRef.current.slice(0, pageSize))
		}
	}, [pageSize, type])
	return (
		<>
			{type !== "detail" && (
				<Space
					spacing={8}
					style={{
						marginBottom: 10,
						marginTop: 10
					}}>
					<Button
						type="primary"
						onClick={() => {
							curAction.current = null
							global.$showModal({
								zIndex: 9998,
								content: <LocalAssetPickerDialogContent onAddAsset={handleAddAsset} />,
								title: "新增资产",
								width: "948px"
							})
						}}>
						添加
					</Button>
					<Button
						type="primary"
						disabled={Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), []).length !== 1}
						onClick={() => {
							const cur_id = chunkobj2list(selectedRef.current)[0]
							curAction.current = cur_id
							global.$showModal({
								zIndex: 9998,
								content: (
									<LocalAssetPickerDialogContent
										onAddAsset={handleAddAsset}
										selectedRow={dataRef.current.find((v) => v.assetId === cur_id)}
										type="edit"
									/>
								),
								title: "编辑资产",
								width: "948px"
							})
						}}>
						编辑
					</Button>
					<Button
						type="primary"
						disabled={isDisableRemoveBtn}
						onClick={() => {
							Modal.confirm({
								title: "警告",
								content: `确认删除选中的资产信息？`,
								onOk: async () => {
									dataRef.current = dataRef.current.filter(
										(v) => !chunkobj2list(selectedRef.current).includes(v.assetId)
									)
									setData(dataRef.current.slice((current - 1) * pageSize, current * pageSize))
									Object.keys(selectedRef.current).forEach((v) => {
										selectedRef.current[v] = []
									})
									setSelectedRowKeys(selectedRef.current[current])
									onChange(dataRef.current)
								}
							})
						}}>
						删除
					</Button>
				</Space>
			)}
			<Card
				style={{
					boxShadow: "none",
					border: "1px solid #f0f0f0",
					// padding: 5,
					marginBottom: 10
				}}>
				<PerfectScrollbar style={{ width: "100%", height: 210 }}>
					<div
						style={{
							minWidth: tableMinWidth
						}}>
						<Table
							sticky
							rowKey="assetId"
							rowClassName={tableRowClassName}
							size="middle"
							rowSelection={type !== "detail" ? rowSelection : false}
							pagination={false}
							columns={columns}
							dataSource={data}
						/>
					</div>
				</PerfectScrollbar>
			</Card>
			<div
				style={{
					paddingLeft: 10,
					paddingRight: 10,
					boxShadow: "none",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
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
					条数据
					{type === "create" && (
						<span>
							，当前选中&nbsp;
							<span
								style={{
									fontSize: 16,
									color: "#00bcd4"
								}}>
								{totalSelectedCount}
							</span>
							&nbsp; 条
						</span>
					)}
				</div>
				<div>
					<Pagination
						hideOnSinglePage
						onChange={onPageChange}
						current={current}
						total={dataRef.current.length}
						pageSize={pageSize}
					/>
				</div>
			</div>
		</>
	)
})
