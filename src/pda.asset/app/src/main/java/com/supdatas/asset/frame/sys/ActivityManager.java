package com.supdatas.asset.frame.sys;

import android.app.Activity;

import java.util.Stack;

public class ActivityManager {

	private static ActivityManager instance;
	private Stack<Activity> mActivityStack;

	// 单例模式
	public static ActivityManager getInstance() {
		if (instance == null) {
			instance = new ActivityManager();
		}
		return instance;
	}

	// 把一个activity压入栈中
	public void pushOneActivity(Activity actvity) {
		if (mActivityStack == null) {
			mActivityStack = new Stack<Activity>();
		}
		mActivityStack.add(actvity);
	}

	// 获取栈顶的activity，先进后出原则
	public Activity getLastActivity() {
		return mActivityStack.lastElement();
	}

	// 移除一个activity
	public void popOneActivity(Activity activity) {
		if (mActivityStack != null && mActivityStack.size() > 0) {
			if (activity != null) {
				activity.finish();
				mActivityStack.remove(activity);
				activity = null;
			}
		}
	}

	// 退出所有activity
	public void finishAllActivity() {
		if (mActivityStack != null) {
			while (mActivityStack.size() > 0) {
				Activity activity = getLastActivity();
				if (activity == null) {
					break;
				}
				popOneActivity(activity);
			}
		}

	}
}
