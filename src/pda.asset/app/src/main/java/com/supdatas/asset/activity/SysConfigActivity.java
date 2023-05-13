package com.supdatas.asset.activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.blankj.utilcode.util.StringUtils;
import com.supdatas.asset.configure.ConfigConstants;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.R;
import com.supdatas.asset.frame.activity.BaseActivity;
import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.frame.utility.SysSound;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;

import butterknife.BindView;
import butterknife.OnClick;

public class SysConfigActivity extends BaseActivity {

    @BindView(R.id.et_url)
    protected EditText mEtUrl;

    @BindView(R.id.et_inven_power)
    protected EditText mEtInvenPower;

    @BindView(R.id.et_scan_mode)
    protected EditText mEtScanMode;

    @BindView(R.id.et_tenantid)
    protected EditText mEtTenantId;

    @BindView(R.id.btn_save)
    protected Button mBtnSave;

    //private SysSharedPreference mConfigSys;
    public String [] mArrayScanMode;

    @Override
    protected int getLayoutContentID(){

        return R.layout.activity_sys_config;
    }

    @Override
    protected void initView(Bundle savedInstanceState) {

        initTitleBar("系统设置");
        //mConfigSys = new SysSharedPreference(getApplicationContext());

        mEtUrl.setText(ConfigParams.mDataUrl);
        mEtInvenPower.setText(String.valueOf(ConfigParams.mInvenPower));
        mEtTenantId.setText(ConfigParams.tenantId);
    }

    @Override
    protected void initData() {
        super.initData();
        mArrayScanMode = getResources().getStringArray(R.array.scan_mode);
        mEtScanMode.setText(mArrayScanMode[ConfigParams.scanMode]);
    }

    @Override
    protected void onResume(){

        super.onResume();
    }

    @OnClick({R.id.btn_save,R.id.et_scan_mode})
    public void onClick(View view) {

        switch (view.getId()) {
            case R.id.btn_save:

                saveParam();
                break;
            case R.id.et_scan_mode:

                choiseScanMode();
                break;
        }
    }

    private void choiseScanMode(){
        selectFromItems(mArrayScanMode, "请选择采集方式", new OnSelectListener() {
            @Override
            public void onSelectItem(String itemStr, int index) {

                mEtScanMode.setText(mArrayScanMode[index]);
                ConfigParams.scanMode = index;
                MainApplication.mConfigSys.setItemIntValue(ConfigConstants.getInstance().SCAN_MODE, ConfigParams.scanMode);
            }
        });
    }

    private void saveParam(){

        String url = mEtUrl.getText().toString().trim();
        if (StringUtils.isEmpty(url)){

            showError("Web通讯地址不能为空！");
            mEtUrl.requestFocus();
            return;
        }
        ConfigParams.mDataUrl = url;

        String tenantId = mEtTenantId.getText().toString().trim();
        if (StringUtils.isEmpty(tenantId)){
            showError("租户Id不能为空！");
            mEtTenantId.requestFocus();
            return;
        }

        ConfigParams.tenantId = tenantId;
        //ConfigParams.mInvenPower = iPower;
        MainApplication.mConfigSys.setItemStrValue(ConfigConstants.getInstance().KEY_WEB_DATA_URL, ConfigParams.mDataUrl);
        MainApplication.mConfigSys.setItemStrValue(ConfigConstants.getInstance().KEY_TENANT_ID, ConfigParams.tenantId);
        //MainApplication.mConfigSys.setItemIntValue(ConfigConstants.getInstance().RFID_INVEN_POWER, ConfigParams.mInvenPower);

        SysSound.getIntance().playSound(2, 3);
        AlertUtil.showToast(mContext, "参数保存成功！");
    }

    /**
     * 实例化Activity实例
     *
     * @param context Context
     * @return 自身intent实例
     */
    public static Intent newInstance(Context context){

        Intent intent = new Intent(context, SysConfigActivity.class);
        return intent;
    }
}
