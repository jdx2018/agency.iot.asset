package com.supdatas.asset.frame.activity;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.InputFilter;
import android.text.InputType;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import butterknife.ButterKnife;
import butterknife.Unbinder;
import com.blankj.utilcode.util.ToastUtils;

import com.supdatas.asset.BuildConfig;
import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.frame.sys.ScanOperate;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;
import com.supdatas.asset.frame.utility.dlgprompt.DlgUtility;
import com.supdatas.asset.business.LogSys;
import com.supdatas.asset.frame.utility.SysSound;
import com.supdatas.asset.R;
import com.supdatas.asset.frame.utility.widget.Loading;

public abstract class BaseActivity extends AppCompatActivity {

	private View mTitleView;
	private ImageView mIvBackView,mIvLeftIcon;
	private TextView mTvTitle,mTvSubTitle,mTvBattery;
	private ImageButton mIbDetail, mIbGear, mIbSearch, mIbUser;
	private Unbinder mUnbinder;
	public ScanOperate mScanner;

	private long lastTimeMilliSeconds = 0;
	public Context mContext;
	public String TAG;
	public Dialog mPromptDlg = null;
	public ProgressDialog mProgressDlg = null;
	public PopupWindow mPopupWindow = null;
	public String mMsg;
	private boolean mOpenScanner = true;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);

        try {
            if (getLayoutContentID() != 0) {

                View contentView = LayoutInflater.from(this).inflate(getLayoutContentID(),null);
                setContentView(contentView);
                mUnbinder = ButterKnife.bind(this);

				TAG = this.getClass().getName();
				mContext = this;

                initView(savedInstanceState);
				initData();

				//去掉下方的注释可以查看设备的电池监控，当少到一定量的时候会报警
                /*MainApplication.getInstance().setBatteryChangeListener(new MainApplication.BatteryScanListener() {
                    @Override
                    public void levelChanged(int scale) {
                        onBatteryChanged(scale);
                    }
                });*/
				//ActivityManager.getInstance().pushOneActivity(this);
            }
        } catch (Exception e) {
            e.printStackTrace();
			LogSys.writeSysLog("BaseActivity-onCreate", e.toString());
        }
	}

	protected void onScan(final String bar){
		//bar scan processor
	}

	protected void initTitleBar(String title) {

		_init();
		if (title != null && mTvTitle != null) {
			mTvTitle.setText(title);
		}
	}

	protected void initTitleBar(int title) {

		_init();
		if (title > 0 && mTvTitle != null) {
			mTvTitle.setText(title);
		}
	}

    protected abstract int getLayoutContentID();

	private void _init() {

		mTitleView = findViewById(R.id.cus_title_bar);
		if (mTitleView != null) {
			mTitleView.setVisibility(View.VISIBLE);
			mTvBattery = (TextView)findViewById(R.id.tv_battery);
            mIvBackView = (ImageView) findViewById(R.id.title_back_btn);
			mIvLeftIcon = (ImageView) findViewById(R.id.iv_left_icon);

			mTvBattery.setVisibility(View.GONE);
            mIvBackView.setOnClickListener(new View.OnClickListener(){
            	@Override public void onClick(View v){
					onClickTitleBack(v);
            	}
            });

            mTvTitle = (TextView) findViewById(R.id.tv_title);
			mTvSubTitle = (TextView) findViewById(R.id.tv_sub_title);
            mIbDetail = (ImageButton) findViewById(R.id.btn_right_detail);
            mIbDetail.setOnClickListener(new View.OnClickListener(){
				@Override public void onClick(View v){
					onClickDetail(v);
				}
			});

            mIbGear = (ImageButton) findViewById(R.id.btn_right_gear);
            mIbGear.setOnClickListener(new View.OnClickListener(){
				@Override public void onClick(View v){
					onClickGear(v);
				}
			});

			mIbSearch = (ImageButton) findViewById(R.id.btn_right_search);
			mIbSearch.setOnClickListener(new View.OnClickListener(){
				@Override public void onClick(View v){
					onClickSearch(v);
				}
			});

			mIbUser = (ImageButton) findViewById(R.id.btn_right_user);
			mIbUser.setOnClickListener(new View.OnClickListener(){
				@Override public void onClick(View v){
					onClickUser(v);
				}
			});
		}
	}

	protected void setScannerOn(){
		mOpenScanner = true;
		mScanner.enableScanner();
	}

	protected void setScannerOff(){
		mOpenScanner = false;
		mScanner.disableScanner();
	}

	@Override
	protected void onResume(){

		super.onResume();

		if (!BuildConfig.DEBUG) {
			setBattery();
		}
	}

	@Override
	protected void onStart(){
		super.onStart();
		mScanner = new ScanOperate(getApplicationContext());
		mScanner.setmScanListener(new ScanOperate.ScanResultListerner() {
			@Override
			public void scanResult(String result) {
				onScan(result);
			}
		});
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {

		switch (keyCode) {
			case KeyEvent.KEYCODE_BACK:
				if (event.getRepeatCount() == 0 && event.getAction() == KeyEvent.ACTION_DOWN) {
					finish();
					return true;
				}
				break;
		}
		return super.onKeyDown(keyCode, event);
	}

	protected void setSubTitle(final int subTitle){
		if (mTvSubTitle != null){
			mTvSubTitle.setText(subTitle);
		}
	}

	protected void setSubTitle(final String subTitle){
		if (mTvSubTitle != null){
			mTvSubTitle.setText(subTitle);
		}
	}

	/**
	 * 设置title-view可见性
	 * */
	public void setTitleVisibility(int visibleType) {

		if (mTitleView != null) {
			mTitleView.setVisibility(visibleType);
		}
	}

	/**
	 * 设置sub-title-view可见性
	 * */
	public void setSubTitleVisibility(int visibleType) {

		if (mTvSubTitle != null) {
			mTvSubTitle.setVisibility(visibleType);
		}
	}

	protected void setLeftIconBackgound(final int srcID){
		if (mIvLeftIcon != null){
			mIvLeftIcon.setBackground(mContext.getDrawable(srcID));
		}
	}

	private void setBattery(){

		MainApplication.instance().setBatteryChangeListener(new MainApplication.BatteryScanListener() {
			@Override
			public void levelChanged(int scale) {
				onBatteryChanged(scale);
			}
		});
	}

	/**
     * 设置Detail按钮可见性
     * */
	public void setDetailVisibility(int visibleType) {

		if (mIbDetail != null) {
            mIbDetail.setVisibility(visibleType);
            setBatteryPosition();
        }
	}

	public void setDetailEnabled(boolean enabled){

		if (mIbDetail != null) {
			mIbDetail.setEnabled(enabled);
		}
	}

    public void setGearVisibility(int visibleType) {

        if (mIbGear != null) {
            mIbGear.setVisibility(visibleType);
            setBatteryPosition();
        }
    }

	public void setGearEnabled(boolean enabled){

		if (mIbGear != null) {
			mIbGear.setEnabled(enabled);
		}
	}

	public void setSearchVisibility(int visibleType) {

		if (mIbSearch != null) {
			mIbSearch.setVisibility(visibleType);
			setBatteryPosition();
		}
	}

	public void setSearchEnabled(boolean enabled){

		if (mIbSearch != null) {
			mIbSearch.setEnabled(enabled);
		}
	}

	public void setUserVisibility(int visibleType) {

		if (mIbUser != null) {
			mIbUser.setVisibility(visibleType);
			setBatteryPosition();
		}
	}

	public void setUserEnabled(boolean enabled){

		if (mIbUser != null) {
			mIbUser.setEnabled(enabled);
		}
	}

    public void setBatteryVisibility(int visibleType) {

        if (mTvBattery != null) {
            mTvBattery.setVisibility(visibleType);
        }
    }

	public void setLeftIconVisibility(int visibleType) {

		if (mIvLeftIcon != null) {
			mIvLeftIcon.setVisibility(visibleType);
		}
	}

    private void setBatteryPosition(){

        if (mIbDetail.getVisibility() == View.VISIBLE ||
				mIbGear.getVisibility() == View.VISIBLE ||
				mIbSearch.getVisibility() == View.VISIBLE ||
				mIbUser.getVisibility() == View.VISIBLE){

            RelativeLayout.LayoutParams lp = (RelativeLayout.LayoutParams)(mTvBattery.getLayoutParams());
            lp.setMarginEnd(66);
            mTvBattery.setLayoutParams(lp);
        }
    }

	protected void setHeadTitle(String strTxt) {

		if (mTvTitle != null) {
            mTvTitle.setText(strTxt);
		}
	}

	@Override
	protected void onDestroy() {

        try {
            //MainApplication.mScanner.onDestroy(MainApplication.getContext());
            //MainApplication.getInstance().unregisterBatteryRec();
            if (mUnbinder != null && mUnbinder != Unbinder.EMPTY){
                mUnbinder.unbind();
            }
            if (mScanner != null){
            	mScanner.onDestroy(getApplicationContext());
			}
			AlertUtil.dismissDialog();
        }catch (Exception e){
            e.printStackTrace();
        }
		super.onDestroy();
	}

	protected void setBackVisibility(int iVisible){

	    if (mIvBackView != null) {
			mIvBackView.setVisibility(iVisible);
		}
    }

	protected void setBackEnabled(boolean enabled){

		if (mIvBackView != null) {
			mIvBackView.setEnabled(enabled);
		}
	}

	protected abstract void initView(Bundle savedInstanceState);
	protected void initData(){}

	protected void onClickTitleBack(View v){

		finish();
	}
	protected void onClickDetail(View v){
        //Toast.makeText(this,"detail", Toast.LENGTH_LONG).show();
    }
    protected void onClickGear(View v){
        //Toast.makeText(this,"gear", Toast.LENGTH_SHORT).show();
    }
	protected void onClickSearch(View v){
		//Toast.makeText(this,"search", Toast.LENGTH_SHORT).show();
	}
	protected void onClickUser(View v){
		Toast.makeText(this,"user", Toast.LENGTH_SHORT).show();
	}

	public void showError(final int msg){

		showError(getString(msg));
	}

	public void showError(final String msg){

		runOnUiThread(new Runnable() {
			@Override
			public void run() {

				AlertUtil.showAlert(mContext, msg);
				SysSound.getIntance().playSound(3, 3);
			}
		});
	}

	public void showInfor(final int msg){

		showInfor(getString(msg));
	}

	public void showInfor(final String msg){

		runOnUiThread(new Runnable() {
			@Override
			public void run() {

				AlertUtil.showAlert(mContext, msg);
				SysSound.getIntance().playSound(2, 3);
			}
		});
	}

	public void showToast(final int msg){

		showToast(getString(msg), true);
	}
	public void showToast(final int msg, final boolean withSound){

		showToast(getString(msg), withSound);
	}

	public void showToast(final String msg){

		showToast(msg, true);
	}

	public void showToast(final String msg, final boolean withSound){

		runOnUiThread(new Runnable() {
			@Override
			public void run() {

				AlertUtil.showToast(mContext, msg);
				if (withSound) {
					SysSound.getIntance().playSound(2, 3);
				}
			}
		});
	}

	public void showToastShort(final int msg){

		showToastShort(getString(msg), true);
	}

	public void showToastShort(final int msg, final boolean withSound){

		showToastShort(getString(msg), withSound);
	}

	public void showToastShort(final String msg){
		showToastShort(msg, true);
	}

	public void showToastShort(final String msg, final boolean withSound){

		runOnUiThread(new Runnable() {
			@Override
			public void run() {

				AlertUtil.showToastShort(mContext, msg);
				if (withSound) {
					SysSound.getIntance().playSound(2, 3);
				}
			}
		});
	}

	public interface SetPowerInterface {

		public void setPower(int power);
	}
	public void setPower(final EditText etRfidPower, final int power, SetPowerInterface onPower){

		etRfidPower.setInputType(InputType.TYPE_CLASS_NUMBER);
		etRfidPower.setText(String.valueOf(power));
		etRfidPower.setSelectAllOnFocus(true);
		etRfidPower.setMaxLines(1);
		etRfidPower.setHint(R.string.module_power_please_input);
		etRfidPower.setInputType(InputType.TYPE_CLASS_NUMBER);
		etRfidPower.setFilters(new InputFilter[]{new InputFilter.LengthFilter(2){}});
		etRfidPower.setTextColor(getResources().getColor(R.color.black));
		etRfidPower.setGravity(Gravity.CENTER);

		DlgUtility.showDlgEdit(this, etRfidPower, R.mipmap.ic_launcher, R.string.sys_prompt,
				R.string.module_power_set_infor, R.string.cancel, R.string.confirm, true,
				new DialogInterface.OnClickListener() {

					@Override
					public void onClick(DialogInterface dialog, int which) {

						String powerValue = etRfidPower.getText().toString();
						if (powerValue.equals("")) {

							AlertUtil.showAlert(mContext, R.string.module_power_is_null);
							SysSound.getIntance().playSound(3,3);
							return;
						}
						int power = Integer.parseInt(powerValue);
						if (power < 1 || power > 33) {

							AlertUtil.showAlert(mContext, R.string.module_power_not_in_scope);
							SysSound.getIntance().playSound(3,3);
							return;
						}
						if (onPower != null){
							onPower.setPower(power);
						}
					}
				},
				new DialogInterface.OnClickListener() {

					@Override
					public void onClick(DialogInterface dialog, int which) {
					}
				}).show();
	}

	public void setBatteryScale(int scale){

		if (mTvBattery == null) {
			return;
		}
		if (scale < 10){
			mTvBattery.setTextColor(Color.RED);
		}
		else if (scale < 20){
			mTvBattery.setTextColor(getResources().getColor(R.color.orange_red));
		}
		else {
			mTvBattery.setTextColor(Color.WHITE);
		}
		mTvBattery.setText(scale + "%");
	}

	public void onBatteryChanged(int scale){

		setBatteryScale(scale);

		if (scale <= 10){

			if (System.currentTimeMillis() - lastTimeMilliSeconds > 20000) {

				SysSound.getIntance().playSound(3, 1);
				lastTimeMilliSeconds = System.currentTimeMillis();
				ToastUtils.showShort("当前电量较低，请及时充电！");
			}
			return;
		}
		else if (scale <= 5){

			if (System.currentTimeMillis() - lastTimeMilliSeconds > 3000) {

				SysSound.getIntance().playSound(3, 1);
				lastTimeMilliSeconds = System.currentTimeMillis();
				ToastUtils.showShort("当前电量极低，请停止使用，及时充电！");
			}
			return;
		}
	}

	public void dataAsync(Dialog dlgPrompt, final Runnable runnable) {

		if (mPromptDlg != null && mPromptDlg.isShowing())
			mPromptDlg.dismiss();
		//mPromptDlg = DlgBusyCircling.showBusyCirclingDlg2(mContext, "下在下载，请稍候...");
		//mPromptDlg.show();
		mPromptDlg = Loading.show(mContext);

		new Thread(runnable).start();
	}

	public void dataAsync(Dialog dlgPrompt, int promptMsg, final Runnable runnable) {

		dataAsync(dlgPrompt, getString(promptMsg), runnable);
	}
	public void dataAsync(Dialog dlgPrompt, String promptMsg, final Runnable runnable) {

		if (mPromptDlg != null && mPromptDlg.isShowing())
			mPromptDlg.dismiss();
		mPromptDlg = Loading.show(mContext);

		new Thread(runnable).start();
	}

	public void dataAsync(ProgressDialog progressDialog, int promptMsg, final Runnable runnable) {

		dataAsync(progressDialog,getString(promptMsg),runnable);
	}
	public void dataAsync(ProgressDialog progressDialog, String promptMsg, final Runnable runnable) {

		if (mProgressDlg != null  && mProgressDlg.isShowing())
			mProgressDlg.dismiss();
		mProgressDlg = DlgUtility.progressDlg1(mContext,
				getString(R.string.sys_prompt), promptMsg, false, false);
		mProgressDlg.show();

		new Thread(runnable).start();
	}

	public interface OnSelectListener {

		public void onSelectItem(String itemStr, int index);
	}
	public void selectFromItems(final String [] items, String selectPrompt, OnSelectListener onSelect) {

		AlertDialog.Builder dlg = DlgUtility.showAlertDlg(mContext,
				R.mipmap.ic_launcher, items, selectPrompt, true,
				new DialogInterface.OnClickListener(){

					@Override
					public void onClick(DialogInterface dialog, int position) {
						// TODO Auto-generated method stub
						if (position >= 0) {

							if (onSelect != null){
								onSelect.onSelectItem(items[position], position);
							}
						}
					}}
		);
		dlg.show();
	}

	@Override
	public boolean dispatchTouchEvent(MotionEvent event){
		if(mPopupWindow!=null&&mPopupWindow.isShowing()){
			return false;
		}
		return super.dispatchTouchEvent(event);
	}

	public interface OnInputListener {

		public void onInput(String itemStr);
	}
	public void popupInputWindow(Activity activity, View v, String prompt, String theme,
								 boolean showAsDropDown,
								 int gravity, int xOffset, int yOffset,
								 OnInputListener onInputListener,boolean notNullable){

		popupInputWindow(activity, v, prompt, theme,
				"", showAsDropDown, false, 1, 1, gravity, xOffset, yOffset,
				onInputListener, notNullable);
	}
	/**
	 * popupWindow
	 * @param isDigit 是否为数字，只有当为true时，后面的两个值才有效
	 * @param minValue 当 isDigit为true时，表示输入的最小值
	 * @param maxValue 当 isDigit为true时，表示输入的最大值
	 * */
	public void popupInputWindow(Activity activity, View v, String prompt, String theme,
								 String defaultContent, boolean showAsDropDown,
								 boolean isDigit, int minValue, int maxValue,
								 int gravity, int xOffset, int yOffset,
								 OnInputListener onInputListener,boolean notNullable){

		final View view= LayoutInflater.from(activity).inflate(R.layout.activity_input, null);
		mPopupWindow = DlgUtility.popUpCusDlg(activity, view, v,
				420, 225, showAsDropDown, gravity, xOffset, yOffset);

		mPopupWindow.setOnDismissListener(new PopupWindow.OnDismissListener() {

			@Override
			public void onDismiss() {
				// TODO Auto-generated method stub
				DlgUtility.setBackgroundAlpha(activity, 1f);//设置屏幕透明度,完全不透明
			}
		});
		TextView tvPrompt = (TextView)(view.findViewById(R.id.tv_title));
		final EditText editText = (EditText)(view.findViewById(R.id.tv_scancode));
		if (!TextUtil.isNullOrEmpty(prompt))
			tvPrompt.setText(prompt);
		if (!TextUtil.isNullOrEmpty(theme))
			editText.setHint(getString(R.string.please_input) + theme);
		if (isDigit){
			editText.setInputType(InputType.TYPE_CLASS_NUMBER);
		}
		if (!TextUtil.isNullOrEmpty(defaultContent)){
			editText.setText(defaultContent);
		}

		TextView btnOK = (TextView)(view.findViewById(R.id.tv_ok));
		btnOK.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				String txt = editText.getText().toString().trim();
				if (notNullable && TextUtil.isNullOrEmpty(txt)){

					showError(theme + getString(R.string.cannot_be_empty));
					return;
				}
				if (isDigit && (Integer.parseInt(txt) < minValue ||
						Integer.parseInt(txt) > maxValue)) {

					showError(theme + getString(R.string.exceed_digit_scope));
					return;
				}
				if (onInputListener != null){
					onInputListener.onInput(txt);
				}
				mPopupWindow.dismiss();
			}
		});
		TextView btnCancel = (TextView)(view.findViewById(R.id.tv_cancel));
		btnCancel.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				mPopupWindow.dismiss();
			}
		});
	}
}