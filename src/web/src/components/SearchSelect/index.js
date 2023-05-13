import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

function SearchSelect(props) {
	const {
		value,
		className,
		width,
		renderProps,
		children: CusContent,
		multiple,
		onChange,
		clear,
		height,
		type,
		placeholder,
		disabled
	} = props;

	const [open, setOpen] = useState(false);
	const [curKey, setCurKey] = useState([]);
	const [search, setSearch] = useState("");
	const [seletId] = useState(new Date().getTime())
	const classes = useStyle();

	useEffect(() => {
		if(multiple === false) {
			if(!value) {
				setCurKey([]);
			} else {
				setCurKey([value]);
			}
		} else {
			if(Array.isArray(value)) {
				setCurKey(value);
			} else {
				throw new Error("value类型错误! 如果multiple===true, value的类型必须是一个Array");
			}	
		}
	}, [value, multiple])

	const handleClickSelectVisible = useCallback((e) => {
		setOpen(!open);
		if(!open === false) {
			setSearch("");
		}
	}, [open])

	const handleClickAway = useCallback(() => {
		setOpen(false);
		setSearch("");
	}, [])

	const handlClickMenuItem = useCallback(key => {
		if(multiple === false) {
			setCurKey([key]);
		} else {
			setCurKey(curKey => {
				if(curKey.indexOf(key) === -1) {
					return [...curKey, key];
				} else {
					return curKey.filter(item => {
						return item !== key;
					})
				}		
			})
		}
	}, [multiple])

	const handleSearch = useCallback(e => {
		let value = e.target.value;
		setSearch(value);
	}, [])

	const handleClear = useCallback(() => {
		setCurKey([]);
		setSearch("");
		if(CusContent) {
			clear();
		}
	}, [clear, CusContent])

	const curKeyLabel = useMemo(() => {
		let result = [];
		for(let selectItem of renderProps) {
			if(multiple === false) {
				if(Object.values(selectItem).indexOf(curKey[0]) !== -1) {
					result.push(selectItem.label);
					break;
				}
			} else {
				if(curKey.indexOf(selectItem.key) !== -1) {
					result.push(selectItem.label);
				}
			}
		}
		return result;
	}, [renderProps, curKey, multiple])

	const curRenderProps = useMemo(() => {
		let result = renderProps.filter(item => {
			let { label } = item;
			return String(label)
            .replace(/\s*/g, "")
            .toUpperCase()
            .indexOf(search.toUpperCase().replace(/\s*/g, "")) > -1
		})
		return result;
	}, [search, renderProps])

	useEffect(() => {
		if(curKey.length !== 0) {
			if(multiple === false) {
				setOpen(false);
				onChange(curKey[0]);
			} else {
				onChange(curKey);
			}
		}	
	}, [multiple, curKey, onChange])

	useEffect(() => {
		const contentDom = document.querySelector("#content" + seletId);
		const selectDom = document.querySelector("#select" + seletId);
		let timer;
		if(open === true) {
			timer = setTimeout(() => {
				contentDom.style.top = height + "px";
				contentDom.style.transition = "all 0.2s ease-out";
				selectDom.focus();
			}, 0)
		} else {
			timer = setTimeout(() => {
				contentDom.style.top = (height * 0.5) + "px";
				contentDom.style.transition = "all 0.2s ease-out";
			}, 0)
		}
		return () => {
			if(timer) {
				clearTimeout(timer);
			}
		}
	}, [open, seletId, height])

	return <ClickAwayListener
		onClickAway={handleClickAway}
	>
		<div 
			className={classes.container}
			style={{
				width: width
			}}
		>
			<div
				onClick={disabled !== true ? handleClickSelectVisible : null}
				className={
					classes.select + " " 
					+ (open ? classes.selectOpen : "") + " " 
					+ (type === "outLine" ? "" : classes.selectType) + " "
					+ (className ? className : "") + " "
					+ (disabled === true ? classes.selectDisabled : "")
				}
				style={{
					height: height,
					borderColor: open ? "#00bcd4" : "",
				}}
			>
				<span>
					<span
						className={classes.placeholder}
					>
						{curKeyLabel.length === 0 ? placeholder : ""}
					</span>
					{curKeyLabel.map((item, index) => {
						if(index === 0) {
							return item;
						} else {
							return ", " + item;
						}
					})}
				</span>
				{open ? <ArrowDropUpIcon className={classes.icon} /> : <ArrowDropDownIcon className={classes.icon} />}
			</div>
			<div 
				className={
					classes.menuContent + " " + (open ? classes.menuContentOpen : classes.menuContentClose)
				}
				id={"content" + seletId}
			>
				<div className="header">
					<input 
						type="text"
						placeholder="输入关键字"
						value={search}
						onChange={handleSearch}
						id={"select" + seletId}
					/>
				</div>
				{
					CusContent && search === ""
					? CusContent
					: <div className="content">
						<ul>
							{
								curRenderProps.map(item => {
									return <li 
										key={item.key}
										onClick={handlClickMenuItem.bind(null, item.key)}
										style={{
											backgroundColor: curKey.indexOf(item.key) !== -1 ? "#EAE8E8" : ""
										}}
									>
										{item.label}
									</li>
								})
							}
						</ul>
					</div>
				}
				<div className="footer">
					<span onClick={handleClear} variant="contained" color="primary" size="small" >清空</span>
				</div>
			</div>
		</div>
	</ClickAwayListener>
}

