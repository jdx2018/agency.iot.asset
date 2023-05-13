import React, { useContext } from "react"
import { Tree, Input } from "antd"
import { ResizableBox } from "react-resizable"
import { Card } from "@material-ui/core"
import { getTreeFromFlatData } from "react-sortable-tree"
import { StyleContext } from "./style-context"

const { Search } = Input

export default React.memo(({ setSelectedKeys, selectedKeys, orgFlatData, topTreeId }) => {
	const { height } = useContext(StyleContext)
	const [expandedKeys, setExpandedKeys] = React.useState([topTreeId])
	const [searchValue, setSearchValue] = React.useState("")
	const [autoExpandParent, setAutoExpandParent] = React.useState(true)

	const treeData = React.useMemo(
		() =>
			getTreeFromFlatData({
				flatData: orgFlatData,
				getKey: (node) => node.orgId,
				getParentKey: (node) => node.parentId,
				rootKey: "0"
			}),
		[orgFlatData]
	)

	const dataList = []
	const generateList = (data) => {
		for (let i = 0; i < data.length; i++) {
			const node = data[i]
			const { key, title } = node
			dataList.push({ key, title })
			if (node.children) {
				generateList(node.children)
			}
		}
	}

	generateList(treeData)

	const getParentKey = (key, tree) => {
		let parentKey
		for (let i = 0; i < tree.length; i++) {
			const node = tree[i]
			if (node.children) {
				if (node.children.some((item) => item.key === key)) {
					parentKey = node.key
				} else if (getParentKey(key, node.children)) {
					parentKey = getParentKey(key, node.children)
				}
			}
		}
		return parentKey
	}

	const onExpand = (expandedKeys) => {
		setExpandedKeys(expandedKeys)
		setAutoExpandParent(false)
	}

	const loop = (data) =>
		data.map((item) => {
			const index = item.title.indexOf(searchValue)
			const beforeStr = item.title.substr(0, index)
			const afterStr = item.title.substr(index + searchValue.length)
			const title =
				index > -1 ? (
					<span>
						{beforeStr}
						<span
							style={{
								color: "#00bcd4"
							}}>
							{searchValue}
						</span>
						{afterStr}
					</span>
				) : (
					<span>{item.title}</span>
				)
			if (item.children) {
				return { title, key: item.key, children: loop(item.children) }
			}

			return {
				title,
				key: item.key
			}
		})

	const onSearch = (e) => {
		const { value } = e.target
		const val = value.trim()
		const expandedKeys = dataList
			.map((item) => {
				if (item.title.indexOf(val) > -1 || item.key.indexOf(val) > -1) {
					return getParentKey(item.key, treeData)
				}
				return null
			})
			.filter((item, i, self) => item && self.indexOf(item) === i)
		setExpandedKeys(expandedKeys)
		setSearchValue(val)
		setAutoExpandParent(true)
	}

	const handleSelectTreeNode = (selectedKeys) => {
		setSelectedKeys(selectedKeys)
	}

	const LeafNodeRender = React.useCallback((nodeData) => {
		return (
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between"
				}}>
				{nodeData.title}
			</div>
		)
	}, [])

	React.useEffect(() => {
		let keyList = []
		const getKeys = (nodeArr) => {
			nodeArr.forEach((node) => {
				keyList.push(node.key)
				if (node.children && node.children.length > 0) {
					getKeys(node.children)
				}
			})
		}
		getKeys(treeData)
		setExpandedKeys(keyList)
	}, [treeData])

	return (
		<ResizableBox
			style={{
				position: "relative"
			}}
			handle={() => (
				<span
					style={{
						position: "absolute",
						right: -51,
						top: "50%",
						cursor: "col-resize",
						width: 50,
						height: 50,
						background: "transparent",
						borderTop: "5px solid transparent",
						borderBottom: "5px solid #aeafb0",
						borderLeft: "5px solid transparent",
						borderRight: "5px solid transparent",
						transform: "rotate(0.25turn)"
					}}></span>
			)}
			width={300}
			height={height}
			minConstraints={[200]}
			maxConstraints={[Infinity]}
			axis="x">
			<Card
				style={{
					boxShadow: "none",
					height: "100%",
					width: "100%",
					padding: 10
				}}>
				<Search style={{ marginBottom: 8 }} placeholder="键入搜索..." onChange={onSearch} />
				<Tree
					height={height - 60}
					onSelect={handleSelectTreeNode}
					selectedKeys={selectedKeys}
					showIcon
					titleRender={LeafNodeRender}
					showLine={{
						showLeafIcon: false
					}}
					blockNode
					onExpand={onExpand}
					expandedKeys={expandedKeys}
					autoExpandParent={autoExpandParent}
					treeData={loop(treeData)}
				/>
			</Card>
		</ResizableBox>
	)
})
