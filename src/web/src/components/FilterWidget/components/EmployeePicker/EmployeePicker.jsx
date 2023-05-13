import React, { useState, useRef, useCallback, useEffect } from "react"
import LeftTree from "./LeftTree"
import TableContent from "./TableContent"
import { Box } from "@material-ui/core"

import { useDispatch } from "react-redux"
import { add as employee_add } from "store/slices/employee"

import clientService from "api/clientService"

const TOPTREEID = "1"

export default ({ onChange }) => {
	const dispatch = useDispatch()

	const [selectedKeys, setSelectedKeys] = useState([])

	const [orgFlatData, setOrgFlatData] = useState([])

	const [employeeList, setEmployeeList] = useState(null)

	const [tableContentData, setTableContentData] = useState([])

	const [tableContentHeader, setTableContentHeader] = useState([])

	const [isSearchAll, setIsSearchAll] = useState(true)

	const employeeListRef = useRef([])
	const selectedEmplayeeIdRef = useRef(null)

	const refreshEmployeeData = useCallback(async () => {
		const res = await clientService.employee.getEmployeeList_all()
		if (res.code === 1) {
			employeeListRef.current = res.data.rows
			setEmployeeList(res.data.rows)

			setTableContentHeader(res.data.header)
		} else {
			global.$showMessage({
				message: res.message,
				type: "error",
				autoHideDuration: 5000
			})
		}
	}, [])

	const refreshData = useCallback(async () => {
		const res = await clientService.org.getOrgList_all()
		if (res.code === 1) {
			setOrgFlatData(res.data.rows.map((nodeData) => ({ key: nodeData.orgId, title: nodeData.orgName, ...nodeData })))
		} else {
			global.$showMessage({
				message: res.message,
				type: "error",
				autoHideDuration: 5000
			})
		}
	}, [])

	const addEmployeeHandler = useCallback(
		async (employee, cb) => {
			const res = await clientService.employee.addEmployee(employee)
			if (res.code === 1) {
				dispatch(employee_add(employee))
				cb()
				refreshEmployeeData()
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
				})
			}
		},
		[dispatch, refreshEmployeeData]
	)

	const handleSearchAllCheckboxChange = useCallback(
		(iSSearchAll) => {
			if (selectedKeys.length !== 0) {
				setIsSearchAll(iSSearchAll)
			}
		},
		[selectedKeys.length]
	)

	useEffect(() => {
		refreshData()
		refreshEmployeeData()
	}, [refreshData, refreshEmployeeData])

	useEffect(() => {
		if (selectedKeys.length === 0) {
			setIsSearchAll(true)
			return
		}
		setIsSearchAll(false)
	}, [selectedKeys])

	useEffect(() => {
		if (selectedKeys.length === 0 || isSearchAll) {
			setTableContentData(employeeListRef.current)
			return
		}

		setTableContentData(
			selectedKeys.length === 0 ? [] : employeeListRef.current.filter((employee) => employee.orgId === selectedKeys[0])
		)
	}, [employeeList, selectedKeys, isSearchAll])

	return (
		<Box p={1}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between"
				}}>
				<LeftTree
					topTreeId={TOPTREEID}
					orgFlatData={orgFlatData}
					selectedKeys={selectedKeys}
					setSelectedKeys={setSelectedKeys}
				/>
				<TableContent
					onSelectedChange={(ids) => {
						selectedEmplayeeIdRef.current = ids[0]
						onChange(selectedEmplayeeIdRef.current)
					}}
					isSearchAll={isSearchAll}
					onSearchAllCheckboxChange={handleSearchAllCheckboxChange}
					addHandler={addEmployeeHandler}
					header={tableContentHeader}
					tableData={tableContentData}
				/>
			</div>
		</Box>
	)
}
