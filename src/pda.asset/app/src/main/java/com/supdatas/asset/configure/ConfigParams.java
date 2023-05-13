package com.supdatas.asset.configure;

/**
 * Created by Administrator on
 */

public class ConfigParams {

    /** 登录信息-userNo */
    public static String userNo;

    /** 盘点(Inventory)功率 */
    public static int mInvenPower = 30;
    /** 入库(In)功率 */
    public static int mInPower = 30;
    /** 出库（Out)功率 */
    public static int mOutPower = 30;
    /** 定位(locate)功率 */
    public static int mLocatePower = 30;

    /** 处理多少天之内的业务单据 */
    public static int mDaysBefore = 15;

    /***/
    public static String tenantId = "supoin";

    public static boolean mIsDbClientDebugMode = true;

    //http://192.168.50.9:3000
    //http://iot.supoin.com:6103
    //http://iot.supoin.com:8107
    /***/
    public static String mDataUrl = "http://iot.supoin.com:6104";   //"http://192.168.50.247:6208/iot/graphOperate";

    public static String mDataHttpUrl = "http://192.168.50.247:6208/iot/graphOperate";
    /***/
    public static String mDeviceAuthUrl = "http://iot.supoin.com:6001/pda/pdaAuth";
    /***/
    public static String mUpgradeUrl = "http://pu.supoin.com";

    public static String mSupDeviceUrl = "http://iot.supoin.com:6201/iot/graphOperate";

    /**签名用*/
    public static final String salt = "supoin@ms.bank";

    /***/
    public static int languageIndex = 0;

    /***/
    public static String accessToken = "";
    /***/
    public static String accessTokenDate = "2020-07-08";

    /***/
    public static String seriesNo = "";

    /**设备IMEI*/
    public static String imei = "";

    /**设备品牌*/
    public static String Device_brand = "";
    /**设备类型*/
    public static String Device_model = "";
    /**设备制造商*/
    public static String Device_manufacturer = "";

    /**0为RFid采集，1为条形码采集*/
    public static int scanMode = 0;

    /**
     * 授权码，如果不为空，表示已经授权成功
     * */
    public static String AuthorizedKey = "";
}
