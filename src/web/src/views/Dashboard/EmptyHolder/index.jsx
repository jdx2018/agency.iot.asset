import React from "react"
import { Empty } from "antd"
import styles from "./index.module.css"

const EmptyHolder = () => {
	return (
		<div className={styles.wrapper}>
			<Empty description={false} />
		</div>
	)
}
export default EmptyHolder
