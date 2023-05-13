package com.supdatas.asset.frame.utility.dlgprompt;

/**
 * Created by Administrator on 2017/11/14.
 */

import android.app.AlertDialog;
import android.content.Context;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;

import com.supdatas.asset.R;

public class DlgCusGreenPie
{
    private Context context = null;

    private AlertDialog alertDlg = null;
    private AlertDialog.Builder builder3 = null;
    private ProgressBar progressBar = null;
    private TextView tvPrompt = null;
    private boolean bIsRunning = false;
    private int iProStep = 0;

    private boolean cancelableOnTouchOutSide = false;
    private boolean canCanceled = false;

    public DlgCusGreenPie(Context cxt, boolean canCanceledOnTouchOutside, boolean cancelable)
    {
        context = cxt;
        cancelableOnTouchOutSide = canCanceledOnTouchOutside;
        canCanceled = cancelable;
        builder3 = new AlertDialog.Builder(context);
    }

    public void setProStep(int iValue)
    {
        progressBar.setProgress(iValue);
    }

    public void setPrompt(String strPrompt)
    {
        tvPrompt.setText(strPrompt);
    }

    public void showDlgPie(){
        // LayoutInflater是用来找layout文件夹下的xml布局文件，并且实例化
        LayoutInflater factory = LayoutInflater.from(context);
        // 把activity_login中的控件定义在View中
        View view = factory.inflate(R.layout.dlg_prompt_is_pei_busy, null);
        tvPrompt = (TextView) view.findViewById(R.id.tv_prompt);
        progressBar = (ProgressBar)view.findViewById(R.id.pro_bar);

		/*Button btn = (Button) view.findViewById(R.id.dialog_logout_button_id);
		btn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View arg0) {
				showToast("按下自定义视图的按钮了~");
			}
		});*/
        // 设定显示的View
        builder3.setView(view);
        // 设置dialog是否为模态，false表示模态，true表示非模态
        // ab.setCancelable(false);
        // 对话框的创建、显示,这里显示的位置是在屏幕的最下面，但是很不推荐这个种做法，因为距底部有一段空隙
        alertDlg = builder3.create();
        Window window = alertDlg.getWindow();
        window.setGravity(Gravity.CENTER); // 此处可以设置dialog显示的位置
        window.setWindowAnimations(R.style.myAnimationstyle); // 添加动画
        //window.setAnimationStyle(android.R.style.Animation_Translucent);
        alertDlg.setCanceledOnTouchOutside(cancelableOnTouchOutSide);
        alertDlg.setCancelable(canCanceled);
        alertDlg.show();

        bIsRunning = true;
        progressBar.setProgress(0);
        iProStep = 0;
        tvPrompt.setText("正在处理，请稍候...");
    }

    public void dismiss()
    {
        alertDlg.dismiss();
        bIsRunning = false;
        iProStep = 0;
    }
}
