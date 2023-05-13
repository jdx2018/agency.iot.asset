package com.supd.dbsktest;

import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import com.spd.upgrade.DataUpgradeApk;
import com.spd.dbsk.DbClient;

import java.io.File;
import java.util.Random;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

	private Button mBtnJarTest;

	private TextView mTvMsg;
	private Button mBtnGetConnection;
	private Button mBtnQuery1;
	private Button mBtnQuery2;
	private Button mBtnInsert1;
	private Button mBtnInsert2;
	private Button mBtnUpdate;
	private Button mBtnDelete;
	private Button mBtnTrans1;
	private Button mBtnBatch;
	private Button mBtnClose;
	private Button mBtnClearResult;

	private ProgressDialog mProgressDialog;

	public static String packageName = "com.supd.upgrade";
	public static String clientCode = "upgrade-test";

	private String mServerVersion = "";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		//http://pu.supoin.com//api/Params/GetParams?packageName=cn.syman.emix&clientCode=bojun1
		//packageName = "cn.syman.emix";
		//clientCode = "bojun";

		mTvMsg = (TextView)findViewById(R.id.tv_message);

		mBtnJarTest = (Button)findViewById(R.id.btn_jar_test);
		mBtnJarTest.setOnClickListener(this);
		mBtnGetConnection = (Button)findViewById(R.id.btn_get_data_connect);
		mBtnGetConnection.setOnClickListener(this);

		mBtnQuery1 = (Button)findViewById(R.id.btn_query1);
		mBtnQuery1.setOnClickListener(this);
		mBtnQuery2 = (Button)findViewById(R.id.btn_query2);
		mBtnQuery2.setOnClickListener(this);

		mBtnInsert1 = (Button)findViewById(R.id.btn_insert1);
		mBtnInsert1.setOnClickListener(this);
		mBtnInsert2 = (Button)findViewById(R.id.btn_insert2);
		mBtnInsert2.setOnClickListener(this);

		mBtnUpdate = (Button)findViewById(R.id.btn_update);
		mBtnUpdate.setOnClickListener(this);
		mBtnDelete = (Button)findViewById(R.id.btn_delete);
		mBtnDelete.setOnClickListener(this);

		mBtnTrans1 = (Button)findViewById(R.id.btn_trans1);
		mBtnTrans1.setOnClickListener(this);

		mBtnBatch = (Button)findViewById(R.id.btn_batch);
		mBtnBatch.setOnClickListener(this);

		mBtnClose = (Button)findViewById(R.id.btn_close);
		mBtnClose.setOnClickListener(this);

		mBtnClearResult = (Button)findViewById(R.id.btn_clear_result);
		mBtnClearResult.setOnClickListener(this);

		mTvMsg.setText("V-" + getVersion());
	}

	/**服务端地址*/
	private String mIoSocketUrl = "http://iot.supoin.com:6103";

	/**客户端连接*/
	private DbClient mDbClient = null;

	/**设备Sn，在使用前必须要进行注册*/
	private String mDeviceSn = "374sU5Xa3K2110XXiXA720H3702117";

	/**要访问的后端数据表*/
	private String mTableName = "base_archive";

	/**是否启用连接调试模式，true为调试模式，此在内部存储的根目录supdata文件夹按日期会记录当前会话的请求和返回数据日志*/
	private boolean mIsDebugMode = true;

	/**接收内容临时存储变量*/
	private String mContent;

	@Override
	public void onClick(View v){

		if (v.getId() == R.id.btn_jar_test){
			tryUpgradeJarTest();
			return;
		}
		else if (v.getId() == R.id.btn_clear_result){
			mTvMsg.setText("");
			return;
		}

		if (mProgressDialog != null && mProgressDialog.isShowing())
			mProgressDialog.dismiss();
		mProgressDialog = progressDlg1(MainActivity.this, "系统提示", "正在处理，请稍等...",
				"OK", "Cancel", false, true, null,null);
		mProgressDialog.show();
		mTvMsg.setText("");

		if (v.getId() == R.id.btn_get_data_connect){

			executeProc(new Runnable() {
				@Override
				public void run() {

					try {
						if (mDbClient != null && mDbClient.isConnected()){
							mDbClient.close();
							mDbClient = null;
						}
						//初始化DbClient, DbClient封装了IOSocket连接服务端，以及通过该连接按指定规则访问、直接操作服务端数据库操作的功能，就类似于在WinForm本地直接操作数据库一样
						mDbClient = new DbClient(MainActivity.this, mIoSocketUrl, mDeviceSn, mIsDebugMode);
						mDbClient.setTimeOut(20 * 1000);

						//获取后端数据库连接，在执行事务的时候，必须要先获取连接,并把此连接id传入对应方法的connectId形参内，
						//连接后，也可以通过mDbClient.getConnectId()获取该值，在执行非事务方法时，
						//执行方法的时候此connectId参数可以传空值进去或不传，具体见下方btn_query1执行方法
						String connectId = mDbClient.getConnector();

						setMsg("连接成功: " + connectId);
					}
					catch (Exception ex){

						ex.printStackTrace();
						toast2(ex.toString());
					}
					finally {
						mProgressDialog.dismiss();
					}
				}
			});
			return;
		}
		if (mDbClient == null || !mDbClient.isConnected()) {

			mProgressDialog.dismiss();
			toast("未连接，请先连接");
			return;
		}
		if (v.getId() == R.id.btn_close){

			executeProc(new Runnable() {
				@Override
				public void run() {

					try {
						mDbClient.close();
						setMsg("断开连接成功。");
					}
					catch (Exception ex){

						ex.printStackTrace();
						toast2(ex.toString());
					}
					finally {
						mProgressDialog.dismiss();
					}
				}
			});
			return;
		}
		else if (v.getId() == R.id.btn_query1){

			executeProc(new Runnable() {
				@Override
				public void run() {

					try {
						//select查询数据库
						JSONObject queryObject = new JSONObject();
						JSONObject fieldsObject = new JSONObject();

						//where条件部分
						queryObject.put("tenantId", "CMBC_GZ");
						queryObject.put("archiveNo", "A0090001");

						//要求获取返回的列字段，1,为要返回的列字段,0表示不要返回的列字段
						fieldsObject.put("tenantId", 1);
						fieldsObject.put("archiveNo", 1);
						fieldsObject.put("epc", 1);
						fieldsObject.put("openDate", 1);
						fieldsObject.put("roomId", 0);

						final String request = queryObject.toString();
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("request:" + request + "\r\n");
							}
						});

						//mContent = mDbClient.query(null, mTableName, queryObject, fieldsObject);	//227
						//mContent = mDbClient.query(mTableName, queryObject, fieldsObject);		//228
						//执行该方法与执行上述的两行227，228的效果相同，其他单个方法的应用与此相同
						mContent = mDbClient.query(mDbClient.getConnectId(), mTableName, queryObject, fieldsObject);

						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result:" + mContent + "\r\n");
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {

						mProgressDialog.dismiss();
					}
				}
			});
		}
		else if (v.getId() == R.id.btn_query2){

			executeProc(new Runnable() {
				@Override
				public void run() {
					try {
						//select-查询复杂条件
						JSONObject queryObject = new JSONObject();
						JSONObject fieldsObject = new JSONObject();

						//where
						queryObject.put("tenantId", "CMBC_GZ");

						JSONObject jsIn = new JSONObject();
						JSONArray jsonArray = new JSONArray();
						//sql-where查询-in条件
						jsonArray.put("A0090001");
						jsonArray.put("A00000000000000000000090");
						jsonArray.put("33330000");
						jsIn.put("$in", jsonArray);
						queryObject.put("epc", jsIn);

						//sql-where-openDate大于等于2020-07-25
						JSONObject gt = new JSONObject();
						gt.put("$gte", "2020-07-25");
						queryObject.put("openDate", gt);

						//要求获取返回的列字段，1,为要返回的列字段,0表示不要返回的列字段
						fieldsObject.put("tenantId", 1);
						fieldsObject.put("archiveNo", 1);
						fieldsObject.put("epc", 1);
						fieldsObject.put("openDate", 1);
						fieldsObject.put("roomId", 0);

						final String request = queryObject.toString();
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("request:" + request + "\r\n");
							}
						});
						mContent = mDbClient.query(mDbClient.getConnectId(), mTableName, queryObject, fieldsObject);

						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result:" + mContent + "\r\n");
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {

						mProgressDialog.dismiss();
					}
				}
			});
		}
		else if (v.getId() == R.id.btn_insert1){

			executeProc(new Runnable() {
				@Override
				public void run() {
					try {
						//插入1条数据，准备插入内容
						JSONObject item = new JSONObject();
						item = new JSONObject();
						item.put("tenantId", "CMBC_GZ");
						item.put("archiveNo", "A003002321"+new Random().nextInt(10000));
						item.put("epc", "BBBB0004");
						item.put("archiveType", 1);
						item.put("archiveStatus", 1);
						item.put("roomId", "1001");
						item.put("userName", "lucy");
						item.put("accountBank", 1);
						item.put("accountStatus", 1);
						item.put("openDate", "2020-07-14");
						item.put("archiveDepartment", 2);
						item.put("accountOrgName", "东北支行");
						item.put("stockInDate","2020-09-21");

						mContent = mDbClient.insert(mDbClient.getConnectId(), mTableName, item);
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result:" + mContent);
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {

						mProgressDialog.dismiss();
					}
				}
			});
		}
		else if (v.getId() == R.id.btn_insert2){

			executeProc(new Runnable() {
				@Override
				public void run() {
					try {
						//insert many，插入多条
						JSONArray arrayContent = new JSONArray();
						JSONObject item;
						for (int i = 0; i < 3; ++i){

							item = new JSONObject();
							item.put("tenantId", "CMBC_GZ");
							item.put("archiveNo", String.format("A009%04d", i)+new Random().nextInt(9999)+new Random().nextInt(123));
							item.put("epc", String.format("AA26%04d", i)+new Random().nextInt(10000));
							item.put("archiveType", 1);
							item.put("archiveStatus", 1);
							item.put("roomId", "1010");
							item.put("accountBank", 1);
							item.put("accountStatus", 1);
							item.put("openDate", "2020-07-14");
							item.put("archiveDepartment", 2);
							item.put("accountOrgName", "车公庙支行");
							item.put("stockInDate","2020-07-23");
							item.put("userName", "lucy");

							arrayContent.put(item);
						}

						mContent = mDbClient.insertMany(mDbClient.getConnectId(), mTableName, arrayContent);
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result:" + mContent + "\r\n");
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {

						mProgressDialog.dismiss();
					}
				}
			});
		}
		else if (v.getId() == R.id.btn_update){

			executeProc(new Runnable() {
				@Override
				public void run() {
					try {
						//update 更新参数不能为空
						JSONObject queryObject = new JSONObject();
						JSONObject fieldsObject = new JSONObject();

						//where
						queryObject.put("tenantId", "CMBC_GZ");

						//更新的字段及内容
						fieldsObject.put("openDate", "2020-07-28");
						fieldsObject.put("roomId", "11122");

						mContent = mDbClient.update(mDbClient.getConnectId(), mTableName, queryObject,fieldsObject);
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result:" + mContent + "\r\n");
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {

						mProgressDialog.dismiss();
					}
				}
			});
		}
		else if (v.getId() == R.id.btn_delete){

			executeProc(new Runnable() {
				@Override
				public void run() {
					try {
						//delete 删除参数不能为空
						JSONObject queryObject = new JSONObject();
						//where
						queryObject.put("epc", "AA230002");

						mContent = mDbClient.delete(mDbClient.getConnectId(), mTableName, queryObject);
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("delete result:" + mContent + "\r\n");
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {

						mProgressDialog.dismiss();
					}
				}
			});
		}
		else if (v.getId() == R.id.btn_trans1){

			executeProc(new Runnable() {
				@Override
				public void run() {
					try {
						//事务操作
						JSONObject queryObject = new JSONObject();
						//where-delete
						queryObject.put("epc", "AA260000");
						JSONObject queryObject2 = new JSONObject();
						JSONObject fieldsObject = new JSONObject();
						//where-update
						queryObject2.put("accountOrgName", "福民支行");

						//更新的字段及内容
						fieldsObject.put("openDate", "2020-07-23");
						fieldsObject.put("roomId", "1004");

						//开始事务
						mDbClient.beginTrans(mDbClient.getConnectId());

						mContent = mDbClient.delete(mDbClient.getConnectId(), mTableName, queryObject);
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result 1:" + mContent + "\r\n");
							}
						});

						JSONObject jsonObject = new JSONObject(mContent);
						int code = jsonObject.getInt("code");
						if (code != 1) {
							//出错，回滚事务
							mDbClient.rollbackTrans(mDbClient.getConnectId());
							return;
						}
						mContent = mDbClient.update(mDbClient.getConnectId(), mTableName, queryObject2, fieldsObject);
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result 2:" + mContent + "\r\n");
							}
						});

						jsonObject = new JSONObject(mTableName);
						code = jsonObject.getInt("code");
						if (code != 1){
							//出错，回滚事务
							mDbClient.rollbackTrans(mDbClient.getConnectId());
							return;
						}
						//提交事务
						mContent = mDbClient.commitTrans(mDbClient.getConnectId());
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("result 3:" + mContent + "\r\n");
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {
						mProgressDialog.dismiss();
					}
				}
			});
		}
		else if (v.getId() == R.id.btn_batch){

			executeProc(new Runnable() {
				@Override
				public void run() {
					try {

						//批量操作数据库
						final JSONArray arrayContent = new JSONArray();
						JSONObject item = new JSONObject();
						JSONObject query = new JSONObject();
						JSONObject data = new JSONObject();

						//where
						query.put("billNo", "XZRK20200914165111");
						query.put("archiveNo", "A0103021998021787372022240101018978");
						//update字段内容
						data.put("status", 1);
						data.put("updateTime", "2021-09-09");
						data.put("updatePerson", "kavin-" + new Random().nextInt(1000));
						//要进行的操作，update
						item.put("operate", "update");
						//要操作的表
						item.put("tableName", "stock_add_in_detail");    //tableName: "stock_add_in_detail",
						//设置Where
						item.put("query", query);
						//设置操作的内容
						item.put("dataContent", data);
						arrayContent.put(item);			//可设置多个

						item = new JSONObject();
						query = new JSONObject();
						data = new JSONObject();
						query.put("billNo", "XZRK20200914165111");
						query.put("archiveNo", "A0103021999081887372022210201141688");
						data.put("status", 1);
						data.put("updateTime", "2021-09-16");
						data.put("updatePerson", "kavin-" + new Random().nextInt(1000));
						item.put("operate", "update");
						item.put("tableName", "stock_add_in_detail");
						item.put("query", query);
						item.put("dataContent", data);
						arrayContent.put(item);			//可设置多个

						mContent = mDbClient.batch(mDbClient.getConnectId(), arrayContent);

						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mTvMsg.append("Batch result:" + mContent + "\r\n");
							}
						});
					}
					catch (Exception ex){
						ex.printStackTrace();
					}
					finally {
						mProgressDialog.dismiss();
					}
				}
			});
		}
	}

	private void executeProc(Runnable runnable) {

		new Thread(runnable).start();
	}

	private  void toast(String msg){

		Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
	}

	private  void toast2(final String msg){

		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
			}
		});
	}

	private void setMsg(final String msg){

		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				mTvMsg.setText(msg);
			}
		});
	}

	private void tryUpgradeJarTest() {

		mProgressDialog = progressDlg1(MainActivity.this, "系统提示", "正在获取，请稍等...",
				"OK", "Cancel", false, true, null,null);
		mProgressDialog.show();
		final String url = "http://pu.supoin.com";
		//final String url = "http://192.168.1.36:6001";

		new Thread(new Runnable() {
			@Override
			public void run() {

				try {

					//实际使用时，clientCode,	packageName的值改为app的对应值
					String retMsg = DataUpgradeApk.getServerVersion(url,
							clientCode,	packageName, myHander);
					JSONObject jsonObject = new JSONObject(retMsg);
					boolean bVal = jsonObject.getBoolean("status");
					final String msg = jsonObject.getString("message");

					if (!bVal){

						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
							}
						});
						mProgressDialog.dismiss();
						return;
					}
					mServerVersion = jsonObject.getString("version");
					if (mServerVersion.equalsIgnoreCase("")) {
						//To Main menu
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
							}
						});
						mProgressDialog.dismiss();
						return;
					}

					String curVer = getVersion();
					if (mServerVersion.compareTo(curVer) <= 0) {

						Toast.makeText(MainActivity.this, "系统已为最新！", Toast.LENGTH_LONG).show();
					}
					else {
						String updateFileDir = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator +
								"supdatas" + File.separator;
						String retJson = DataUpgradeApk.getSpeProgram(MainActivity.this,
								url, clientCode, packageName, mServerVersion,
								".zip", true, true, updateFileDir, myHander);

						JSONObject jsonObject1 = new JSONObject(retJson);
						boolean bVal2 = jsonObject1.getBoolean("status");
						final String msg2 = jsonObject1.getString("message");
						final String fileFullPath = jsonObject1.getString("filefullpath");
						if (bVal2){
							runOnUiThread(new Runnable() {
								@Override
								public void run() {
									Toast.makeText(MainActivity.this, msg2 + " 文件为：" +fileFullPath,
											Toast.LENGTH_LONG).show();
								}
							});
						}
						else{
							runOnUiThread(new Runnable() {
								@Override
								public void run() {
									Toast.makeText(MainActivity.this, msg2, Toast.LENGTH_LONG).show();
								}
							});
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				mProgressDialog.dismiss();  // 完成后消失
			}
		}).start();
	}

	private Handler myHander = new Handler(){

		@Override
		public void handleMessage(Message message){

			switch (message.what){
				case 200:
					if (mProgressDialog != null && mProgressDialog.isShowing()){

						mProgressDialog.setMessage(message.obj.toString());
					}
					break;
			}
		}
	};

	private String getVersion() {
		try {
			PackageManager packageManager = getPackageManager();
			PackageInfo packageInfo = packageManager.getPackageInfo(getPackageName(), 0);
			String version = packageInfo.versionName;
			return version;
		} catch (Exception ex) {
			return "";
		}
	}

	public static ProgressDialog progressDlg1(Context cxt, String title, String msg, String OKMsg, String cancelMsg,
											  boolean cancelable, boolean canceledTouchOutside,
											  DialogInterface.OnClickListener onOK,
											  DialogInterface.OnClickListener onCancel) {
		ProgressDialog dialog = new ProgressDialog(cxt);
		dialog.setTitle(title);
		dialog.setMessage(msg);
		if (onOK != null)
			dialog.setButton(DialogInterface.BUTTON_POSITIVE, OKMsg, onOK);
		if (onCancel != null)
			dialog.setButton(DialogInterface.BUTTON_NEGATIVE, cancelMsg, onCancel);
		dialog.setIndeterminate(true);
		dialog.setCanceledOnTouchOutside(canceledTouchOutside);
		dialog.setCancelable(cancelable);
		return dialog;
	}
}
