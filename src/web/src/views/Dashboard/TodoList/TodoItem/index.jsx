import React from "react"
import styles from "./index.module.css"
import { Link } from "react-router-dom"

const TodoItem = ({ title, content, componentName }) => {
	return (
		<Link to={`/${componentName}`}>
			<div className={styles.wrapper}>
				<div className={styles.num}>{content}</div>
				<div className={styles.title}>{title}</div>
			</div>
		</Link>
	)
}

export default TodoItem
