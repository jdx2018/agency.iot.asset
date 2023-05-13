package com.supdatas.asset.configure;

/**
 * Created by Administrator on 2019/9/7.
 */
public class ConfigConstants
{
    private ConfigConstants(){

    }
    private static ConfigConstants _instance = null;
    public static  ConfigConstants getInstance(){

        if (_instance == null) {
            _instance = new ConfigConstants();
        }
        return _instance;
    }

    public final String RFID_LOCATE_POWER = "RFID_LOCATE_POWER";
    public final String RFID_INVEN_POWER = "RFID_INVEN_POWER";
    public final String RFID_IN_POWER = "RFID_IN_POWER";
    public final String RFID_OUT_POWER = "RFID_OUT_POWER";

    public final static String KEY_USER_NAME = "userName";
    public final static String KEY_LANGUAGE = "languageIndex";
    public final static String KEY_IMEI = "imei";
    public final static String KEY_DEVICE_SNO = "devicesno";
    public final static String KEY_DEVICE_BRAND = "deviceBrand";
    public final static String KEY_DEVICE_MANUFACTURER = "deviceManufacturer";
    public final static String KEY_DEVICE_MODEL = "deviceModel";

    public final static String KEY_WEB_AUTH_URL = "webAuthUrl";
    public final static String KEY_WEB_DATA_URL = "webDataUrl";
    public final static String KEY_WEB_UPGRADE_URL = "webUpgradeUrl";

    public final static String KEY_ACCESS_TOKEN = "accessToken";
    public final static String KEY_ACCESS_TOKEN_DATE = "accessTokenDate";

    public final String SCAN_MODE = "SCAN_MODE";

    public final static String KEY_COMPANYSIGN = "CompanySign";
    public final static String KEY_TENANT_ID = "tenantId";
}
