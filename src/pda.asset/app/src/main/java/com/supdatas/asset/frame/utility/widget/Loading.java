/*******************************************************************************
 * Copyright (C) 2017 青岛海信智能商用系统股份有限公司 版权所有
 ******************************************************************************/

package com.supdatas.asset.frame.utility.widget;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;

import com.supdatas.asset.R;


/**
 * Loading
 *
 * @author xxx 2020-07-29
 */
public class Loading extends Dialog {

    private Animation mAnimation;

    /**
     * 实例化LoadingDialog
     *
     * @param context 上下文对象
     */
    private Loading(Context context) {
        super(context, R.style.LoadingDialog);
    }

    /**
     * 创建Dialog
     *
     * @param savedInstanceState 状态
     * @author guanguangjin 2017-10-29
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LayoutInflater inflater = LayoutInflater.from(getContext());
        View view = inflater.inflate(R.layout.dialog_loading, null);
        ImageView spaceshipImage = (ImageView) view.findViewById(R.id.img_loading);
        Animation animation = AnimationUtils.loadAnimation(
                getContext(), R.anim.general_loading);
        spaceshipImage.startAnimation(animation);
        setContentView(view);
        setCancelable(false);
    }

    /**
     * 销毁Loading
     */
    @Override
    public void dismiss() {
        if (mAnimation != null) {
            mAnimation.cancel();
        }
        super.dismiss();
    }

    /**
     * 快速创建并显示Loading
     */
    public static Loading show(Context context) {
        Loading loading = new Loading(context);
        loading.setCanceledOnTouchOutside(false);
        loading.show();
        return loading;
    }
}