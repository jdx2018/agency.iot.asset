package com.supdatas.asset.activity;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Network;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.supdatas.asset.BuildConfig;
import com.supdatas.asset.activity.location.LocateActivity;
import com.supdatas.asset.frame.activity.BaseActivity;
import com.supdatas.asset.frame.activity.InputActivity;
import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;
import com.supdatas.asset.frame.utility.encryptAlgorithm.AESCBC128;
import com.supdatas.asset.configure.ConfigConstants;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.configure.SysConstants;
import com.supdatas.asset.R;
import com.spd.dbsk.DbClient;
import com.supdatas.asset.model.ReturnMsg;
import com.supdatas.asset.frame.utility.*;
import com.spd.upgrade.DataUpgradeApk;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import butterknife.BindView;
import butterknife.OnClick;
import io.socket.emitter.Emitter;

import com.spd.dbsk.DbClient;

public class LoginActivity extends BaseActivity {

	@BindView(R.id.et_user_code)
	EditText mEtUserName;

    @BindView(R.id.btn_login)
    Button mBtnLogin;

	private long mExitTime = 0;
	private boolean mSureToExit = false;

    @Override
    protected int getLayoutContentID(){

        return R.layout.activity_login;
    }

    @Override
    protected void initView(Bundle savedInstanceState) {

        initTitleBar(getString(R.string.login));
		initDataCfg();
		setBackVisibility(View.GONE);
		setGearVisibility(View.VISIBLE);

		if (BuildConfig.DEBUG){
			ConfigParams.userNo = "1010";
			ConfigParams.AuthorizedKey = "debug";
		}

		if (!TextUtil.isNullOrEmpty(ConfigParams.userNo)){
			mEtUserName.setText(ConfigParams.userNo);
		}
    }

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {

		switch (keyCode) {
			case KeyEvent.KEYCODE_BACK:
				if (event.getRepeatCount() == 0 && event.getAction() == KeyEvent.ACTION_DOWN) {
					exitSure();
				}
				break;
		}
		return false;
	}

	public boolean exitSure() {

		if (mSureToExit)
			return true;
		if ((System.currentTimeMillis() - mExitTime) > 2000) {
			showToastShort("再按一次退出.", false);
			mExitTime = System.currentTimeMillis();
		} else {
			mSureToExit = true;
			System.exit(0);
		}
		return true;
	}

    private void initDataCfg() {

		ConfigParams.userNo = MainApplication.mConfigSys.getItemStrValue(
				ConfigConstants.KEY_USER_NAME, ConfigParams.userNo);
		ConfigParams.accessToken = MainApplication.mConfigSys.getItemStrValue(
				ConfigConstants.KEY_ACCESS_TOKEN, ConfigParams.accessToken);
		ConfigParams.accessTokenDate = MainApplication.mConfigSys.getItemStrValue(
				ConfigConstants.KEY_ACCESS_TOKEN_DATE, ConfigParams.accessTokenDate);

		ConfigParams.mInvenPower = MainApplication.mConfigSys.getItemIntValue(
				ConfigConstants.getInstance().RFID_INVEN_POWER,	ConfigParams.mInvenPower);
		ConfigParams.mInPower = MainApplication.mConfigSys.getItemIntValue(
				ConfigConstants.getInstance().RFID_IN_POWER,	ConfigParams.mInPower);
		ConfigParams.mOutPower = MainApplication.mConfigSys.getItemIntValue(
				ConfigConstants.getInstance().RFID_OUT_POWER, ConfigParams.mOutPower);
		ConfigParams.mLocatePower = MainApplication.mConfigSys.getItemIntValue(
				ConfigConstants.getInstance().RFID_LOCATE_POWER, ConfigParams.mLocatePower);

		ConfigParams.scanMode = MainApplication.mConfigSys.getItemIntValue(
				ConfigConstants.getInstance().SCAN_MODE, ConfigParams.scanMode);
		ConfigParams.tenantId = MainApplication.mConfigSys.getItemStrValue(
				ConfigConstants.getInstance().KEY_TENANT_ID, ConfigParams.tenantId);
	}

    @OnClick({R.id.btn_login})
    public void onClick(View view) {

        switch (view.getId()) {

            case R.id.btn_login:

				login();
                break;
        }
    }