const useStyle = makeStyles(theme => {
	return {
		container: {
			position: "relative",
			display: "inline-block",
			verticalAlign: "basic-line",
			"&:focus": {
				border: "none",
				backgroundColor: "red",
				outline: "none"
			}
		},
		select: {
			boxSizing: "border-box",
			display: "flex",
			justifyContent: "space-between",
  		alignItems: "center",
  		border: "1px solid #d9d9d9",// rgba(0, 0, 0, 0.42)
  		//borderRadius: 4,
  		cursor: "pointer",
  		transition: "all 0.2s",
			"&>span": {
				width: "calc(100% - 26px)",
				textAlign: "left",
				textIndent: 8,
				whiteSpace: "nowrap",
				overflow: "hidden",
				textOverflow: "ellipsis"
			},
			"&:hover": {
				borderColor: "#00bcd4",
				transition: "all 0.2s",
				opacity: "0.7"
			}
		},
		selectOpen: {
			//borderColor: "#80bdff",
			boxShadow: "0px 0px 3px #00bcd4",
			transition: "all 0.2s"
		},
		selectType: {
			border: "none",
			borderBottom: "1px solid #d9d9d9",
			//borderRadius: "4px 4px 0 0"
		},
		selectDisabled: {
			cursor: " not-allowed",
			backgroundColor: "#f6f6f6",
			color: "rgba(0, 0, 0, 0.42)",
			"&:hover": {
				borderColor: "rgba(0, 0, 0, 0.42)"
			}
		},
		menuContent: {
			position: "absolute",
  		border: "1px solid rgba(0, 0, 0, 0.22)",
  		backgroundColor: "white",
  		zIndex: 1,
			width: "100%",
			marginTop: 1,
			//borderRadius: 4,
			"&>.header": {
				borderBottom: "1px solid rgba(0, 0, 0, 0.22)",
				textAlign: "left",
				textIndent: 8,
				"&>input": {
					width: "calc(100% - 24px)",
					outline: "none",
					border: "none",
					padding: "10px 0",
					fontSize: 15
				}
			},
			"&>.content": {
				maxHeight: 150,
				overflow: "scroll",
				margin: "5px 0",
				"& li, &>ul": {
					listStyle: "none",
					listStyleType: "none",
					margin: 0,
					padding: 0
				},
				"& li": {
					cursor: "pointer",
					textAlign: "left",
					textIndent: 8,
					padding: "5px 0",
					boxSizing: "border-box",
					border: "0.5px solid white",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis"
				},
				"& li:hover": {
					backgroundColor: "#F9F8F8",
					border: "0.5px solid #D1D1D1",
					//borderRadius: 2,
				}
			},
			"&>.footer": {
				display: "flex",
				justifyContent: "flex-end",
				borderTop: "1px solid rgba(0, 0, 0, 0.22)",
				"&>span": {
					cursor: "pointer",
					padding: "5px 10px",
					margin: "2px 0",
					fontSize: 14 
				},
				"&>span:hover": {
					backgroundColor: "#F9F8F8",
					transition: "all 0.2s"
				},
				"&>span:active":{
					backgroundColor: "#F0EFEF",
					transition: "all 0.2s"
				}
			}
		},
		menuContentOpen: {
			display: "inline-block",
			top: "10px"
		},
		menuContentClose: {
			display: "none",
			top: 10
		},
		icon: {
			fontSize: 24
		},
		placeholder: {
			display: "inline-block",
			color: "#dfdfdd",
		}
	}
})

SearchSelect.defaultProps = {
	onChange: (value) => {},
	width: 250,
	height: 30,
	renderProps: [],
	multiple: false,
	clear: () => {}, //当传入自定义content的时候, 需要传递一个清空value的函数.
	type: "outLine", //下拉框输入区域的样式 outLine: 框  bottomLine: 下划线
	disabled: false
}

export default memo(SearchSelect);