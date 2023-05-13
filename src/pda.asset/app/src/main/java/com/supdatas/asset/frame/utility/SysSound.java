package com.supdatas.asset.frame.utility;

import android.content.Context;
import android.media.AudioManager;
import android.media.SoundPool;

import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.R;

public class SysSound {

    private Context mContext;
    private static SysSound _instance = null;
    public static SysSound getIntance(){

        if (_instance == null)
            _instance = new SysSound(MainApplication.instance().getApplicationContext());
        return _instance;
    }
    private SoundPool soundPoolError;
    private SoundPool soundPoolBeep;
    private SoundPool soundPoolOK;

    @SuppressWarnings("deprecation")
    private SysSound(Context cxt){

        mContext = cxt;
        soundPoolError = new SoundPool(10, AudioManager.STREAM_SYSTEM, 100);
        soundPoolError.load(mContext, R.raw.error02, 1);

        soundPoolBeep = new SoundPool(10, AudioManager.STREAM_SYSTEM, 100);
        soundPoolBeep.load(mContext, R.raw.beep03, 1);

        soundPoolOK = new SoundPool(10, AudioManager.STREAM_SYSTEM, 100);
        soundPoolOK.load(mContext, R.raw.ok01, 1);
    }

    /**
     * 播放声音
     * @author Administrator
     * @param iType 类型1表示播放正确声音，2表示播放错误提示单,3为Beep
     * @param soundTime 声音播放次数，当为错误时，建议播放次数为4*/
    public void playSound(int iType, int soundTime) {

        if (iType == 1){
            soundPoolOK.play(1, 1, 1, 0, 0, 1);
        }
        else if (iType == 2) {
            soundPoolBeep.play(1, 1, 1, 0, soundTime, 1);
        }
        else if (iType == 3) {
            soundPoolError.play(1, 1, 1, 0, soundTime, 1);
        }
    }
}

