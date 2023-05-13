package com.supdatas.asset.frame.utility.dlgprompt;

import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Toast;

import com.supdatas.asset.R;

public class AlertUtil {

	private static CustomDialog mDialog;
	private static Context mContext;
	private static ProgressDialog mProgressDialog;
	private static ErrorInfoDialog mErrorDialog;
	private static Object asyncObj = new Object();
	private static int confirmResult = -1;
	private static MyHandler mHandler = null;

	public static void dismissDialog() {
		if (mDialog != null && mDialog.isShowing()) {	//&& mDialog.isShowing()
			mDialog.dismiss();
		}
		mDialog = null;
	}

	public static void dismissErrorDialog() {
		if (mErrorDialog != null && mErrorDialog.isShowing()) {		//
			mErrorDialog.dismiss();
		}
		mErrorDialog = null;
	}

	public static void dismissProgressDialog() {
		if (mProgressDialog != null && mProgressDialog.isShowing()) {	//
			mProgressDialog.dismiss();
		}
		mProgressDialog = null;
	}

	public static boolean isProgressDialogShowing(){

		return mProgressDialog != null && mProgressDialog.isShowing();
	}

	private static void dimBehind(Dialog dialog) {
		WindowManager.LayoutParams lp = dialog.getWindow().getAttributes();
		lp.alpha = 1.0f;
		lp.flags = lp.flags | WindowManager.LayoutParams.FLAG_DIM_BEHIND;
		lp.dimAmount = 0.5f;
		dialog.getWindow().setAttributes(lp);
	}

	public static String getString(int resId) {
		return mContext.getString(resId);
	}

