import React, { createElement } from "react"
import styles from "./index.module.css"
import AntIcons from "components/AntIcons"
import { Link } from "react-router-dom"

function randomNum(minNum, maxNum) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10)
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
		default:
			return 0
	}
}

const colorList = [
	"#61b15a",
	"#adce74",
	"#fff76a",
	"#ffce89",
	"#ec5858",
	"#fd8c04",
	"#9088d4",
	"#16a596",
	"#ee6f57",
	"#32e0c4",
	"#fdb827",
	"#1f6f8b",
	"#968c83",
	"#efbbcf",
	"#d2e603",
	"#40a8c4",
	"#d9adad",
	"#fe91ca",
	"#251f44",
	"#fa1616"
]

const TargetItem = ({ pageDesc, componentName }) => {
	return (
		<Link to={`/${componentName}`}>
			<div className={styles.wrapper}>
				{createElement(AntIcons[componentName], {
					style: { color: colorList[randomNum(0, colorList.length)], fontSize: 40 }
				})}
				<div className={styles.title}>{pageDesc}</div>
			</div>
		</Link>
	)
}

export default TargetItem