    @Override
	public void onClickGear(View view){

    	if (BuildConfig.DEBUG) {
			startActivity(SysConfigActivity.newInstance(mContext));
		}
    	else {
			Intent intent = InputActivity.newInstance(mContext, "密码", "", 8, 1, true, true, false);
			startActivityForResult(intent, 2);
		}
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data){

    	try {
			if (requestCode == 2 && resultCode == RESULT_OK) {

				String inputData = data.getStringExtra(InputActivity.INPUT_CONTENT);
				if (inputData.equalsIgnoreCase("87651234")) {

					startActivity(SysConfigActivity.newInstance(mContext));
				} else {
					showError("密码有误.");
				}
			} else if (requestCode == 10 && resultCode == RESULT_OK) {

				String inputData = data.getStringExtra(InputActivity.INPUT_CONTENT);
				getAuthoriseCode(inputData, true);
			}
		}
    	catch (Exception ex){
    		showError(ex.toString());
		}
	}

	/**for test*/
    private void testSocketJar(){

		dataAsync(mPromptDlg, new Runnable() {
			@Override
			public void run() {

				try {
					DbClient client = new DbClient(mContext, ConfigParams.mDataUrl, ConfigParams.seriesNo,
							ConfigParams.mIsDbClientDebugMode);

					JSONObject dataContent = null;
					JSONArray arrayContent = null;
					JSONObject item = null;

					//query
					JSONObject queryObject = new JSONObject();
					JSONObject fieldsObject = new JSONObject();

					queryObject.put("tenantId", "ms");
					fieldsObject.put("tenantId",0);
					fieldsObject.put("archiveNo",1);
					fieldsObject.put("epc",1);
					fieldsObject.put("roomId",0);

					final String content = client.query("base_archive", queryObject, fieldsObject);

					runOnUiThread(new Runnable() {
						@Override
						public void run() {
							mEtUserName.append(":" + content);
							AlertUtil.showAlert(mContext, content);
						}
					});
					client.close();
				}
				catch (Exception ex){

					showError(ex.getMessage());
				}
				finally {

					mPromptDlg.dismiss();
				}
			}
		});
	}

	/**for test*/
    private String encryptTest(String content){

    	try {
			Date now_date = new Date();
			DateFormat fmt = new SimpleDateFormat("yyyy-HH-dd MM:ss:mm");
			String curTime = fmt.format(now_date);
			String encrypted = AESCBC128.getAESEncode(content);
			AlertUtil.showToast(mContext, encrypted);

			return encrypted;
		}
    	catch (Exception ex){
    		ex.printStackTrace();
    		AlertUtil.showToast(mContext, ex.toString());
		}
    	return "";
	}

	/**for test*/
	private void decryptTest(){

		try {
			Date now_date = new Date();
			DateFormat fmt = new SimpleDateFormat("yyyy-HH-dd MM:ss:mm");
			String curTime = fmt.format(now_date);

			String str = "+0i1EuIlDCJihMKitaXZNg==";
			byte[]arrContent = Base64.decode(str, Base64.NO_WRAP);
			String content = AESCBC128.getAESDecode(arrContent);

			AlertUtil.showToast(mContext, content);
		}
		catch (Exception ex){
			ex.printStackTrace();
			AlertUtil.showToast(mContext, ex.toString());
		}
	}

	/**for test*/
	private void md5Test2() {

		try {
			Date now_date = new Date();
			DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
			String curDate = fmt.format(now_date);

			JSONObject jsonObject = new JSONObject();
			//jsonObject.put("command", 101);
			jsonObject.put("a", 1);    //{"sn":"86060606060606"}
			jsonObject.put("b", 2);
			final String body = jsonObject.toString();

			String en = encryptTest(body);
			String content = en + ConfigParams.salt + curDate;
			final String md5 = EncryptMethod.get32MD5(content);
			showInfor(md5);
		}
		catch (Exception ex){
			showError(ex.toString());
		}
	}

