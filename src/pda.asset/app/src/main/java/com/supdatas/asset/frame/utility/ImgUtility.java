package com.supdatas.asset.frame.utility;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import java.io.InputStream;

public class ImgUtility {

	public static Bitmap getUrlImg(final String imgUrl) throws Exception {

		Bitmap tmpBitmap = null;
		try {
			InputStream is = new java.net.URL(imgUrl).openStream();
			tmpBitmap = BitmapFactory.decodeStream(is);
			is.close();
		} catch (Exception e) {
			throw e;
		}
		return tmpBitmap;
	}
}
