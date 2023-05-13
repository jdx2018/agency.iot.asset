package com.supdatas.asset.model;

import android.support.annotation.DrawableRes;

/**
 * Created by Administrator on 2020/05/15
 */
public class MainMenuEntity {

	public MainMenuEntity(String title1, int resImage1) {

		title = title1;
		resImage = resImage1;
	}

	private String title;
	@DrawableRes
	private int resImage;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@DrawableRes
	public int getResImage() {
		return resImage;
	}

	public void setResImage(@DrawableRes int resImage) {
		this.resImage = resImage;
	}
}