	/**for test*/
	private void md5Test(){

    	try {
			Date now_date = new Date();
			DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
			String curDate = fmt.format(now_date);

			JSONObject jsonObject = new JSONObject();
			//jsonObject.put("command", 101);
			jsonObject.put("sn", "86060606060606");	//{"sn":"86060606060606"}
			final String body = jsonObject.toString();

			String en = encryptTest(body);
			String content = en + ConfigParams.salt + curDate;
			final String md5 = EncryptMethod.get32MD5(content);

			dataAsync(mPromptDlg, new Runnable() {
				@Override
				public void run() {

					try {
						String url = "http://192.168.50.247:6202/iot/graphOperate";

						HashMap<String,String> headers = new HashMap<>();
						headers.put("signature", md5);
						ReturnMsg re = HttpUtility.httpPost(url, headers, body);

						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								mEtUserName.setText(re.toString());
								AlertUtil.showToast(mContext, re.toString());
							}
						});
					}
					catch (Exception e){
						e.printStackTrace();
						AlertUtil.showToast(mContext, e.toString());
					}
					finally {
						mPromptDlg.dismiss();
					}
				}
			});
		}
    	catch (Exception ex){
    		AlertUtil.showToast(mContext, ex.toString());
		}
	}

    private void login() {

		if (!authDevice()){
			return;
		}

    	final String userNo = mEtUserName.getText().toString().trim();
    	if (TextUtil.isNullOrEmpty(userNo)) {

			AlertUtil.showAlert(mContext, R.string.sys_prompt, R.string.empty_user_name);
    		return;
		}
    	if (!NetWorkUtil.isWifiConnected(mContext)){
    		showError(R.string.wifi_network_unconnected);
    		return;
		}
    	String curDate = DateUtil.getDateStr();
    	if(!curDate.equalsIgnoreCase(ConfigParams.accessTokenDate)) {

			dataAsync(mPromptDlg, new Runnable() {
				@Override
				public void run() {

					if (!BuildConfig.DEBUG){
						tryUpgrade();
					}

					DbClient dbClient = null;
					try {
						int dayOfYear = DateUtil.getDayOfYear();
						if (dayOfYear % 30 == 0) {
							getAuthCode(ConfigParams.AuthorizedKey, false);
						}
						//Thread.sleep(1000);

						dbClient = new DbClient(mContext, ConfigParams.mDataUrl, ConfigParams.seriesNo,
								ConfigParams.mIsDbClientDebugMode);
						boolean bVal = dbClient.login();

						mPromptDlg.dismiss();
						if (bVal) {

							ConfigParams.userNo = userNo;
							MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_USER_NAME, ConfigParams.userNo);
							runOnUiThread(new Runnable() {
								@Override
								public void run() {
									toMainMenu();
								}
							});
						}
					} catch (Exception ex) {
						Log.i(TAG, ex.toString());
						showError(ex.getMessage());  //io.socket.engineio.client.EngineIOException: xhr poll error
					} finally {
						dbClient.close();
						mPromptDlg.dismiss();
					}
				}
			});
		}
    	else{
    		toMainMenu();
		}
	}

	private  android.os.Handler myHander = new  android.os.Handler() {

		@Override
		public void handleMessage(Message message){

			switch (message.what){
				case 200:
					if (mPromptDlg != null && mPromptDlg.isShowing()){

					}
					break;
			}
		}
	};

	public static String getVersion(Context cxt) {
		try {
			PackageManager packageManager = cxt.getPackageManager();
			PackageInfo packageInfo = packageManager.getPackageInfo(cxt.getPackageName(), 0);
			String version = packageInfo.versionName;
			return version;
		} catch (Exception ex) {
			return "";
		}
	}

	private void getAuthoriseCode(final String inputCode, final boolean withPrompt){

		if (withPrompt && !NetWorkUtil.isNetworkConnected(mContext)){

			SysSound.getIntance().playSound(2, 3);
			AlertUtil.showToast(mContext, R.string.network_disconnected_prompt);
			return;
		}
		dataAsync(mPromptDlg, new Runnable() {
			@Override
			public void run() {
				try {
					getAuthCode(inputCode, withPrompt);
				}
				catch (Exception ex){
					ex.printStackTrace();
				}
				finally {
					if (withPrompt) {
						mPromptDlg.dismiss();
					}
				}
			}
		});
	}

	/**
	 * 升级检测
	 * @return 0表示已经为最新，无需更新，1表示需要更新,且下载升级文件成功，且有安装，-1表示出错
	 * */
	private int tryUpgrade(){

		try {
			String retMsg;
			JSONObject jsonObject;
			boolean bVal = false;

			retMsg = DataUpgradeApk.getServerVersion(ConfigParams.mUpgradeUrl,
					SysConstants.AppDirName.toLowerCase(),
					getPackageName(), myHander);		//
			jsonObject = new JSONObject(retMsg);
			bVal = jsonObject.getBoolean("status");
			final String msg = jsonObject.getString("message");

			if (!bVal) {

				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						Toast.makeText(LoginActivity.this, msg, Toast.LENGTH_LONG).show();
					}
				});
				//mProgressDlg.dismiss();
				return -1;
			}
			final String serverVersion = jsonObject.getString("version");
			if (serverVersion.equalsIgnoreCase("")) {
				//To Main menu
				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						//Toast.makeText(LoginActivity.this, msg, Toast.LENGTH_LONG).show();
					}
				});
				mPromptDlg.dismiss();
				return -1;
			}

			String curVer = getVersion(LoginActivity.this);
			if (serverVersion.compareTo(curVer) <= 0) {

				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						//Toast.makeText(LoginActivity.this, "系统已为最新！", Toast.LENGTH_LONG).show();
					}
				});
				return 0;
			} else {
				String retJson = DataUpgradeApk.getSpeProgram(LoginActivity.this,
						ConfigParams.mUpgradeUrl,
						SysConstants.AppDirName.toLowerCase(), getPackageName(),	//getPackageName().toLowerCase()
						serverVersion, ".apk", false, true, myHander);

				JSONObject jsonObject1 = new JSONObject(retJson);
				boolean bVal2 = jsonObject1.getBoolean("status");
				final String msg2 = jsonObject1.getString("message");
				final String fileFullPath = jsonObject1.getString("filefullpath");
				if (bVal2) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(LoginActivity.this, msg2 + " 文件为：" + fileFullPath,
                                    Toast.LENGTH_LONG).show();
                        }
                    });
					return 1;
				} else {
					runOnUiThread(new Runnable() {
						@Override
						public void run() {
							Toast.makeText(LoginActivity.this, msg2, Toast.LENGTH_LONG).show();
						}
					});
					return -1;
				}
			}
		}
		catch (Exception ex){
			ex.printStackTrace();

			mMsg = getString(R.string.error2) + ex.getMessage();
			mPromptDlg.dismiss();

			runOnUiThread(new Runnable() {
				@Override
				public void run() {

					AlertUtil.showAlert(mContext, mMsg,
							getString(R.string.sys_prompt));
					SysSound.getIntance().playSound(3, 3);
				}
			});
			return -1;
		}
	}

	private boolean authDevice(){

		if (!TextUtil.isNullOrEmpty(ConfigParams.AuthorizedKey)){

			return true;
		}
		SysSound.getIntance().playSound(2,3);
		AlertUtil.showToast(mContext, R.string.authorise_code_is_null);

		Intent intent = InputActivity.newInstance(LoginActivity.this, getString(R.string.authorise_code),
				"", 32, 2, false, false ,false);
		startActivityForResult(intent, 10);
		return false;
	}

	private int getAuthCode(final String inputCode, final boolean withPrompt) throws Exception {

		final String url = ConfigParams.mSupDeviceUrl;

		JSONObject jsMain = new JSONObject();
		JSONObject device = new JSONObject();
		jsMain.put("command", 601);
		jsMain.put("deviceActiveCode", inputCode);

		device.put("sn", TextUtil.isNullOrEmpty(ConfigParams.seriesNo) ? ConfigParams.imei : ConfigParams.seriesNo);
		device.put("imei", ConfigParams.imei);
		device.put("manufacturer", ConfigParams.Device_manufacturer);
		device.put("model", ConfigParams.Device_model);
		device.put("brand", ConfigParams.Device_brand);
		device.put("packageName", getPackageName());
		device.put("packageVersion", getVersion(mContext));

		jsMain.put("device", device);

		ReturnMsg returnMsg = HttpUtility.httpPost(url, jsMain.toString());
		Log.e("jsonParam", returnMsg.toString());

		if (returnMsg.status == 1) {
			JSONObject jsonResult = new JSONObject(returnMsg.content);
			int resultCode = jsonResult.getInt("code");
			if (resultCode != 1) {

				final String msg = jsonResult.getString("message");

				ConfigParams.AuthorizedKey = "";
				MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_COMPANYSIGN,
						ConfigParams.AuthorizedKey);

				if (withPrompt) {
					runOnUiThread(new Runnable() {
						@Override
						public void run() {

							SysSound.getIntance().playSound(2, 3);
							showError(msg);
						}
					});
				}
				throw new Exception(msg);
			} else {
				final String msg = jsonResult.getString("message");
				JSONObject jsData = jsonResult.getJSONObject("data");
				int status = jsData.has("status") ? jsData.getInt("status") : 0;
				if (status == 1) {

					ConfigParams.AuthorizedKey = inputCode;
					MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_COMPANYSIGN,
							ConfigParams.AuthorizedKey);
				} else {
					throw new Exception(msg);
				}
				if (withPrompt) {
					runOnUiThread(new Runnable() {
						@Override
						public void run() {
							AlertUtil.showToast(mContext, msg);
						}
					});
				}
				return status;
			}
		}
		else{
			throw new Exception(returnMsg.message);
		}
	}

	private void toMainMenu(){

		startActivity(MainMenuActivity.newInstance(mContext, ""));
	}

    @Override
    protected void onResume(){
        super.onResume();

        /*if (!BuildConfig.DEBUG){
        	mEtPwd.setText("");
		}
        else{
			mEtPwd.setText("123456");
		}*/
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

		try {
			MainApplication.instance().unregisterBatteryRec();
		}catch (Exception e){
			e.printStackTrace();
		}
    }

	/**
	 * 实例化Activity实例
	 *
	 * @param context Context
	 * @return 自身intent实例
	 */
	public static Intent newInstance(Context context, String paramVal){

		Intent intent = new Intent(context, LoginActivity.class);
		return intent;
	}
}