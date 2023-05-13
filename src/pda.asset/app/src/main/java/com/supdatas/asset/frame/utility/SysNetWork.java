package com.supdatas.asset.frame.utility;

import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.content.Context;

/**
 * Created by Administrator on 2017/7/9.
 */

public class SysNetWork
{
    public boolean isNetWorkAvailable(Context context)
    {
        ConnectivityManager manager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isAvailable()){
           return true;
        }
        else{
            return false;
        }
    }
}
