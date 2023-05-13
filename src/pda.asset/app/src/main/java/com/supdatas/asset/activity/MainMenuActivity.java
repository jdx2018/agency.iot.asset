package com.supdatas.asset.activity;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.OrientationHelper;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;

import com.supdatas.asset.BuildConfig;
import com.supdatas.asset.R;

import com.supdatas.asset.activity.divider.MainMenuDivider;
import com.supdatas.asset.activity.inventory.InvenMainActivity;
import com.supdatas.asset.activity.listener.RecyclerItemClickListener;
import com.supdatas.asset.activity.location.LocateActivity;
import com.supdatas.asset.activity.query.QueryActivity;
import com.supdatas.asset.business.Inventory;
import com.supdatas.asset.frame.activity.BaseActivity;
import com.supdatas.asset.frame.activity.InputActivity;
import com.supdatas.asset.frame.utility.NetWorkUtil;
import com.supdatas.asset.frame.utility.OtherUtil;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;

import com.supdatas.asset.business.LogSys;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.model.MainMenuEntity;
import com.supdatas.asset.business.base.Asset;
import com.supdatas.asset.business.base.AssetClass;
import com.supdatas.asset.model.asset.AssetClassEntity;
import com.supdatas.asset.model.asset.AssetEntity;
import com.supdatas.asset.business.base.AssetPlace;
import com.supdatas.asset.model.asset.AssetPlaceEntity;

import java.util.ArrayList;
import java.util.List;

import com.spd.dbsk.DbClient;

import butterknife.BindView;
import butterknife.OnClick;

public class MainMenuActivity extends BaseActivity {

    @BindView(R.id.recyclerview)
    RecyclerView mRecyclerview;

    @BindView(R.id.et_user)
    EditText mEtUser;

    private MainMenuAdapter mMainMenuAdapter;

    private List<MainMenuEntity> mListMenuData = new ArrayList<MainMenuEntity>();

    @Override
    protected int getLayoutContentID() {

        return R.layout.activity_main_menu;
    }

    @Override
    protected void initView(Bundle savedInstanceState) {

        initTitleBar(getString(R.string.main_menu) + " v" + OtherUtil.getVersion(this));

        int column = 3;
        mRecyclerview.setLayoutManager(new GridLayoutManager(mContext, column));
        setViewData();

        MainMenuDivider divider = new MainMenuDivider(
                new ColorDrawable(getResources().getColor(R.color.light_grey5)), OrientationHelper.VERTICAL,
                column, 1, false);

        divider.setMargin(1, 5, 1, 5);      //单位:px
        divider.setHeight(1);
        mRecyclerview.addItemDecoration(divider);
        mMainMenuAdapter = new MainMenuAdapter(mContext, mListMenuData);
        mRecyclerview.setAdapter(mMainMenuAdapter);

        //on touch
        mRecyclerview.addOnItemTouchListener(new RecyclerItemClickListener(mContext) {
            @Override
            protected void onItemClick(View view, int position) {

                onMenuTouch(position);
            }
        });

        syncData(false);
    }

    @Override
    protected void initData(){

        mEtUser.setText(ConfigParams.userNo);
    }

    @OnClick({R.id.btn_test})
    public void onClick(View v) {

        switch (v.getId()) {

            case R.id.btn_test:
                break;
        }
    }

    private void popupWindow(View v){

        int gravity = Gravity.CENTER_VERTICAL;
        popupInputWindow(this, v, "请录入条形码", "区域", false,
                gravity, 0, 100, new OnInputListener() {
            @Override
            public void onInput(String v) {
                AlertUtil.showToast(mContext, v);
            }
        },true);
    }

    private void onMenuTouch(final int position){

        switch (position) {
            case 0:
                startActivity(InvenMainActivity.newInstance(mContext, ""));
                break;
            case 1:
                startActivity(QueryActivity.newInstance(mContext));
                break;
            case 2:
                startActivity(LocateActivity.newInstance(mContext,0,null,null,null,null,0));
                break;
            case 3:
                if (!NetWorkUtil.isWifiConnected(mContext)){
                    showError(R.string.wifi_network_unconnected);
                    return;
                }
                syncData(true);
                break;
            case 4:
                prepareToConfig();
                break;
        }
    }

