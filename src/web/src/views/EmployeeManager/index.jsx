import React, { useState, useRef, useCallback, useEffect } from "react"
import LeftTree from "./LeftTree"
import TableContent from "./TableContent"
import { Box } from "@material-ui/core"

import * as lodash from "lodash"

import { useDispatch } from "react-redux"
import { add as org_add, removeById as org_removeById, update as org_update } from "store/slices/org"
import {
	add as employee_add,
	removeById as employee_removeById,
	update as employee_update
} from "store/slices/employee"

import clientService from "api/clientService"

const TOPTREEID = "1"

export default () => {
	const dispatch = useDispatch()
	const [selectedKeys, setSelectedKeys] = useState([TOPTREEID])

	const [orgFlatData, setOrgFlatData] = useState([])

	const [employeeList, setEmployeeList] = useState(null)

	const [tableContentData, setTableContentData] = useState([])

	const [tableContentHeader, setTableContentHeader] = useState([])

	const [isSearchAll, setIsSearchAll] = useState(false)

	const employeeListRef = useRef([])

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

	const addHandler = useCallback(
		async ({ orgId, orgName, parentId }, cb) => {
			const res = await clientService.org.addOrg(orgId, orgName, parentId)
			if (res.code === 1) {
				dispatch(org_add({ orgId, orgName, parentId }))
				cb()
				refreshData()
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
				})
			}
		},
		[dispatch, refreshData]
	)

	const deleteHandler = useCallback(
		async ({ orgId }, cb) => {
			const res = await clientService.org.deleteOrg(orgId)
			if (res.code === 1) {
				dispatch(org_removeById(orgId))
				cb()
				refreshData()
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
				})
			}
		},
		[dispatch, refreshData]
	)

	const updateHandler = useCallback(
		async ({ orgId, orgName }, cb) => {
			const res = await clientService.org.updateOrg(orgId, { orgName })
			if (res.code === 1) {
				dispatch(org_update({ orgId, orgName }))
				cb()
				refreshData()
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
				})
			}
		},
		[dispatch, refreshData]
	)

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

	const deleteEmployeeHandler = useCallback(
		async ({ employeeId }, cb) => {
			const res = await clientService.employee.deleteEmployee(employeeId)
			if (res.code === 1) {
				dispatch(employee_removeById(employeeId))
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

	const updateEmployeeHandler = useCallback(
		async (employee, cb) => {
			const employee_copy = lodash.cloneDeep(employee)
			const res = await clientService.employee.updateEmployee(employee_copy.employeeId, employee)
			if (res.code === 1) {
				dispatch(employee_update(employee_copy))
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

	const handleSearchAllCheckboxChange = useCallback((iSSearchAll) => {
		setIsSearchAll(iSSearchAll)
	}, [])

	useEffect(() => {
		refreshData()
		refreshEmployeeData()
	}, [refreshData, refreshEmployeeData])

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
					refreshData={refreshData}
					originData={employeeListRef.current}
					tableContentHeader={tableContentHeader}
					topTreeId={TOPTREEID}
					/*addHandler={addHandler}
					deleteHandler={deleteHandler}
					updateHandler={updateHandler}*/
					orgFlatData={orgFlatData}
					selectedKeys={selectedKeys}
					setSelectedKeys={setSelectedKeys}
				/>
				<TableContent
					isSearchAll={isSearchAll}
					onSearchAllCheckboxChange={handleSearchAllCheckboxChange}
					addHandler={addEmployeeHandler}
					deleteHandler={deleteEmployeeHandler}
					updateHandler={updateEmployeeHandler}
					header={tableContentHeader}
					tableData={tableContentData}
				/>
			</div>
		</Box>
	)
}
