package com.supdatas.asset.frame.activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.InputFilter;
import android.text.InputType;
import android.text.method.PasswordTransformationMethod;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;

import com.supdatas.asset.R;
import com.supdatas.asset.frame.sys.ScanOperate;
import com.supdatas.asset.frame.utility.SysSound;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;

public class InputActivity extends AppCompatActivity implements View.OnClickListener {

    public static String INPUT_CONTENT = "INPUT_CONTENT";

    private TextView mTvTitle;
    private EditText mTvContent;
    private TextView mTvOK;
    private TextView mTvCancel;

    private static String mTheme;

    /**输入长度限定，-1不限定*/
    private static int mLength = -1;
    /**输入长度限定，-1不限定*/
    private static int mMaxLines = 1;
    /**是否为密码*/
    private static boolean mIsPwd = false;
    /**是否为数字*/
    private static boolean mIsDigit = false;
    /**是否需要扫描*/
    private static boolean mNeedToScan = false;
    /**默认内容*/
    private static String mDefaultContent = "";
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_input);

        mTvTitle = (TextView)findViewById(R.id.tv_title);
        mTvContent = (EditText)findViewById(R.id.tv_scancode);
        mTvOK = (TextView)findViewById(R.id.tv_ok);
        mTvCancel = (TextView)findViewById(R.id.tv_cancel);
        mTvContent.setOnKeyListener(onKey);

        mTvOK.setOnClickListener(this);
        mTvCancel.setOnClickListener(this);

        int screen_width = getScreenWidth(this);
        int screen_height = getScreenHeight(this);
        WindowManager.LayoutParams localLayoutParams = new WindowManager.LayoutParams();
        localLayoutParams.copyFrom(getWindow().getAttributes());
        if(screen_width>1080)
            localLayoutParams.width = screen_width-160;
        else
            localLayoutParams.width = screen_width-100;
        localLayoutParams.height = ViewGroup.LayoutParams.WRAP_CONTENT;

        mTvTitle.setText(getString(R.string.please_input) + mTheme + ":");
        mTvContent.setHint(getString(R.string.please_input) + mTheme);
        mTvContent.setMaxLines(3);

        if (mIsDigit){
            mTvContent.setInputType(InputType.TYPE_CLASS_NUMBER);
        }
        if (mLength != -1){
            mTvContent.setFilters(new InputFilter[]{new InputFilter.LengthFilter(mLength){}});
        }
        if (mMaxLines < 1){
            mMaxLines = 1;
        }
        mTvContent.setMaxLines(mMaxLines);
        if (mIsPwd){
            //mTvContent.setInputType( InputType.TYPE_NUMBER_VARIATION_PASSWORD|InputType.TYPE_CLASS_NUMBER );
            mTvContent.setTransformationMethod(PasswordTransformationMethod.getInstance()); //设置为密码输入框
        }
        if (!TextUtil.isNullOrEmpty(mDefaultContent)){
            mTvContent.setText(mDefaultContent);
        }

        getWindow().setAttributes(localLayoutParams);
    }

    //region 手动输入条码事件
    View.OnKeyListener onKey = new View.OnKeyListener() {
        @Override
        public boolean onKey(View v, int keyCode, KeyEvent event) {
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_UP) {

                return true;
            }
            return false;
        }
    };

    public ScanOperate mScanner;

    @Override
    protected void onResume(){

        super.onResume();

        if (mNeedToScan) {
            mScanner = new ScanOperate(getApplicationContext());
            mScanner.setmScanListener(new ScanOperate.ScanResultListerner() {
                @Override
                public void scanResult(String result) {
                    onScan(result);
                }
            });
        }
    }

    /**
     * 获取屏幕宽度
     * @param context 上下文对象
     * @return 屏幕宽度
     */
    public int getScreenWidth(Context context){
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics dm = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(dm);
        return dm.widthPixels;
    }

    /**
     * 获取屏幕高度
     * @param context 上下文对象
     * @return 屏幕高度
     */
    public int getScreenHeight(Context context){
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics dm = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(dm);
        return dm.heightPixels;
    }

    private void onScan(String barcode){

        mTvContent.setText(barcode);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_ok:

                hideSoftKeyboard();
                String barcode = mTvContent.getText().toString().trim();
                if (barcode.equals("")){

                    AlertUtil.showToast(InputActivity.this,  mTheme + getString(R.string.cannot_be_empty));
                    SysSound.getIntance().playSound(3, 3);
                    return;
                }
                Intent intent1 = new Intent();
                Bundle bundle1 = new Bundle();
                bundle1.putString(INPUT_CONTENT, barcode.trim());
                intent1.putExtras(bundle1);
                setResult(RESULT_OK, intent1);

                finish();
                break;

            case R.id.tv_cancel:
                hideSoftKeyboard();

                finish();
                break;
        }
    }

    public void hideSoftKeyboard(){

        InputMethodManager inputMethodManager2 = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        inputMethodManager2.hideSoftInputFromWindow(this.getCurrentFocus().getWindowToken(),
                InputMethodManager.HIDE_NOT_ALWAYS);
    }

    public void showSoftKeyboard(){

        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);
    }

    @Override
    protected void onDestroy() {

        try {
            super.onDestroy();

        } catch (Exception ex) {
        }
    }

    /**
     * 实例化Activity实例
     *
     * @param context Context
     * @return 自身intent实例
     */
    public static Intent newInstance(Context context,
                                     String theme, String defaultContent,
                                     int length, int maxLines,
                                     boolean isPwd, boolean isDigit, boolean needToScan){

        Intent intent = new Intent(context, InputActivity.class);
        mTheme = theme;
        mDefaultContent = defaultContent;
        mLength = length;
        mMaxLines = maxLines;
        mIsPwd = isPwd;
        mIsDigit = isDigit;
        mNeedToScan = needToScan;
        return intent;
    }
}
