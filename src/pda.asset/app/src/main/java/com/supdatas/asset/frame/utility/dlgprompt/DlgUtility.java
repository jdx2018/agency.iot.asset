package com.supdatas.asset.frame.utility.dlgprompt;

/**
 * Created by Administrator on 2020/03/14.
 */

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.ProgressDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.content.DialogInterface.OnMultiChoiceClickListener;
import android.graphics.drawable.ColorDrawable;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.PopupWindow;
import android.widget.Toast;

import com.supdatas.asset.frame.utility.DeviceInfor;

import java.util.Calendar;

public class DlgUtility
{
    //Toast提示框
    public static void toastMsg(Context cxt, String msg, boolean longShow) {
        Toast.makeText(cxt, msg, longShow ? Toast.LENGTH_LONG : Toast.LENGTH_SHORT).show();
    }

    //Toast提示框
    public static void toastMsg(Context cxt, int iMsg, boolean longShow) {
        Toast.makeText(cxt, iMsg, longShow ? Toast.LENGTH_LONG : Toast.LENGTH_SHORT).show();
    }

    //确定提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon,
                                                   String title, String msg, String OKMsg, boolean cancelable,
                                                   OnClickListener onOK) {
        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(title);
        builder.setMessage(msg);
        builder.setPositiveButton(OKMsg, onOK);
        builder.setCancelable(cancelable);
        return builder;
    }

    //确定提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon,
                                                   int iTitle, int iMsg, int iOKMsg, boolean cancelable,
                                                   OnClickListener onOK) {
        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(iTitle);
        builder.setMessage(iMsg);
        builder.setPositiveButton(iOKMsg, onOK);
        builder.setCancelable(cancelable);
        return builder;
    }

    //两态选择对话提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon, String title,
                                                   String msg, String cancelMsg, String OKMsg, boolean cancelable,
                                                   OnClickListener onOK, OnClickListener onCancel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(title);
        builder.setMessage(msg);
        builder.setPositiveButton(OKMsg, onOK);
        builder.setNegativeButton(cancelMsg, onCancel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //两态选择对话提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon, int iTitle,
                                                   int iMsg, int iCancelMsg, int iOKMsg, boolean cancelable,
                                                   OnClickListener onOK, OnClickListener onCancel) {
        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(iTitle);
        builder.setMessage(iMsg);
        builder.setPositiveButton(iOKMsg, onOK);
        builder.setNegativeButton(iCancelMsg, onCancel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //两态选择对话提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon, int iTitle, int iMsg,
                                                   String cancelMsg, String OKMsg, boolean cancelable,
                                                   OnClickListener onOK, OnClickListener onCancel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(iTitle);
        builder.setMessage(iMsg);
        builder.setPositiveButton(OKMsg, onOK);
        builder.setNegativeButton(cancelMsg, onCancel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //三态选择对话提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon, String title,
                                                   String msg, String cancelMsg, String OKMsg,
                                                   String midMsg, boolean cancelable,
                                                   OnClickListener onOK, OnClickListener onCancel, OnClickListener onMid) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(title);
        builder.setMessage(msg);
        builder.setPositiveButton(OKMsg, onOK);
        builder.setNegativeButton(cancelMsg, onCancel);
        builder.setNeutralButton(midMsg, onMid);
        builder.setCancelable(cancelable);
        return builder;
    }

    //三态选择对话提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon, int iTitle, int iMsg,
                                                   int iCancelMsg, int iOKMsg, int iMidMsg, boolean cancelable,
                                                   OnClickListener onOK, OnClickListener onCancel, OnClickListener onMid) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(iTitle);
        builder.setMessage(iMsg);
        builder.setPositiveButton(iOKMsg, onOK);
        builder.setNegativeButton(iCancelMsg, onCancel);
        builder.setNeutralButton(iMidMsg, onMid);
        builder.setCancelable(cancelable);
        return builder;
    }

    //多行选择提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon,
                                                   String[]arrItems, String title, boolean cancelable,
                                                   OnClickListener onSelected) {

        AlertDialog.Builder builder=new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(title);
        builder.setItems(arrItems, onSelected);
        builder.setCancelable(cancelable);
        //builder.setView()

        return builder;
    }

    //多行选择提示框
    public static AlertDialog.Builder showAlertDlg(Context cxt, int iIcon,
                                                   String[]arrItems, int iTitle, boolean cancelable,
                                                   OnClickListener onSelected) {

        AlertDialog.Builder builder=new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(iTitle);
        builder.setItems(arrItems, onSelected);
        builder.setCancelable(cancelable);
        return builder;
    }

    //两态选择，带单项选择行的对话框提示框(也可只需要一个确定按钮)
    public static AlertDialog.Builder showAlertDlgWithSingleSel(Context cxt, int iIcon, String title,
                                                                String[] items, int defaultCheckedIndex,
                                                                String cancelMsg, String OKMsg,
                                                                boolean cancelable,	OnClickListener onOK,
                                                                OnClickListener onCancel, OnClickListener singleSel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(title);
        builder.setPositiveButton(OKMsg, onOK);
        builder.setNegativeButton(cancelMsg, onCancel);
        builder.setSingleChoiceItems(items, defaultCheckedIndex, singleSel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //两态选择，带单项选择行的对话框提示框(也可只需要一个确定按钮)
    public static AlertDialog.Builder showAlertDlgWithSingleSel(Context cxt, int iIcon,
                                                                int iTitle, int arrItems, int defaultCheckedIndex,
                                                                int iCancelMsg, int iOKMsg,
                                                                boolean cancelable,	OnClickListener onOK,
                                                                OnClickListener onCancel, OnClickListener singleSel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(iTitle);
        builder.setPositiveButton(iOKMsg, onOK);
        builder.setNegativeButton(iCancelMsg, onCancel);
        builder.setSingleChoiceItems(arrItems, defaultCheckedIndex, singleSel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //两态选择，带复选可多行选择的对话框提示框(也可只需要一个确定按钮)
    public static AlertDialog.Builder showAlertDlgWithMultiChecked(Context cxt, int iIcon, String title,
                                                                   String[] items, boolean[] checkedItems,
                                                                   String cancelMsg, String OKMsg,
                                                                   boolean cancelable,	OnClickListener onOK,
                                                                   OnClickListener onCancel,
                                                                   OnMultiChoiceClickListener multiSel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(title);
        builder.setPositiveButton(OKMsg, onOK);
        builder.setNegativeButton(cancelMsg, onCancel);
        builder.setMultiChoiceItems(items, checkedItems, multiSel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //两态选择，带复选可多行选择的对话框提示框(也可只需要一个确定按钮)
    public static AlertDialog.Builder showAlertDlgWithMultiChecked(Context cxt, int iIcon,
                                                                   int iTitle, int items, boolean[] checkedItems,
                                                                   int iCancelMsg, int iOKMsg,
                                                                   boolean cancelable,	OnClickListener onOK,
                                                                   OnClickListener onCancel, OnMultiChoiceClickListener multiSel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        builder.setIcon(iIcon);
        builder.setTitle(iTitle);
        builder.setPositiveButton(iOKMsg, onOK);
        builder.setNegativeButton(iCancelMsg, onCancel);
        builder.setMultiChoiceItems(items, checkedItems, multiSel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //显示带编辑框的提示框
    public static AlertDialog.Builder showDlgEdit(Context cxt, EditText etEdit, int iIcon,
                                                  String title, String msg, String cancelMsg, String OKMsg,
                                                  boolean cancelable,	OnClickListener onOK, OnClickListener onCancel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        if (title != null && title != "")
            builder.setTitle(title);
        builder.setMessage(msg);
        builder.setIcon(android.R.drawable.ic_dialog_info);
        builder.setView(etEdit);
        builder.setPositiveButton(OKMsg, onOK);
        builder.setNegativeButton(cancelMsg, onCancel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //显示带编辑框的提示框
    public static AlertDialog.Builder showDlgEdit(Context cxt, EditText etEdit, int iIcon,
                                                  int iTitle, int iMsg, int iCancelMsg, int iOKMsg,
                                                  boolean cancelable, OnClickListener onOK, OnClickListener onCancel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        if (iTitle != -1)
            builder.setTitle(iTitle);
        builder.setMessage(iMsg);
        builder.setIcon(iIcon);		//android.R.drawable.ic_dialog_info
        builder.setView(etEdit);
        builder.setPositiveButton(iOKMsg, onOK);
        builder.setNegativeButton(iCancelMsg, onCancel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //自定View的提示框
    public static AlertDialog.Builder showDlgView(Context cxt, View view, int iIcon, int iTitle,
                                                  String msg, String cancelMsg, String OKMsg,
                                                  boolean cancelable, OnClickListener onOK,
                                                  OnClickListener onCancel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        if (iTitle != -1)
            builder.setTitle(iTitle);
        builder.setMessage(msg);
        builder.setIcon(iIcon);		//android.R.drawable.ic_dialog_info
        builder.setView(view);
        if (onOK != null)
            builder.setPositiveButton(OKMsg, onOK);
        if (onCancel != null)
            builder.setNegativeButton(cancelMsg, onCancel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //自定View的提示框
    public static AlertDialog.Builder showDlgView(Context cxt, View view, int iIcon,
                                                  String title, String msg, String cancelMsg, String OKMsg,
                                                  boolean cancelable, OnClickListener onOK, OnClickListener onCancel) {

        AlertDialog.Builder builder = new AlertDialog.Builder(cxt);
        if (title != null && title != "")
            builder.setTitle(title);
        builder.setMessage(msg);
        builder.setIcon(iIcon);		//android.R.drawable.ic_dialog_info
        builder.setView(view);
        if (onOK != null)
            builder.setPositiveButton(OKMsg, onOK);
        if (onCancel != null)
            builder.setNegativeButton(cancelMsg, onCancel);
        builder.setCancelable(cancelable);
        return builder;
    }

    //-----------------------------------------------ProgressDialog-----------------------------------------------

    public static ProgressDialog progressDlg1(Context cxt, String title, String msg, String OKMsg, String cancelMsg,
                                              boolean cancelable, boolean canceledTouchOutside,
                                              OnClickListener onOK, OnClickListener onCancel) {

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
    public static ProgressDialog progressDlg1(Context cxt, String iTitle, String msg,
                                              boolean cancelable, boolean canceledTouchOutside) {

        ProgressDialog dialog = new ProgressDialog(cxt);
        dialog.setTitle(iTitle);
        dialog.setMessage(msg);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(canceledTouchOutside);
        dialog.setCancelable(cancelable);
        return dialog;
    }

    public static ProgressDialog progressDlg1(Context cxt, int iTitle, int msg,
                                              boolean cancelable, boolean canceledTouchOutside) {

        ProgressDialog dialog = new ProgressDialog(cxt);
        dialog.setTitle(iTitle);
        dialog.setMessage(cxt.getString(msg));
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(canceledTouchOutside);
        dialog.setCancelable(cancelable);
        return dialog;
    }

    public static ProgressDialog progressDlg1(Context cxt, int iTitle, int msg, int OKMsg, int cancelMsg,
                                              boolean cancelable, boolean canceledTouchOutside,
                                              OnClickListener onOK, OnClickListener onCancel) {

        ProgressDialog dialog = new ProgressDialog(cxt);
        dialog.setTitle(iTitle);
        dialog.setMessage(cxt.getString(msg));
        if (onOK != null)
            dialog.setButton(DialogInterface.BUTTON_POSITIVE, cxt.getString(OKMsg), onOK);
        if (onCancel != null)
            dialog.setButton(DialogInterface.BUTTON_NEGATIVE, cxt.getString(cancelMsg),onCancel);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(canceledTouchOutside);
        dialog.setCancelable(cancelable);
        return dialog;
    }

    public static ProgressDialog progressDlg1(Context cxt, int iIcon, String title, String msg,
                                              String OKMsg, String cancelMsg,
                                              boolean cancelable, boolean canceledTouchOutside,
                                              OnClickListener onOK, OnClickListener onCancel) {

        ProgressDialog dialog = new ProgressDialog(cxt);
        dialog.setIcon(iIcon);
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

    public static ProgressDialog progressDlg1(Context cxt, int iIcon, int iTitle, int msg,
                                              int OKMsg, int cancelMsg,
                                              boolean cancelable, boolean canceledTouchOutside,
                                              OnClickListener onOK, OnClickListener onCancel) {

        ProgressDialog dialog = new ProgressDialog(cxt);
        dialog.setIcon(iIcon);
        dialog.setTitle(iTitle);
        dialog.setMessage(cxt.getString(msg));
        if (onOK != null)
            dialog.setButton(DialogInterface.BUTTON_POSITIVE, cxt.getString(OKMsg), onOK);
        if (onCancel != null)
            dialog.setButton(DialogInterface.BUTTON_NEGATIVE, cxt.getString(cancelMsg), onCancel);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(canceledTouchOutside);
        dialog.setCancelable(cancelable);
        return dialog;
    }

    public static ProgressDialog progressDlg2(Context cxt, int iIcon, String title, String msg,
                                              String OKMsg, String cancelMsg,
                                              boolean cancelable, boolean cancelableTouchOutside,
                                              OnClickListener onOK, OnClickListener onCancel) {

        ProgressDialog progressDialog = new ProgressDialog(cxt);
        if (iIcon != -1)
            progressDialog.setIcon(iIcon);
        progressDialog.setTitle(title);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);

        if (msg != null && msg != "")
            progressDialog.setMessage(msg);
        if (onOK != null)
            progressDialog.setButton(DialogInterface.BUTTON_POSITIVE, OKMsg, onOK);
        if (onCancel != null)
            progressDialog.setButton(DialogInterface.BUTTON_NEGATIVE, cancelMsg, onCancel);
        progressDialog.setCancelable(cancelable);
        progressDialog.setCanceledOnTouchOutside(cancelableTouchOutside);
        progressDialog.setProgress(0);

        return progressDialog;
    }

    public static ProgressDialog progressDlg2(Context cxt, int iIcon, int iTitle,
                                              int msg, int OKMsg, int cancelMsg,
                                              boolean cancelable,	boolean cancelableTouchOutside,
                                              OnClickListener onOK, OnClickListener onCancel)
    {
        ProgressDialog progressDialog = new ProgressDialog(cxt);
        if (iIcon != -1)
            progressDialog.setIcon(iIcon);
        progressDialog.setTitle(iTitle);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);

        if (msg != -1)
            progressDialog.setMessage(cxt.getString(msg));
        if (onOK != null)
            progressDialog.setButton(DialogInterface.BUTTON_POSITIVE, cxt.getString(OKMsg), onOK);
        if (onCancel != null)
            progressDialog.setButton(DialogInterface.BUTTON_NEGATIVE, cxt.getString(cancelMsg), onCancel);
        progressDialog.setCancelable(cancelable);
        progressDialog.setCanceledOnTouchOutside(cancelableTouchOutside);
        progressDialog.setProgress(0);

        return progressDialog;
    }

    //-------------------------------Custom--PopUp--Windows-------------------------------------
    /**
     * PopupWindow
     * @param showAsDropDown 如果为true，则后面的gravity，xOffset，yOffset不起作用
     * */
    public static PopupWindow popUpCusDlg(final Activity activity, View view, View parent,
                                          int iWidth, int iHeight,
                                          boolean showAsDropDown,
                                          int gravity, int xOffset, int yOffset) {

        PopupWindow window = new PopupWindow(view, WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT);
        window.setAnimationStyle(android.R.style.Animation_Translucent);	//实现的动画效果与上方的不同，可用
        setBackgroundAlpha(activity, 0.5f);		//设置屏幕透明度
		/*
		DisplayMetrics dm = activity.getResources().getDisplayMetrics();
		int w_screen = dm.widthPixels;
		int h_screen = dm.heightPixels;
		Log.i("Screen", "屏幕宽度：" + w_screen + "  屏幕高度：" + h_screen + "   密度：" + dm.densityDpi);
		*/

        int screen_width = DeviceInfor.instance().getScreenWidth(activity).widthPixels;
        int screen_height = DeviceInfor.instance().getScreenWidth(activity).heightPixels;
        //WindowManager.LayoutParams localLayoutParams = new WindowManager.LayoutParams();
        //localLayoutParams.copyFrom(activity.getWindow().getAttributes());

        //420, 225
        if(screen_width>=1080) {     //1080*1920 电容触摸高清液晶显示屏,M8R,dpi:480,R2:160
            //localLayoutParams.width = screen_width - 150;
            iWidth = screen_width - 150;
        }
        else {
            //localLayoutParams.width = screen_width - 60;
            iWidth = screen_width - 80;
        }
        if (screen_height >= 1920){
            iHeight = (int)(screen_height * 1 / 4.5);
        }
        else{
            iHeight = (int)(screen_height * 1 / 3.5);
        }
        //localLayoutParams.height = ViewGroup.LayoutParams.WRAP_CONTENT;
        //activity.getWindow().setAttributes(localLayoutParams);


        if(iWidth > 0)
            window.setWidth(iWidth);
        if (iHeight > 0)
            window.setHeight(iHeight);

        window.setOutsideTouchable(false);
        window.setFocusable(true);
        window.setTouchable(true);
        // 实例化一个ColorDrawable颜色为半透明
        ColorDrawable dw = new ColorDrawable(0000000000);
        window.setBackgroundDrawable(dw);

        if(showAsDropDown) {
            window.showAsDropDown(parent);
        }
        else{
            window.showAtLocation(parent, gravity, xOffset, yOffset);
        }
        //设置监听
        window.setTouchInterceptor(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_OUTSIDE && !window.isFocusable()) {
                    //如果焦点不在popupWindow上，且点击了外面，不再往下dispatch事件：
                    //不做任何响应,不 dismiss popupWindow
                    return true;
                }
                //否则default，往下dispatch事件:关掉popupWindow，
                return false;
            }
        });
        //popupWindow.showAtLocation(parent, Gravity.BOTTOM | Gravity.LEFT, 0, 0);	//底部
        // 点back键和其他地方使其消失,设置了这个才能触发OnDismisslistener ，设置其他控件变化等操作
        //window.setOnDismissListener(onDismissListener1);
        window.setOnDismissListener(new PopupWindow.OnDismissListener() {
            @Override
            public void onDismiss() {
                // TODO Auto-generated method stub
                setBackgroundAlpha(activity, 1f);   //设置屏幕透明度,完全不透明
            }
        });

        return window;
    }

    /**
     * 设置添加屏幕的背景透明度
     *
     * @param bgAlpha 屏幕透明度0.0-1.0 1表示完全不透明
     */
    public static void setBackgroundAlpha(Activity activity, float bgAlpha) {

        WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
        lp.alpha = bgAlpha;
        activity.getWindow().setAttributes(lp);
    }

    //--Progress wheel

    /**
     * 获取日期设置对话框
     * @param cxt 上下文*/
    public static DatePickerDialog getDateSetDlg(Context cxt, DatePickerDialog.OnDateSetListener listener) {

        /*new DatePickerDialog.OnDateSetListener() {

            @Override
            public void onDateSet(DatePicker dp, int year, int month, int dayOfMonth) {
                showToast(year + "-" + (month + 1) + "-" + dayOfMonth);
            }
        }*/
        Calendar c = Calendar.getInstance();
        DatePickerDialog dialog = new DatePickerDialog(cxt, DatePickerDialog.THEME_HOLO_LIGHT, listener,
                c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH));
        return dialog;
    }

    /**
     * 获取时间设置对话框
     * @param cxt 上下文*/
    public static TimePickerDialog getTimeSetDlg(Context cxt,
                                                 TimePickerDialog.OnTimeSetListener listener) {

        /*new TimePickerDialog.OnTimeSetListener() {

                    @Override
                    public void onTimeSet(TimePicker arg0, int hourOfDay,
                                          int minute) {
                        showToast(hourOfDay + ":" + minute);
                    }
                }*/
        Calendar c = Calendar.getInstance();
        TimePickerDialog dlg = new TimePickerDialog(cxt, TimePickerDialog.THEME_HOLO_LIGHT, listener,
                c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE), true);
        return dlg;
    }

    /**
     * EditText获取焦点并显示软键盘
     */
    public static void showSoftInputFromWindow(Activity activity, EditText editText) {

        editText.setFocusable(true);
        editText.setFocusableInTouchMode(true);
        editText.requestFocus();
        //activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
        activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
    }
}
