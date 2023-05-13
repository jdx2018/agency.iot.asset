package com.supdatas.asset.activity.query;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.blankj.utilcode.util.StringUtils;
import com.supdatas.asset.R;
import com.supdatas.asset.frame.activity.BaseActivity;
import com.supdatas.asset.frame.utility.SysSound;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;
import com.supdatas.asset.business.base.Asset;
import com.supdatas.asset.model.asset.AssetEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import butterknife.OnClick;

public class QueryActivity extends BaseActivity implements EditText.OnEditorActionListener {

    @BindView(R.id.btn_query)
    protected Button mBtnQuery;

    @BindView(R.id.btn_reset)
    protected Button mBtnReset;

    @BindView(R.id.btn_set_power)
    protected Button mBtnSetPower;

    @BindView(R.id.btn_return)
    protected Button mBtnReturn;

    @BindView(R.id.et_serial_no)
    protected EditText mEtSeriaoNO;

    @BindView(R.id.recyclerview)
    protected RecyclerView mRecyclerview;
    ;

    @BindView(R.id.tv_summary)
    protected TextView mTvSummary;

    @BindView(R.id.tv_msg)
    protected TextView mTvMsg;

    private List<AssetEntity> mToLAssetList;
    private List<AssetEntity> mLocatedAssetList;

    private int iIndex = 1;

    private Queryadapter mAdapter;

    /**
     * Rfid扫描数据数据刷新EPC的间隔时间，in MS
     */
    private static int RFID_INTERVAL_REFRESH = 2000;
    /**
     * 用于标识是否已经启用了Rfid采集
     */
    private boolean isRfidStart = false;
    /**
     * 记录上次读取Rfid返回且显示时的时间
     */
    private long mLastShowTime = 0;
    private List<Map<String, String>> mListTags = new ArrayList<Map<String, String>>();
    private long lastStartRfidReadTime = 0;
    private int pressRfidCount = 0;

    private Asset mAsset;

    @Override
    protected int getLayoutContentID() {

        return R.layout.activity_archive_query;
    }

    @Override
    protected void initView(Bundle savedInstanceState) {

        initTitleBar("资产信息查询");

        mEtSeriaoNO.setOnEditorActionListener(this);
        mLocatedAssetList = new ArrayList<AssetEntity>();

        mRecyclerview.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
        mToLAssetList = new ArrayList<>();
        mAdapter = new Queryadapter(mContext, mToLAssetList);
        mRecyclerview.setAdapter(mAdapter);

        mAdapter.setGetListener(new Queryadapter.RowClickedListener() {
            @Override
            public void onClick(int position) {
                mAdapter.setPosition(position);
                mAdapter.notifyDataSetChanged();
            }
        });
        mAsset = new Asset(mContext);
        mEtSeriaoNO.setText("");

        setFocus();
    }

    private void setFocus() {
        myHandlerUI.postDelayed(new Runnable() {
            @Override
            public void run() {
                mEtSeriaoNO.setEnabled(true);
                mEtSeriaoNO.requestFocus();
            }
        }, 200);
    }

    @OnClick({R.id.btn_query, R.id.btn_reset, R.id.btn_set_power, R.id.btn_return})
    public void onClick(View view) {

        switch (view.getId()) {
            case R.id.btn_query:

                onQuery(false);
                break;

            case R.id.btn_reset:

                if (isRfidStart)
                    return;
                mEtSeriaoNO.setText("");
                mAdapter.notifyDataSetChanged();
                mTvSummary.setText("总记录数：" + mLocatedAssetList.size());
                mListTags.clear();
                mToLAssetList.clear();
                mEtSeriaoNO.setEnabled(true);
                AlertUtil.showToast(mContext, "重置成功！");
                setFocus();
                break;

            case R.id.btn_return:

                if (isRfidStart)
                    return;
                finish();
                break;
            case R.id.btn_set_power:
                break;
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {

        return super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
            if (isRfidStart) {
                return true;
            }
            finish();
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
        // TODO Auto-generated method stub
        if (actionId == EditorInfo.IME_ACTION_DONE || (event != null
                && event.getKeyCode() == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_DOWN)) {

            InputMethodManager imm = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
            if (imm.isActive()) {
                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
            }
            if (!mEtSeriaoNO.isEnabled()) {
                return false;
            }
            String bar = mEtSeriaoNO.getText().toString().toUpperCase().trim();
            if (TextUtil.isNullOrEmpty(bar))
                return true;
            mEtSeriaoNO.setText(bar);
            onQuery(false);
            return true;
        }
        return false;
    }

    @Override
    protected void onScan(String barcode){

        if (TextUtil.isNullOrEmpty(barcode)){
            return;
        }
        mEtSeriaoNO.setText(barcode);
        onQuery(true);
    }

    private boolean onQuery(boolean isFull) {

        try {
            mToLAssetList.clear();
            mAdapter.notifyDataSetChanged();

            String serialNO = mEtSeriaoNO.getText().toString().trim().toUpperCase();
            if (StringUtils.isEmpty(serialNO)) {

                showToast("查询时资产编号不能为空.");
                SysSound.getIntance().playSound(3, 3);
                return false;
            }
            mToLAssetList.addAll(mAsset.getSpeAssetItems(serialNO, isFull));
            if (mToLAssetList.size() < 1) {
                showToast("不存在该信息的资产记录.");
                SysSound.getIntance().playSound(3, 3);
                return false;
            }

            mAdapter.notifyDataSetChanged();

            mTvSummary.setText("总记录数：" + mToLAssetList.size());
            showToast("资产查询成功！");
            SysSound.getIntance().playSound(2, 3);

            TextUtil.hideInputMethod(this, mEtSeriaoNO);
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
        }
        return true;
    }

    @Override
    public void onClickTitleBack(View v) {

        if (isRfidStart)
            return;
        finish();
    }

    @SuppressLint("HandlerLeak")
    private Handler myHandlerUI = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    break;
                default:
                    break;
            }
        }
    };

    /**
     * 实例化Activity实例
     *
     * @param context Context
     * @return 自身intent实例
     */
    public static Intent newInstance(Context context) {

        Intent intent = new Intent(context, QueryActivity.class);
        return intent;
    }
}
