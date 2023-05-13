package com.supdatas.asset.frame.utility;

import android.app.Activity;
import android.content.Context;
import android.text.method.ReplacementTransformationMethod;
import android.util.Log;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import java.util.List;

/**
 * Created by Administrator on 2017/9/28.
 */

public class TextUtil
{
    public static boolean isNullOrEmpty(String value)
    {
        if (value == null) {
            return true;
        }
        if (value.equals("")) {
            return true;
        }
        return false;
    }

    public static void clearBytes(byte[]array)
    {
        for (int i = 0; i <array.length; ++i) {
            array[i] = 0;
        }
    }

    public static void clearBytes(Byte[]array)
    {
        for (int i = 0; i <array.length; ++i) {
            array[i] = 0;
        }
    }

    //把byte[]转移成Byte[]数组
    public static Byte[] byteArrayToByteArray(byte[]arr)
    {
        long ls = System.currentTimeMillis();
        Byte[]arrDest = new Byte[arr.length];

        int i = 0;
        for (byte b : arr)
        {
            arrDest[i++] = b;
        }
        //System.arraycopy(arrDest, 0, arr, 0, arr.length);   //Error
        Log.e("byteArrayToByteArray:", arr.length + "===================" + (System.currentTimeMillis() - ls));
        return arrDest;
    }

    //把Byte[]转移成byte[]数组
    public static byte[] ByteArrayTo_byteArray(Byte[]arr)
    {
        long ls = System.currentTimeMillis();
        byte[]arrDest = new byte[arr.length];

        int i = 0;
        for (Byte b : arr)
        {
            arrDest[i++] = b;
        }
        //System.arraycopy(arrDest, 0, arr, 0, arr.length);   //Error
        Log.e("ByteArrayTo_byteArray:", arr.length + "===================" + (System.currentTimeMillis() - ls));
        return arrDest;
    }

    public static byte[] listByteToArraybyte(List<Byte> list)
    {
        long ls = System.currentTimeMillis();

        byte[]arr = new byte[list.size()];
        int i = 0;
        for (Byte b : list)
        {
            arr[i++] = b;
        }
        Log.e("listByteToArraybyte", list.size() + "===================" + (System.currentTimeMillis() - ls) + "");
        return arr;
    }

    /**
     * 小写转大写方法
     * */
    public static ReplacementTransformationMethod mReplacementTransformationLower2UpperMethod =
            new ReplacementTransformationMethod() {
                @Override
                protected char[] getOriginal() {
                    char[] o = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
                    return o;
                }

                @Override
                protected char[] getReplacement() {
                    char[] r = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
                    return r;
                }
            };

    /**
     * 大写转小写方法
     * */
    public static ReplacementTransformationMethod mReplacementTransformationUpper2LowerMethod =
            new ReplacementTransformationMethod() {
                @Override
                protected char[] getOriginal() {
                    char[] r = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
                    return r;
                }

                @Override
                protected char[] getReplacement() {
                    char[] o = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
                    return o;
                }
            };

    public static void hideInputMethod(Activity activity, EditText editText){

        InputMethodManager imm = (InputMethodManager)activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        if(imm.isActive()) {
            imm.hideSoftInputFromWindow(editText.getWindowToken(), 0);
        }
        else {
            imm.showSoftInput(editText, 0);
        }
    }
}
