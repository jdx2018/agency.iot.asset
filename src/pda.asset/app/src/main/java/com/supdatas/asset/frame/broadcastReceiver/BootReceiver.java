package com.supdatas.asset.frame.broadcastReceiver;

import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.Context;

/**
 * Created by cftlin on 2019/4/16.
 */
//启动自启动活动
public class BootReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
       /* if(intent.getAction().equals("android.intent.action.BOOT_COMPLETED")) {
            Intent i = new Intent(context, DlgTestActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(i);
        }*/
    }
}
