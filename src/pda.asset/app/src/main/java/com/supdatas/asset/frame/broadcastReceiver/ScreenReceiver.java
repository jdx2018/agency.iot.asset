package com.supdatas.asset.frame.broadcastReceiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class ScreenReceiver {


	/*final IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_SCREEN_ON);
	registerReceiver(mBatInfoReceiver, filter);*/

	private final BroadcastReceiver mBatInfoReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(final Context context, final Intent intent) {
			final String action = intent.getAction();
			if(Intent.ACTION_SCREEN_ON.equals(action)){
				//Log.d(TAG, "-----------------screen is on...");
			}else if(Intent.ACTION_SCREEN_OFF.equals(action)){
				//Log.d(TAG, "----------------- screen is off...");
			}
		}
	};
}
