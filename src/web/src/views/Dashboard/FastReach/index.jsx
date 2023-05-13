import React, { useState, useEffect } from "react"
import { Card, Row, Col, Skeleton } from "antd"
import EmptyHolder from "../EmptyHolder"
import styles from "./index.module.css"
import TargetItem from "./TargetItem"
import clientService from "api/clientService"

const cardBodyStyles = {
	width: "100%"
}

const LAYOUT_COUNT = 8

const FastReach = () => {
	const [data, setData] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			const res = await clientService.dashBoard.getQuickMenu()
			if (res.code === 1) {
				setData(res.data)
			} else {
				global.$showMessage({
					type: "error",
					message: res.message
				})
				setData([])
			}
		}
		fetchData()
	}, [])

	return (
		<Card
			bodystyle={cardBodyStyles}
			className={styles.card}
			title={<span className={styles.cardTitle}>快捷入口 / Shortcuts</span>}>
			{data ? (
				data.length > 0 ? (
					<Row>
						{data.map((item, index) => (
							<Col key={index} span={24 / LAYOUT_COUNT}>
								<div key={item.id}>
									<TargetItem
										className={styles.itemWrapper}
										pageDesc={item.pageDesc}
										componentName={item.componentName}
									/>
								</div>
							</Col>
						))}
					</Row>
				) : (
					<EmptyHolder />
				)
			) : (
				<Skeleton active />
			)}
		</Card>
	)
}

export default FastReach
