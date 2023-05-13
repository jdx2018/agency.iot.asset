package com.supdatas.asset.frame.utility;

import com.supdatas.asset.configure.SysConstants;
import android.content.SharedPreferences;
import android.content.Context;

/**
 * Created by Administrator on 2019/6/20.
 */
public class SysSharedPreference {

    private SharedPreferences preference;

    public SysSharedPreference(final Context cxt){
        preference = cxt.getSharedPreferences(SysConstants.sysSharedPreferenceName, cxt.MODE_PRIVATE);
    }

    public String getItemStrValue(final String item, String ifNullValue){

        return preference.getString(item, ifNullValue);	//读取数据
    }

    public int getItemIntValue(final String item, int ifNullValue){

        return preference.getInt(item, ifNullValue);
    }

    public boolean getItemBooleanValue(final String item, boolean ifNullValue){

        return preference.getBoolean(item, ifNullValue);
    }

    public void setItemStrValue(final String item, String value){

        preference.edit().putString(item, value).commit();
    }

    public void setItemIntValue(final String item, int value){

        preference.edit().putInt(item, value).commit();
    }
    public void setItemBooleanValue(final String item, boolean value){

        preference.edit().putBoolean(item, value).commit();
    }
}
