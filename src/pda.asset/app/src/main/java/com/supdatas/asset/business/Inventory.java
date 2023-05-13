package com.supdatas.asset.business;

import android.content.Context;
import android.database.Cursor;
import android.util.Log;

import com.supdatas.asset.DateUtils;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.model.BillStatusEnum;
import com.supdatas.asset.model.ScanEnum;
import com.supdatas.asset.model.asset.AssetClassEntity;
import com.supdatas.asset.model.asset.AssetEntity;
import com.supdatas.asset.model.asset.AssetPlaceEntity;
import com.supdatas.asset.model.in.InBillStatusEnum;
import com.supdatas.asset.model.inventory.InventoryDtlEntity;
import com.supdatas.asset.model.inventory.InventoryEntity;
import com.supdatas.asset.sqlite.TableName;
import com.supdatas.asset.sqlite.busi.SqliteBusiDB;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Inventory {

	private Context mContext;
	private SqliteBusiDB mSqlite = null;
	private static final String INVENTORY_MAIN= TableName.TENANT_INVENTORY;
	private static final String INVENTORY_DETAIL= TableName.TENANT_INVENTORY_DETAIL;


	public Inventory(Context cxt){
		if (mSqlite == null) {
			mContext = cxt;
			mSqlite = SqliteBusiDB.getInstance(cxt, true);
		}
	}

	public List<InventoryEntity> getBill(InventoryEntity mainBill){

		Cursor cursor = null;
		List<InventoryEntity> list = new ArrayList<>();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("select tenantId,billNo,billType,billStatus,pdBillName,pdPerson," +
					"startDate,endDate,useOrgId,useOrgName,classId,placeId,ownOrgId,ownOrgName,createPerson,createTime,remarks " +
					"from ").append(INVENTORY_MAIN);
			if (mainBill != null && !TextUtil.isNullOrEmpty(mainBill.billNo)){
				sql.append(String.format(" where billNo = '%s';", mainBill.billNo));
			}
			cursor = mSqlite.exeRawQuery(sql.toString(), new Object[0]);
			while (cursor.moveToNext()) {

				InventoryEntity item = new InventoryEntity();
				item.tenantId = cursor.getString(0);
				item.billNo = cursor.getString(1);
				item.billType = cursor.getString(2);
				item.billStatus = cursor.getInt(3);
				item.pdBillName = cursor.getString(4);

				item.pdPerson = cursor.getString(5);
				item.startDate = cursor.getString(6);
				item.endDate = cursor.getString(7);
				item.useOrgId = cursor.getString(8);
				item.useOrgName = cursor.getString(9);

				item.classId = cursor.getString(10);
				item.placeId = cursor.getString(11);
				item.ownOrgId = cursor.getString(12);
				item.ownOrgName = cursor.getString(13);
				item.createPerson = cursor.getString(14);

				item.createTime = cursor.getString(15);
				item.remarks = cursor.getString(16);

				if (!TextUtil.isNullOrEmpty(item.createTime) && item.createTime.length() > 10){
					item.createTime = item.createTime.substring(0, item.createTime.length() - 10);
				}
				list.add(item);
			}
		}catch (Exception ex){
			ex.printStackTrace();
			LogSys.writeSysLog("", ex.toString());
		}
		finally {
			if (cursor != null){
				cursor.close();
			}
		}
		return list;
	}

	public void delNullDtlBill(){

		String sqlDelNullDtl = "delete from "+INVENTORY_MAIN+" where not exists " +
				"(select 1 from "+INVENTORY_DETAIL+" t1 where "+INVENTORY_MAIN+".billNo=t1.billNo limit 1)";
		mSqlite.exeSqlStr(sqlDelNullDtl);
	}

	public List<InventoryDtlEntity> getBillData(String billNo, String billType) {

		List<InventoryDtlEntity> lst = new ArrayList<>();
		Cursor cursor = null;
		try {

			String sql = "select t1.tenantId,t1.billNo,t1.assetId,t1.status,t1.pdPerson," +
					"t1.pdDate,t1.modify,t1.image,t1.pdaSN,t1.createTime," +
					"t2.barcode,t2.epc,t2.assetName,t2.classId,t2.manager,t2.brand,t2.model," +
					"t2.status,t2.usePerson,t2.useDate,t2.useStatus," +
					"t2.placeId,t3.placeName,t2.serviceLife,t2.amount,t2.expired"+
					" from "+INVENTORY_DETAIL+" t1 left join "+ AssetEntity.TABLE_NAME +" t2 " +
					" on t1.assetId=t2.assetId left join " + AssetPlaceEntity.TABLE_NAME +
					" t3 on t2.placeId=t3.placeId where 1=1 ";

			if (!TextUtil.isNullOrEmpty(billNo)) {
				sql += String.format(" and t1.billNo='%s'", billNo);
			}
			cursor = mSqlite.exeRawQuery(sql, new String[0]);
			while (cursor!=null && cursor.moveToNext()) {
				InventoryDtlEntity item = new InventoryDtlEntity();

				item.tenantId = cursor.getString(0);
				item.billNo = cursor.getString(1);
				item.assetId = cursor.getString(2);
				item.status = cursor.getInt(3);
				item.pdPerson = cursor.getString(4);

				item.pdDate = cursor.getString(5);
				item.modify = cursor.getString(6);
				item.image = cursor.getString(7);
				item.pdaSN = cursor.getString(8);
				item.createTime = cursor.getString(9);

				item.assetEntity.barcode = cursor.getString(10);
				item.assetEntity.epc = cursor.getString(11);
				item.assetEntity.assetName = cursor.getString(12);
				item.assetEntity.classId = cursor.getString(13);
				item.assetEntity.manager = cursor.getString(14);
				item.assetEntity.brand = cursor.getString(15);
				item.assetEntity.model = cursor.getString(16);
				item.assetEntity.status = cursor.getInt(17);
				item.assetEntity.usePerson = cursor.getString(18);
				item.assetEntity.useDate = cursor.getString(19);
				item.assetEntity.useStatus = cursor.getInt(20);
				item.assetEntity.placeId = cursor.getString(21);
				item.assetEntity.placeName = cursor.getString(22);
				item.assetEntity.serviceLife = cursor.getInt(23);
				item.assetEntity.amount = cursor.getString(24);
				item.assetEntity.expired = cursor.getString(25);

				lst.add(item);
			}
		}
		catch (Exception ex){
			throw ex;
		}
		finally {
			if (cursor != null){
				cursor.close();
			}
		}
		return lst;
	}

	public InventoryDtlEntity getInventoryItem(String billNo, String assetId) {

		Cursor cursor = null;
		try {
			String sql = String.format("select t1.assetId,t1.status from %s where billNo='%s' and barcode='%s'",
					INVENTORY_DETAIL, billNo, assetId);
			cursor = mSqlite.exeRawQuery(sql, new String[0]);
			if (cursor!=null && cursor.moveToNext()) {
				InventoryDtlEntity item = new InventoryDtlEntity();

				item.billNo = cursor.getString(0);
				item.status = cursor.getInt(1);

				return item;
			}
		}
		catch (Exception ex){
			throw ex;
		}
		finally {
			if (cursor != null){
				cursor.close();
			}
		}
		return null;
	}

	public void setBillScanStatus(String billNo){

		String sql = "update "+INVENTORY_MAIN+" set billStatus = ? " +
				"where exists (select 1 from "+INVENTORY_DETAIL+" t1 " +
				"where t1.billNo="+INVENTORY_MAIN+".billNo and t1.status = ?) " +
				"and billNo=?";
		mSqlite.exeSqlStr(sql,
				new Object[]{BillStatusEnum.SCANING.getCode(),
						ScanEnum.SCANED.getCode(), billNo}, false);
	}

	public void resetBillStatus(String billNo){

		try {
			mSqlite.beginTrans();
			String sqlMain =
					"update " +INVENTORY_MAIN+
					" set billStatus = ?, " + "updateTime=?, updatePerson=? where billNo=?";
			String sqlDtl =
					"update " + INVENTORY_DETAIL + " set status = ?, updateTime=?, updatePerson=? where billNo=?";
			mSqlite.exeSqlStr(sqlMain,
					new Object[]{BillStatusEnum.UN_UPLOADED.getCode(), "", "", billNo}, true);
			mSqlite.exeSqlStr(sqlDtl,
					new Object[]{ScanEnum.UNSCANED.getCode(), "", "", billNo}, true);
			mSqlite.setTransSuccessful();
		}
		catch (Exception ex){
			throw ex;
		}
		finally {
			mSqlite.endTrans();
		}
	}

	public void updateDetailFlag(String billNo, String assetId, String sn, int qty,String userNo, int status){

		String sqlMain =
				"update " +INVENTORY_DETAIL+
						" set status = ?, updateTime=?, updatePerson=?,qty=?,pdaSN=? where billNo=? and assetId=?";
		mSqlite.exeSqlStr(sqlMain,
				new Object[]{status, DateUtils.getCurrentTime(), userNo,qty,sn,billNo, assetId}, false);
	}

	public void updateMainUploadStatus(String billNo, String userNo, int status){

		String sqlMain =
				"update " +INVENTORY_MAIN+
						" set billStatus = ?, updateTime=?, updatePerson=? where billNo=?";
		mSqlite.exeSqlStr(sqlMain,
				new Object[]{status, DateUtils.getCurrentTime(), userNo, billNo}, false);
	}

	public void updateMainScanedStatus(String billNo, String userNo, int status){

		String sqlMain =
				"update " +INVENTORY_MAIN+
						" set billStatus = ?, updateTime=?, updatePerson=? where billNo=?";
		mSqlite.exeSqlStr(sqlMain,
				new Object[]{status, DateUtils.getCurrentTime(), userNo, billNo}, false);
	}

	public boolean hasSpeDtl(String billNo, int status){

		Cursor cursor = null;
		try {
			String sqlExistsScaned = "select 1 from "+INVENTORY_DETAIL+" where billNo = ?";
			if (status != -1)
				sqlExistsScaned += " and status = ? limit 1;";
			else
				sqlExistsScaned += " limit 1;";

			cursor = mSqlite.exeRawQuery(sqlExistsScaned,
					status == -1 ? new Object[]{billNo} : new Object[]{billNo, status});
			if (cursor == null || cursor.getCount() < 1) {
				return false;
			} else if (cursor.getCount() > 0) {
				return true;
			}
		}catch (Exception ex){
			ex.printStackTrace();
			LogSys.writeSysLog("", ex.toString());
		}
		finally {
			if (cursor != null){
				cursor.close();
			}
		}
		return false;
	}

	public int insert(List<InventoryEntity> listMain, List<InventoryDtlEntity> listDtl){

		if (listMain.size() < 1)
			return 0;
		try{
			String sqlDel1 = "delete from "+INVENTORY_MAIN+" where billNo = ?;";
			String sqlDel2 = "delete from "+INVENTORY_DETAIL+" where billNo = ?;";
			String insertMain = "insert into "+INVENTORY_MAIN+"(tenantId,billNo,billType,billStatus," +
					"pdBillName,pdPerson,startDate,endDate,useOrgId,useOrgName,classId,placeId,ownOrgId,ownOrgName," +
					"createPerson,createTime,updatePerson,updateTime,remarks)" +
					"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			String insertDtl = "insert into "+INVENTORY_DETAIL+
					"(tenantId,billNo,assetId,status,pdPerson,pdDate,modify,image,pdaSN,createPerson,createTime,updatePerson,updateTime)" +
					"values(?,?,?,?,?,?,?,?,?,?,?,?,?)";

			mSqlite.beginTrans();

			for (int i = listMain.size() - 1; i >= 0; --i){

				final int index = i;

				if (!hasSpeDtl(listMain.get(i).billNo, 1)){

					mSqlite.exeSqlStr(sqlDel1, new String[]{listMain.get(i).billNo});
					mSqlite.exeSqlStr(sqlDel2, new String[]{listMain.get(i).billNo});
				}
				else{
					listMain.remove(i);
					for (int j = listDtl.size() - 1; j >= 0; --j){

						if (listDtl.get(j).billNo.equalsIgnoreCase(listMain.get(i).billNo)){
							listDtl.remove(j);
						}
					}
				}
			}
			for (InventoryEntity a : listMain){
				mSqlite.exeSqlStr(insertMain, new Object[]{
						a.tenantId,a.billNo,a.billType,a.billStatus,a.pdBillName,a.pdPerson,
						a.startDate,a.endDate,a.useOrgId,a.useOrgName,a.classId,a.placeId,
						a.ownOrgId,a.ownOrgName,a.createPerson,a.createTime,a.updatePerson,a.updateTime,a.remarks});
			}//tenantId,billNo,assetId,status,pdPerson,pdDate,modify,image,pdaSN,createPerson,createTime,updatePerson,updateTime
			for (InventoryDtlEntity a : listDtl){
				mSqlite.exeSqlStr(insertDtl, new Object[]{
						a.tenantId,a.billNo,a.assetId,a.status,a.pdPerson,a.pdDate,a.modify,a.image,
						a.pdaSN,a.createPerson,a.createTime,a.updatePerson,a.updateTime});
			}
			mSqlite.setTransSuccessful();

			return listMain.size();
		}
		catch (Exception ex){
			throw ex;
		}
		finally {
			mSqlite.endTrans();
		}
	}

	public List<InventoryEntity> parseAndProcMainData(final String content) throws Exception {

		List<InventoryEntity> list = new ArrayList<>();
		JSONObject jsonObject = new JSONObject(content);
		int code = jsonObject.getInt("code");
		String message = jsonObject.getString("message");

		if (code == 1){
			JSONArray array = jsonObject.getJSONArray("data");
			Log.i("", array.toString());

			for (int i = 0; i < array.length(); ++i){

				JSONObject item = array.getJSONObject(i);

				InventoryEntity a = new InventoryEntity();
				a.tenantId = item.has("tenantId") ? item.getString("tenantId") : "";
				a.billNo = item.has("billNo") ? item.getString("billNo") : "";
				a.billType = item.has("billType") ? item.getString("billType") : "";
				a.billStatus = item.has("billStatus") ? item.getInt("billStatus") : 0;
				a.pdBillName = item.has("pdBillName") ? item.getString("pdBillName") : "";
				a.pdPerson = item.has("pdPerson") ? item.getString("pdPerson") : "";

				a.startDate = item.has("startDate") ? item.getString("startDate") : "";
				a.endDate = item.has("endDate") ? item.getString("endDate") : "";
				a.useOrgId = item.has("useOrgId") ? item.getString("useOrgId") : "";
				a.useOrgName = item.has("useOrgName") ? item.getString("useOrgName") : "";
				a.classId = item.has("classId") ? item.getString("classId") : "";

				a.placeId = item.has("placeId") ? item.getString("placeId") : "";
				a.ownOrgId = item.has("ownOrgId") ? item.getString("ownOrgId") : "";
				a.ownOrgName = item.has("ownOrgName") ? item.getString("ownOrgName") : "";
				a.createPerson = item.has("createPerson") ? item.getString("createPerson") : "";
				a.createTime = item.has("createTime") ? item.getString("createTime") : "";
				a.remarks = item.has("remarks") ? item.getString("remarks") : "";

				if (!TextUtil.isNullOrEmpty(a.createTime) && a.createTime.length() > 10){
					a.createTime = a.createTime.substring(0, 10);
				}
				if (a.createTime.indexOf('-') < 0){
					a.createTime = DateUtil.getDateStr();
				}

				list.add(a);
			}
		}
		else{
			throw new Exception(message);
		}
		return list;
	}

	public List<InventoryDtlEntity> parseAndProcDtlData(final String content) throws Exception {

		List<InventoryDtlEntity> list = new ArrayList<>();
		JSONObject jsonObject = new JSONObject(content);
		int code = jsonObject.getInt("code");
		String message = jsonObject.getString("message");

		if (code == 1){
			JSONArray array = jsonObject.getJSONArray("data");
			Log.i("", array.toString());

			for (int i = 0; i < array.length(); ++i){

				JSONObject item = array.getJSONObject(i);
				InventoryDtlEntity a = new InventoryDtlEntity();

				a.tenantId = item.has("tenantId") ? item.getString("tenantId") : "";
				a.billNo = item.has("billNo") ? item.getString("billNo") : "";
				a.assetId = item.has("assetId") ? item.getString("assetId") : "";
				a.status = item.has("status") ? item.getInt("status") : 0;
				a.pdPerson = item.has("pdPerson") ? item.getString("pdPerson") : "";

				a.pdDate = item.has("pdDate") ? item.getString("pdDate") : "";
				a.modify = item.has("modify") ? item.getString("modify") : "";
				a.image = item.has("image") ? item.getString("image") : "";
				a.pdaSN = item.has("pdaSN") ? item.getString("pdaSN") : "";
				a.createPerson = item.has("createPerson") ? item.getString("createPerson") : "";
				a.createTime = item.has("createTime") ? item.getString("createTime") : "";
				a.updatePerson = item.has("updatePerson") ? item.getString("updatePerson") : "";
				a.updateTime = item.has("updateTime") ? item.getString("updateTime") : "";
				a.qty = 0;

				list.add(a);
			}
		}
		else{
			throw new Exception(message);
		}
		return list;
	}

	public void delHistory(){

		final int daysBefore = 30;
		String sql1 = "delete from "+INVENTORY_DETAIL+" where exists (select 1 from " +INVENTORY_MAIN+
				"where "+INVENTORY_DETAIL+".billNo="+INVENTORY_MAIN+".billNo and "+INVENTORY_MAIN+".createTime <=?);";
		String sql2 = "delete from "+INVENTORY_MAIN+" where createTime <=?;";

		try {
			mSqlite.beginTrans();
			Object[] arrParams = new Object[]{DateUtil.getDateStr(0 - daysBefore)};
			mSqlite.exeSqlStr(sql1, arrParams);
			mSqlite.exeSqlStr(sql2, arrParams);

			mSqlite.setTransSuccessful();
		}
		catch (Exception ex){
			ex.printStackTrace();
			LogSys.writeSysLog("delHistory", ex.toString());
		}
		finally {
			mSqlite.endTrans();
		}
	}

	public void delAll(int type){

		try {
			mSqlite.beginTrans();
			Object[] arrParams = new Object[0];
			String sql1 = "delete from "+INVENTORY_DETAIL;
			String sql2 = "delete from "+INVENTORY_MAIN;

			if (type == 0) {
				mSqlite.exeSqlStr(sql1, arrParams);
				mSqlite.exeSqlStr(sql2, arrParams);
			}
			else if (type == 1) {
				sql1 = "delete from stock_add_in_detail;";
				sql2 = "delete from stock_add_in;";
				mSqlite.exeSqlStr(sql1, arrParams);
				mSqlite.exeSqlStr(sql2, arrParams);

				sql1 = "delete from stock_in_detail;";
				sql2 = "delete from stock_in";
				mSqlite.exeSqlStr(sql1, arrParams);
				mSqlite.exeSqlStr(sql2, arrParams);
			}
			else{
				sql1 = "delete from stock_out_detail;";
				sql2 = "delete from stock_out;";
				mSqlite.exeSqlStr(sql1, arrParams);
				mSqlite.exeSqlStr(sql2, arrParams);
			}
			mSqlite.setTransSuccessful();
		}
		catch (Exception ex){
			ex.printStackTrace();
			LogSys.writeSysLog("delHistory", ex.toString());
		}
		finally {
			mSqlite.endTrans();
		}
	}
}
