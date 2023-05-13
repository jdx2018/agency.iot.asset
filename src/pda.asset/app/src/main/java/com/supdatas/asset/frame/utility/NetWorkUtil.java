package com.supdatas.asset.frame.utility;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class NetWorkUtil {

	/**
	 * 判断网络是否连接
	 * 有网时返回true，没网时返回false
	 * @param context 上下文
	 * */
	public static boolean isNetworkConnected(Context context) {

		try {
			ConnectivityManager connectivity = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
			if (connectivity != null) {

				NetworkInfo info = connectivity.getActiveNetworkInfo();
				if (info != null && info.isConnected()) {

					if (info.getState() == NetworkInfo.State.CONNECTED) {
						return true;
					}
				}
			}
		} catch (Exception e) {
			return false;
		}
		return false;
	}

	/**
	 * 是WIFI网络返回true，不是WIFI返回false
	 * */
	public static boolean isWifiConnected(Context context) {
		if (context != null) {
			ConnectivityManager mConnectivityManager = (ConnectivityManager) context
					.getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo mWiFiNetworkInfo = mConnectivityManager.getActiveNetworkInfo();
			if (mWiFiNetworkInfo != null && mWiFiNetworkInfo.getType() == ConnectivityManager.TYPE_WIFI) {
				return mWiFiNetworkInfo.isAvailable();
			}
		}
		return false;
	}

	/**
	 * 是数据流量时返回true，不是返回false
	 * */
	public static boolean isMobileConnected(Context context) {
		if (context != null) {
			ConnectivityManager mConnectivityManager = (ConnectivityManager) context
					.getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo mMobileNetworkInfo = mConnectivityManager.getActiveNetworkInfo();
			if (mMobileNetworkInfo != null && mMobileNetworkInfo.getType() == ConnectivityManager.TYPE_MOBILE) {
				return mMobileNetworkInfo.isAvailable();
			}
		}
		return false;
	}

	/**
	 * 获取当前的网络状态;没有网络0：WIFI网络1：3G网络2：2G网络3
	 * */
	public static int getConnectedType(Context context) {
		if (context != null) {
			ConnectivityManager mConnectivityManager = (ConnectivityManager) context
					.getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo mNetworkInfo = mConnectivityManager.getActiveNetworkInfo();
			if (mNetworkInfo != null && mNetworkInfo.isAvailable()) {
				return mNetworkInfo.getType();
			}
		}
		return -1;
	}


	/**
	 * ping Host，返回true表示ping通，false表示失败
	 * */
	public static boolean pingHost(String str){
		boolean resault=false;
		try {
			// TODO: Hardcoded for now, make it UI configurable
			Process p = Runtime.getRuntime().exec("/system/bin/ping -c 4 -w 100 " +str);
			int status = p.waitFor();
			InputStream input = p.getInputStream();
			BufferedReader in = new BufferedReader(new InputStreamReader(input));
			StringBuffer buffer = new StringBuffer();
			String line = "";
			while ((line = in.readLine()) != null) {
				buffer.append(line);
				Log.i("pingHost", line);
			}
			if (status == 0) {
				resault=true;
				Log.e("pingHost", "success......");
			}
			else {
				resault=false;
				Log.e("pingHost", "failed......" + status + "...");
			}
		} catch (IOException e) {
			Log.e("pingHost", e.toString());
			resault = false;
		} catch (InterruptedException e) {
			Log.e("pingHost", e.toString());
			resault=false;
		}
		return resault;
	}
}