    private void prepareToConfig(){

        if (BuildConfig.DEBUG) {
            startActivity(SysConfigActivity.newInstance(mContext));
        }
        else {
            Intent intent = InputActivity.newInstance(mContext, "密码", "", 8, 1, true, true, false);
            startActivityForResult(intent, 2);
        }
    }

    private void syncData(final boolean withPrompt){

        dataAsync(mPromptDlg, new Runnable() {
            @Override
            public void run() {

                DbClient dbClient = null;
                try {
                    Inventory inventory = new Inventory(mContext);
                    inventory.delHistory();

                    dbClient = new DbClient(mContext, ConfigParams.mDataUrl, ConfigParams.seriesNo,
                            ConfigParams.mIsDbClientDebugMode);
                    String connectId = dbClient.getConnector();

                    String content = dbClient.query(connectId, AssetEntity.TABLE_NAME,
                            AssetEntity.getQuery(ConfigParams.tenantId), AssetEntity.getFields());
                    Asset asset = new Asset(mContext);
                    asset.parseAndProcData(content);

                    content = dbClient.query(connectId, AssetClassEntity.TABLE_NAME,
                            AssetClassEntity.getQuery(ConfigParams.tenantId), AssetClassEntity.getFields());
                    AssetClass ar = new AssetClass(mContext);
                    ar.parseAndProcData(content);

                    content = dbClient.query(connectId, AssetPlaceEntity.TABLE_NAME,
                            AssetPlaceEntity.getQuery(ConfigParams.tenantId), AssetPlaceEntity.getFields());
                    AssetPlace at = new AssetPlace(mContext);
                    at.parseAndProcData(content);

                    if (withPrompt){
                        showToast("数据同步成功.");
                    }
                }
                catch (Exception ex){

                    Log.e(TAG, ex.toString());
                    LogSys.writeSysLog(TAG, ex.toString());
                    mPromptDlg.dismiss();

                    showError(ex.getMessage());
                }
                finally {
                    if (dbClient != null) {
                        dbClient.close();
                    }
                    mPromptDlg.dismiss();
                }
            }
        });
    }

    private void setViewData(){

        mListMenuData.clear();

		MainMenuEntity item6 = new MainMenuEntity(
				mContext.getResources().getString(R.string.inventory_main_menu),
				R.mipmap.inventory_main);
		mListMenuData.add(item6);

        MainMenuEntity item3 = new MainMenuEntity(
                mContext.getResources().getString(R.string.query_asset_main_menu),
                R.mipmap.archive_main);
        mListMenuData.add(item3);

        MainMenuEntity item4 = new MainMenuEntity(
                mContext.getResources().getString(R.string.search_main_menu),
                R.mipmap.search_main);
        mListMenuData.add(item4);

        MainMenuEntity item5 = new MainMenuEntity(
                mContext.getResources().getString(R.string.data_sync_main_menu),
                R.mipmap.sync_main);
        mListMenuData.add(item5);

        MainMenuEntity item7 = new MainMenuEntity(
                mContext.getResources().getString(R.string.config_main_menu),
                R.mipmap.config_main);
        mListMenuData.add(item7);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){

        if (requestCode == 1 && resultCode == RESULT_OK){

            boolean toExit = data.getBooleanExtra("toexitMain", false);
            if (toExit){
                finish();
            }
        }
        if (requestCode == 2 && resultCode == RESULT_OK){

            String inputData = data.getStringExtra(InputActivity.INPUT_CONTENT);
            if (inputData.equalsIgnoreCase("87651234")){

                startActivity(SysConfigActivity.newInstance(mContext));
            }
            else{
                showError("密码有误.");
            }
        }
    }

    @Override
    protected void onResume(){
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    /**
     * 实例化Activity实例
     *
     * @param context Context
     * @return 自身intent实例
     */
    public static Intent newInstance(Context context, String paramVal){

        Intent intent = new Intent(context, MainMenuActivity.class);
        return intent;
    }
}