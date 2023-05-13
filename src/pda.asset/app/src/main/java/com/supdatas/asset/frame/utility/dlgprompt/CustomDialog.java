package com.supdatas.asset.frame.utility.dlgprompt;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.TextView;

import com.supdatas.asset.frame.utility.DeviceInfor;
import com.supdatas.asset.R;


/**
 * 自定义弹出对话框
 * zwei 2017-11-23 修改弹出风格
 */

class CustomDialog extends Dialog {

	private Context mContext;
	private TextView title;
	private TextView message;
	private TextView positiveButton;
	private TextView negativeButton;
	private View mLayout;

	CustomDialog(Context context, int theme) {
		super(context, theme);
		this.mContext = context;
		initView();
	}

	public void initView(){
		this.mLayout = ((LayoutInflater) this.mContext
				.getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(
				R.layout.user_alert_dialog, null);
		this.title = ((TextView) this.mLayout.findViewById(R.id.title));
		this.message = ((TextView) this.mLayout
				.findViewById(R.id.message));
		this.positiveButton = ((TextView) this.mLayout
				.findViewById(R.id.positiveButton));
		this.negativeButton = ((TextView) this.mLayout
				.findViewById(R.id.negativeButton));
	}

	void setMessage(CharSequence message) {
		this.message.setText(message);
	}

	/**
	 * Set the Dialog message from resource
	 */
	void setMessage(int message) {
		this.message.setText(mContext.getString(message));
	}

	/**
	 * Set the Dialog title from resource
	 *
	 */
	public void setTitle(int title) {
		this.title.setText(mContext.getString(title));
	}

	/**
	 * Set the Dialog title from String
	 */

	public void setTitle(String title) {
		this.title.setText(title);
	}

	void setPositiveButton(int text,
						   View.OnClickListener listener) {
		this.positiveButton.setText(mContext.getString(text));
		this.positiveButton.setOnClickListener(listener);
	}

	/**
	 * Set the positive button resource and it's listener
	 */
	void setPositiveButton(CharSequence text,
						   View.OnClickListener listener) {
		this.positiveButton.setText(text);
		this.positiveButton.setOnClickListener(listener);
	}

	void setNegativeButton(CharSequence text,
						   View.OnClickListener listener) {
		this.negativeButton.setText(text);
		this.negativeButton.setOnClickListener(listener);
	}

	void setPositiveButton(View.OnClickListener listener) {
		this.positiveButton.setOnClickListener(listener);
	}

	void setNegativeButtonVisibility(int visibility){
		this.negativeButton.setVisibility(visibility);
	}

	void setNegativeButton(int text,
						   View.OnClickListener listener) {
		this.negativeButton.setText(mContext.getString(text));
		this.negativeButton.setOnClickListener(listener);
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(this.mLayout);

		DisplayMetrics dm = DeviceInfor.instance().getScreenWidth(mContext);
		int screen_width = dm.widthPixels;
		int screen_height = dm.heightPixels;
		WindowManager.LayoutParams localLayoutParams = new WindowManager.LayoutParams();
		localLayoutParams.copyFrom(getWindow().getAttributes());
		if(screen_height>1080)
			localLayoutParams.width = screen_width-160;
		else
			localLayoutParams.width = screen_width-100;

		localLayoutParams.height = ViewGroup.LayoutParams.WRAP_CONTENT;
		getWindow().setAttributes(localLayoutParams);
	}
}