	public static void showAlert(Context paramContext, CharSequence title,
								 CharSequence message, CharSequence positiveText,
								 View.OnClickListener listener) {
		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			return;
		}
		mDialog = new CustomDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		mDialog.setMessage(message);
		mDialog.setPositiveButton(positiveText, listener);
		mDialog.setCancelable(false);
		mDialog.show();
	}

	public static void showAlert(Context paramContext, int title, int message,
								 int positiveText, View.OnClickListener positiveBtnListener,
								 int negativeText, View.OnClickListener negativeBtnListener) {
		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			return;
		}
		mDialog = new CustomDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		mDialog.setMessage(message);
		mDialog.setPositiveButton(positiveText, positiveBtnListener);
		mDialog.setNegativeButton(negativeText, negativeBtnListener);
		mDialog.setCancelable(false);
		mDialog.show();
	}

	public static void showAlert(Context paramContext, CharSequence title, CharSequence message,
								 CharSequence positiveText, View.OnClickListener positiveBtnListener,
								 CharSequence negativeText, View.OnClickListener negativeBtnListener) {
		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			return;
		}
		mDialog = new CustomDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		mDialog.setMessage(message);
		mDialog.setPositiveButton(positiveText, positiveBtnListener);
		mDialog.setNegativeButton(negativeText, negativeBtnListener);
		mDialog.setCancelable(false);
		mDialog.show();
	}

	/**
	 * 判断当前对话框是否在显示着
	 * */
	public static boolean isAlertShowing(){

		if (mDialog != null && mDialog.isShowing()) {
			return true;
		}
		return false;
	}

	/**
	 * 这个把message用String类型了，方便格式化
	 *
	 */
	public static void showAlert(Context paramContext, int title,
								 CharSequence message, int positiveText,
								 View.OnClickListener positiveBtnListener, int negativeText,
								 View.OnClickListener negativeBtnListener) {
		showAlert(paramContext, title, R.string.dialog_title, positiveText,
				positiveBtnListener, negativeText, negativeBtnListener);
		mDialog.setMessage(message);
	}

	public static void showAlert(Context paramContext,
								 String message, boolean hasCancel) {

		showAlert(paramContext, paramContext.getString(R.string.dialog_title),
				message, hasCancel);
	}

	public static void showAlert(Context paramContext, String message) {

		showAlert(paramContext, message, false);
	}

	public static void showAlert(Context paramContext, String title,
								 String message, boolean hasCancel) {
		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			return;
		}
		mDialog = new CustomDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		if (!hasCancel){
			mDialog.setNegativeButtonVisibility(View.GONE);
		}
		mDialog.setMessage(message);
		mDialog.setPositiveButton(new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
			}
		});
		if (hasCancel) {
			mDialog.setNegativeButton(R.string.cancel, new View.OnClickListener() {

				@Override
				public void onClick(View v) {
					dismissDialog();
				}
			});
		}
		mDialog.show();
	}

	public static void showAlert(Context paramContext,
								 int message, boolean hasCancel) {

		showAlert(paramContext, R.string.dialog_title, message, hasCancel);
	}

	public static void showAlert(Context paramContext, int title,
								 int message, boolean hasCancel) {
		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			return;
		}
		mDialog = new CustomDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		if (!hasCancel){
			mDialog.setNegativeButtonVisibility(View.GONE);
		}
		mDialog.setMessage(message);
		mDialog.setPositiveButton(new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
			}
		});
		if (hasCancel) {
			mDialog.setNegativeButton(R.string.cancel, new View.OnClickListener() {

				@Override
				public void onClick(View v) {
					dismissDialog();
				}
			});
		}
		mDialog.show();
	}

	public static boolean showAlertConfirm(Context paramContext, int title, int message) {
		return showAlertConfirm(paramContext, getString(title), getString(message));
	}

	public static boolean showAlertConfirm(Context paramContext, String title,
								 String message) {

		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			dismissDialog();
		}
		if (mHandler == null)
			mHandler = new MyHandler();

		mDialog = new CustomDialog(mContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		mDialog.setMessage(message);
		mDialog.setCancelable(false);
		confirmResult = -1;
		mDialog.setPositiveButton(new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
				confirmResult = 1;
				Message m = mHandler.obtainMessage();
				mHandler.sendMessage(m);
			}
		});

		mDialog.setNegativeButton(R.string.cancel, new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
				confirmResult = 0;
				Message m = mHandler.obtainMessage();
				mHandler.sendMessage(m);
			}
		});
		mDialog.show();

		try {
			Looper.loop();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return confirmResult == 1 ? true : false;
	}

	public static void showAlert(Context paramContext, String title,
								 String message) {

		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			return;
		}
		mDialog = new CustomDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		mDialog.setMessage(message);
		mDialog.setPositiveButton(new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
			}
		});
		mDialog.setNegativeButton(R.string.cancel, new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
			}
		});
		mDialog.show();
	}

	public static void showAlert(Context paramContext, int message) {

		showAlert(paramContext, message, false);
	}

	public static void showAlert(Context paramContext, int title, int message) {
		mContext = paramContext;
		if (mDialog != null && mDialog.isShowing()) {
			return;
		}
		mDialog = new CustomDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mDialog);
		mDialog.setTitle(title);
		mDialog.setMessage(message);
		mDialog.setPositiveButton(new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
			}
		});
		mDialog.setNegativeButton(R.string.cancel, new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
			}
		});
		mDialog.setNegativeButton(R.string.cancel, new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissDialog();
			}
		});
		mDialog.show();
	}

	// 无按钮dialog
	public static ProgressDialog showNoButtonProgressDialog(Context context,
															String message) {
		mContext = context;
		mProgressDialog = ProgressDialog.show(context, "请稍等", "", true);
		mProgressDialog.setContentView(R.layout.progressbar_nobutton);
		((TextView) mProgressDialog
				.findViewById(R.id.progressbar_button_textview1))
				.setText(message);
		mProgressDialog.setCancelable(false);
		return mProgressDialog;
	}

	public static void setNoButtonMessage(String message){
		if(mProgressDialog!=null)
			((TextView) mProgressDialog.findViewById(R.id.progressbar_button_textview1))
					.setText(message);
	}

	public static void showErrorAlert(Context paramContext, String message) {
		mContext = paramContext;
		if (mErrorDialog != null && mErrorDialog.isShowing()) {
			return;
		}
		mErrorDialog = new ErrorInfoDialog(paramContext, R.style.cusdom_dialog_whitebg);
		dimBehind(mErrorDialog);
		mErrorDialog.setMessage(message);
		mErrorDialog.setPositiveButton(new View.OnClickListener() {

			@Override
			public void onClick(View v) {
				dismissErrorDialog();
			}
		});
		mErrorDialog.show();
	}

	/**
	 * 在子线程也可以调用
	 */
	public static void showToast(Context paramContext, int message) {
		Toast.makeText(paramContext, getString(message), Toast.LENGTH_LONG).show();
	}
	/**
	 * 在子线程也可以调用
	 */
	public static void showToast(Context paramContext, String message) {
		Toast.makeText(paramContext, message, Toast.LENGTH_LONG).show();
	}

	/**
	 * 在子线程也可以调用
	 */
	public static void showToastShort(Context paramContext, int message) {
		Toast.makeText(paramContext, getString(message),
				Toast.LENGTH_SHORT).show();
	}
	/**
	 * 在子线程也可以调用
	 */
	public static void showToastShort(Context paramContext, String message) {

		Toast.makeText(paramContext, message, Toast.LENGTH_SHORT).show();
	}

	private static class  MyHandler extends Handler{
		public void handleMessage(Message mesg) {
			throw new RuntimeException();
		}
	}
}

