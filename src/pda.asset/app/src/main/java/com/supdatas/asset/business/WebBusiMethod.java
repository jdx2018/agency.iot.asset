package com.supdatas.asset.business;

import android.content.Context;
import android.util.Log;

import com.spd.dbsk.DbClient;
import com.supdatas.asset.R;
import com.supdatas.asset.frame.business.CommonMethod;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.model.BillStatusEnum;
import com.supdatas.asset.model.ReturnMsg;
import com.supdatas.asset.model.ScanEnum;
import com.supdatas.asset.model.in.InAddDtlEntity;
import com.supdatas.asset.model.in.InAddEntity;
import com.supdatas.asset.model.in.InBillStatusEnum;
import com.supdatas.asset.model.in.InBillTypeEnum;
import com.supdatas.asset.model.in.InDtlEntity;
import com.supdatas.asset.model.in.InEntity;
import com.supdatas.asset.model.in.InScanEnum;
import com.supdatas.asset.model.inventory.InventoryDtlEntity;
import com.supdatas.asset.model.inventory.InventoryEntity;
import com.supdatas.asset.model.out.OutBillStatusEnum;
import com.supdatas.asset.model.out.OutBillTypeEnum;
import com.supdatas.asset.model.out.OutDtlEntity;
import com.supdatas.asset.model.out.OutEntity;
import com.supdatas.asset.model.out.OutScanEnum;
import com.supdatas.asset.sqlite.TableName;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class WebBusiMethod extends WebGraphMethod {

	private Context mContext;

	public WebBusiMethod(Context cxt){
		mContext = cxt;
	}

	public ReturnMsg getServerInventory() throws Exception{

		InventoryEntity entity = new InventoryEntity();
		String body = entity.getDataRequestJson(ConfigParams.seriesNo);
		String sign = CommonMethod.getMd5(body);

		ReturnMsg returnMsg = getGraphData(ConfigParams.mDataUrl, sign, body);
		if (returnMsg.status == 1){

			JSONObject jsonObject = new JSONObject(returnMsg.content);
			int code = jsonObject.getInt("code");
			String message = jsonObject.getString("message");
			returnMsg.message = message;
			returnMsg.status = code;

			if (code == 1){
				returnMsg.status = 1;
				JSONArray array = jsonObject.getJSONArray("data");
				Log.i("", array.toString());

				//{"code":1,"message":"success","data":[{"tenantId":"ms","archiveNo":"A00001","epc":"CCAE00663620170725000502","archiveDepartment":"2","archiveType":1,"archiveStatus":1,"roomId":"1001","accountBank":"1","accountOrgName":"东北分行","accountstatus":"1","openDate":"2020-07-07T16:00:00.000Z","destructDate":null,"customerNo":null,"customerName":null,"stockInDate":"2020-07-07T16:00:00.000Z","createTime":"2020-07-08T07:58:22.000Z","createPerson":null,"updateTime":"2020-07-08T07:58:22.000Z","updatePerson":null,"remarks":null},{"tenantId":"ms","archiveNo":"A00002","epc":"CCAE00663620170725000503","archiveDepartment":"2","archiveType":1,"archiveStatus":1,"roomId":"1001","accountBank":"1","accountOrgName":"东北分行","accountstatus":"1","openDate":"2020-07-07T16:00:00.000Z","destructDate":null,"customerNo":null,"customerName":null,"stockInDate":"2020-07-07T16:00:00.000Z","createTime":"2020-07-08T08:00:23.000Z","createPerson":null,"updateTime":"2020-07-08T08:00:23.000Z","updatePerson":null,"remarks":null}]}
				List<InventoryEntity> list = new ArrayList<>();
				for (int i = 0; i < array.length(); ++i){

					JSONObject item = array.getJSONObject(i);

					InventoryEntity a = new InventoryEntity();
					a.tenantId = item.has("tenantId") ? item.getString("tenantId") : "";
					a.billNo = item.has("billNo") ? item.getString("billNo") : "";
					a.createTime = item.has("createTime") ? item.getString("createTime") : "";
					a.createPerson = item.has("createPerson") ? item.getString("createPerson") : "";

					list.add(a);
				}
				returnMsg.message = String.format("下载成功，共下载%d条单据.", list.size());
				Inventory inventory = new Inventory(mContext);
				inventory.insert(list, new ArrayList<InventoryDtlEntity>());
			}
		}
		return returnMsg;
	}

	public ReturnMsg getServerInventoryDtl(final InventoryEntity mainEntity) throws Exception{

		InventoryDtlEntity entity = new InventoryDtlEntity();
		String body = entity.getDataRequestJson(mainEntity.billNo, ConfigParams.seriesNo);
		String sign = CommonMethod.getMd5(body);

		ReturnMsg returnMsg = getGraphData(ConfigParams.mDataUrl, sign, body);
		if (returnMsg.status == 1){

			JSONObject jsonObject = new JSONObject(returnMsg.content);
			int code = jsonObject.getInt("code");
			String message = jsonObject.getString("message");
			returnMsg.message = message;
			returnMsg.status = code;

			if (code == 1){
				returnMsg.status = 1;
				JSONArray array = jsonObject.getJSONArray("data");
				Log.i("", array.toString());

				//{"code":1,"message":"success","data":[{"tenantId":"ms","archiveNo":"A00001","epc":"CCAE00663620170725000502","archiveDepartment":"2","archiveType":1,"archiveStatus":1,"roomId":"1001","accountBank":"1","accountOrgName":"东北分行","accountstatus":"1","openDate":"2020-07-07T16:00:00.000Z","destructDate":null,"customerNo":null,"customerName":null,"stockInDate":"2020-07-07T16:00:00.000Z","createTime":"2020-07-08T07:58:22.000Z","createPerson":null,"updateTime":"2020-07-08T07:58:22.000Z","updatePerson":null,"remarks":null},{"tenantId":"ms","archiveNo":"A00002","epc":"CCAE00663620170725000503","archiveDepartment":"2","archiveType":1,"archiveStatus":1,"roomId":"1001","accountBank":"1","accountOrgName":"东北分行","accountstatus":"1","openDate":"2020-07-07T16:00:00.000Z","destructDate":null,"customerNo":null,"customerName":null,"stockInDate":"2020-07-07T16:00:00.000Z","createTime":"2020-07-08T08:00:23.000Z","createPerson":null,"updateTime":"2020-07-08T08:00:23.000Z","updatePerson":null,"remarks":null}]}
				List<InventoryEntity> listMain = new ArrayList<InventoryEntity>();
				listMain.add(mainEntity);
				List<InventoryDtlEntity> list = new ArrayList<>();
				for (int i = 0; i < array.length(); ++i){

					JSONObject item = array.getJSONObject(i);

					InventoryDtlEntity a = new InventoryDtlEntity();
//					a.tenantId = item.has("tenantId") ? item.getString("tenantId") : "";
//					a.billNo = item.has("billNo") ? item.getString("billNo") : "";
//					a.archiveNo = item.has("archiveNo") ? item.getString("archiveNo") : "";
//					a.status = item.has("status") ? item.getInt("status") : 0;
//					a.createTime = item.has("createTime") ? item.getString("createTime") : "";
//					a.createPerson = item.has("createPerson") ? item.getString("createPerson") : "";

					list.add(a);
				}
				Inventory inventory = new Inventory(mContext);
				inventory.insert(listMain, list);
			}
		}
		return returnMsg;
	}

	public ReturnMsg uploadInventoryDtlOrigin(final InventoryEntity mainEntity,
										final List<InventoryDtlEntity> listDtl) throws Exception{

		InventoryDtlEntity entity = new InventoryDtlEntity();
		String body = entity.getDataPostJson(mainEntity.billNo, ConfigParams.seriesNo,
				listDtl);
		String sign = CommonMethod.getMd5(body);

		ReturnMsg returnMsg = getGraphData(ConfigParams.mDataUrl, sign, body);
		if (returnMsg.status == 1){

			JSONObject jsonObject = new JSONObject(returnMsg.content);
			int code = jsonObject.getInt("code");
			String message = jsonObject.getString("message");
			returnMsg.message = message;
			returnMsg.status = code;
		}
		return returnMsg;
	}

	public boolean uploadInventoryDtl(final InventoryEntity mainEntity,
										final List<InventoryDtlEntity> listDtl) throws Exception{

		if (listDtl.size() < 1) {
			throw new Exception(mContext.getString(R.string.no_scaned_data));
		}
		DbClient client = null;
		try {
			client = new DbClient(mContext, ConfigParams.mDataUrl, ConfigParams.seriesNo,
					ConfigParams.mIsDbClientDebugMode);
			String connectId = client.getConnector();

			//单据状态判断
			String content = client.query(connectId, TableName.TENANT_INVENTORY,
					InventoryEntity.getQuery(ConfigParams.tenantId, mainEntity.billNo),
					InventoryEntity.getFields());
			Inventory inven = new Inventory(mContext);

			List<InventoryEntity> listMain = inven.parseAndProcMainData(content);
			if (listMain != null && listMain.size() > 0) {
				if (listMain.get(0).billStatus == BillStatusEnum.UPLOADED.getCode()){
					throw new Exception("该单据后台已经确认，不能再上传修改.");
				}
			}
			if (listMain.size() < 1){
				throw new Exception("该单据在后台已经不存在，请检查具体原因.");
			}
			client.beginTrans(connectId);
			JSONObject query = null;
			JSONObject dataContent = null;
			boolean hasUnFinished = false;

			for (InventoryDtlEntity item : listDtl) {

				query = new JSONObject();
				dataContent = new JSONObject();

				query.put("tenantId", ConfigParams.tenantId);
				query.put("billNo", mainEntity.billNo);
				query.put("assetId", item.assetId);

				dataContent.put("status", item.status);
				dataContent.put("updateTime", DateUtil.getDateTimeStr1());
				dataContent.put("updatePerson", ConfigParams.userNo);

				if (!hasUnFinished && item.status == ScanEnum.UNSCANED.getCode()){
					hasUnFinished = true;
				}

				content = client.update(connectId, TableName.TENANT_INVENTORY_DETAIL, query, dataContent);
				procResult(content, client, connectId);
			}
			query = new JSONObject();
			dataContent = new JSONObject();

			query.put("tenantId", ConfigParams.tenantId);
			query.put("billNo", mainEntity.billNo);
			dataContent.put("billStatus", BillStatusEnum.UPLOADED.getCode());
			dataContent.put("updateTime", DateUtil.getDateTimeStr1());
			dataContent.put("updatePerson", ConfigParams.userNo);

			content = client.update(connectId, TableName.TENANT_INVENTORY, query, dataContent);
			procResult(content, client, connectId);

			content = client.commitTrans(connectId);
			procResult(content, client, connectId);

			return true;
		}
		catch (Exception ex){
			throw ex;
		}
		finally {
			if (client != null){
				client.close();
			}
		}
	}

	private boolean procResult(final String content, final DbClient dbClient, final String connectId)
			throws Exception {

		JSONObject rst = new JSONObject(content);
		int code = rst.getInt("code");
		if (code != 1){

			dbClient.rollbackTrans(connectId);
			String message = rst.getString("message");
			throw new Exception(message);
		}
		return true;
	}

	private int getNewInBillType(OutBillTypeEnum obte) {

		if (obte.getTypeCode() == OutBillTypeEnum.BORROW_OUT.getTypeCode()) {
			return InBillTypeEnum.RETURN_IN.getTypeCode();
		}
		else if (obte.getTypeCode() == OutBillTypeEnum.TRANSFER_OUT.getTypeCode()) {
			return InBillTypeEnum.TRANSFER_IN.getTypeCode();
		}
		else {
			return InBillTypeEnum.DESTROY_IN.getTypeCode();
		}
	}
	private String getNewInBillNo(OutBillTypeEnum outBillTypeEnum){

		if (outBillTypeEnum.getTypeCode() == OutBillTypeEnum.BORROW_OUT.getTypeCode()){
			return "GHRK" + DateUtil.getDateTimeStr();
		}
		else if (outBillTypeEnum.getTypeCode() == OutBillTypeEnum.TRANSFER_OUT.getTypeCode()){
			return "YKRK" + DateUtil.getDateTimeStr();
		}
		else {
			return "XHRK" + DateUtil.getDateTimeStr();
		}
	}
}
