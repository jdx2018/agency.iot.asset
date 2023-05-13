package com.supdatas.asset.frame.utility;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import android.text.TextUtils;
import android.util.Log;

import com.supdatas.asset.model.ReturnMsg;

/**
 * @author: zxl
 * @description please add a description here
 * @date: Create in 17:51 2020/7/7
 */
public class HttpUtility {

    /** 超时时间，in milliseconds*/
    public static final int TIME_OUT = 10 * 1000;

    public static ReturnMsg httpRequest(String requestUrl, String requestMethod) throws Exception {

        ReturnMsg returnMsg = new ReturnMsg();
        try {
            DefaultHttpClient httpClient = new DefaultHttpClient();
            //HttpPost httpPost = new HttpPost(requestUrl);
            HttpGet httpGet = new HttpGet(requestUrl);
            // 设置链接超时
            httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, TIME_OUT);
            // 设置读取超时
            httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, TIME_OUT);
            //httpPost.addHeader(HTTP.CONTENT_TYPE, "application/json");

            HttpResponse httpResponse = httpClient.execute(httpGet);
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                HttpEntity entity = httpResponse.getEntity();
                String result = EntityUtils.toString(entity,"utf-8");

                returnMsg.status = 1;
                returnMsg.message = "";
                returnMsg.content = result;
            } else {
                String reaseon = httpResponse.getStatusLine().getReasonPhrase();
                returnMsg.status = 0;
                returnMsg.message = reaseon;
                returnMsg.content = "";
            }

        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            throw e;
        } catch (ClientProtocolException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            throw e;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            throw e;
        }
        return returnMsg;
    }

    /**
     * Post-UrlEncodedFormEntity
     * */
    public static ReturnMsg httpPost1(String requestUrl, HashMap<String,String> mapParam)
            throws Exception {

        ReturnMsg returnMsg = new ReturnMsg();
        try {
            DefaultHttpClient httpClient = new DefaultHttpClient();
            // 设置链接超时
            httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, TIME_OUT);
            // 设置读取超时
            httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, TIME_OUT);

            List<NameValuePair> params = new ArrayList<NameValuePair>();
            Iterator iterator = mapParam.keySet().iterator();
            while (iterator.hasNext())
            {
                String key = (String) iterator.next();
                String value = (String) mapParam.get(key);
                if (value != null) {
                    params.add(new BasicNameValuePair(key, value));
                    Log.w("returnUp", key+ "---" + value);
                }
            }
            UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params, "utf-8");		//utf-8

            HttpPost httpPost = new HttpPost(requestUrl);
            httpPost.setEntity(entity);
            HttpResponse httpResponse = httpClient.execute(httpPost);

            int hStatus = httpResponse.getStatusLine().getStatusCode();
            if (hStatus == HttpStatus.SC_OK) {
                HttpEntity httpEntity = httpResponse.getEntity();
                String result = EntityUtils.toString(httpEntity,"utf-8");		//

                returnMsg.status = 1;
                returnMsg.message = "";
                returnMsg.content = result;
            } else {
                String reaseon = httpResponse.getStatusLine().getReasonPhrase();
                if (hStatus == 404 && TextUtils.isEmpty(reaseon)){
                    reaseon = "无法连接到指定地址.";
                }
                returnMsg.status = 0;
                returnMsg.message = reaseon;
                returnMsg.content = "";
                //throw new Exception(reaseon);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw e;
        } catch (ClientProtocolException e) {
            e.printStackTrace();
            throw e;
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
        return returnMsg;
    }

    //Post
    public static ReturnMsg httpPost(String requestUrl,
                                  HashMap<String,String> mapHeaders,
                                  HashMap<String,String> mapParams)
            throws Exception {
        ReturnMsg returnMsg = new ReturnMsg();
        try {
            DefaultHttpClient httpClient = new DefaultHttpClient();
            // 设置链接超时
            httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, TIME_OUT);
            // 设置读取超时
            httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, TIME_OUT);

            HttpPost httpPost = new HttpPost(requestUrl);
            httpPost.addHeader("Content-Type", "application/json;charset=utf-8");

            if (mapHeaders != null && mapHeaders.size() > 0) {

                Iterator iterator = mapHeaders.keySet().iterator();
                while (iterator.hasNext()) {
                    String key = (String) iterator.next();
                    String value = (String) mapHeaders.get(key);
                    if (value != null) {
                        httpPost.addHeader(key, value);
                    }
                }
            }

            if (mapParams != null && mapParams.size() > 0) {
                Iterator iterator = mapParams.keySet().iterator();
                JSONObject jsonParam = new JSONObject();
                while (iterator.hasNext()) {
                    String key = (String) iterator.next();
                    String value = (String) mapParams.get(key);
                    if (value != null) {
                        if (key.equals("command"))
                            jsonParam.put(key, Integer.parseInt(value));
                        else
                            jsonParam.put(key, value);
                    }
                }
                httpPost.setEntity(new StringEntity(jsonParam.toString()));
            }
            HttpResponse httpResponse = httpClient.execute(httpPost);
            int hStatus = httpResponse.getStatusLine().getStatusCode();
            if (hStatus == HttpStatus.SC_OK) {
                HttpEntity httpEntity = httpResponse.getEntity();
                String result = EntityUtils.toString(httpEntity,"utf-8");

                returnMsg.status = 1;
                returnMsg.message = "";
                returnMsg.content = result;
            } else {
                String reaseon = httpResponse.getStatusLine().getReasonPhrase();
                if (hStatus == 404 && TextUtils.isEmpty(reaseon)){
                    reaseon = "无法连接到指定地址.";
                }
                returnMsg.status = 0;
                returnMsg.message = reaseon;
                returnMsg.content = "";
                //throw new Exception(reaseon);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw e;
        } catch (ClientProtocolException e) {
            e.printStackTrace();
            throw e;
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
        return returnMsg;
    }

    //Post-Json-Strings
    public static ReturnMsg httpPost(String requestUrl, String jsonStr)
            throws Exception {
        return httpPost(requestUrl, null, jsonStr);
    }

    //Post-Json-Strings
    public static ReturnMsg httpPost(String requestUrl,
                                     HashMap<String,String> mapHeaders,
                                     String jsonStr)
            throws Exception {

        ReturnMsg returnMsg = new ReturnMsg();
        try {
            DefaultHttpClient httpClient = new DefaultHttpClient();
            // 设置链接超时
            httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, TIME_OUT);
            // 设置读取超时
            httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, TIME_OUT);

            HttpPost httpPost = new HttpPost(requestUrl);
            httpPost.addHeader("Content-Type", "application/json;charset=utf-8");

            if (mapHeaders != null && mapHeaders.size() > 0) {

                Iterator iterator = mapHeaders.keySet().iterator();
                while (iterator.hasNext()) {
                    String key = (String) iterator.next();
                    String value = (String) mapHeaders.get(key);
                    if (value != null) {
                        httpPost.addHeader(key, value);
                    }
                }
            }
            httpPost.setEntity(new StringEntity(jsonStr, "utf-8"));
            HttpResponse httpResponse = httpClient.execute(httpPost);

            int hStatus = httpResponse.getStatusLine().getStatusCode();
            if (hStatus == HttpStatus.SC_OK) {
                HttpEntity httpEntity = httpResponse.getEntity();
                String result = EntityUtils.toString(httpEntity,"utf-8");

                returnMsg.status = 1;
                returnMsg.message = "";
                returnMsg.content = result;
            } else {
                String reaseon = httpResponse.getStatusLine().getReasonPhrase();
                if (hStatus == 404 && TextUtils.isEmpty(reaseon)){
                    reaseon = "无法连接到指定地址.";
                }
                returnMsg.status = 0;
                returnMsg.message = reaseon;
                returnMsg.content = "";
                //throw new Exception(reaseon);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw e;
        } catch (ClientProtocolException e) {
            e.printStackTrace();
            throw e;
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
        return returnMsg;
    }
}