package com.supdatas.asset.frame.utility.encryptAlgorithm;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.security.NoSuchAlgorithmException;
import java.util.Locale;

public class AESCBC128 {

	/**
	 * @program
	 * @description AES128位CBC模式加解密
	 * @create 2019-04-03 14:55
	 **/
	private static final String KEY = "supoin.iot@sz209";//"1234567890123456";;
	private final static String ENCODING = "utf-8";
	private static String iv = "iot.supoin#Sz802";	//"abcdefghijklmnop";;
	private static String TRANSFORMATION = "AES/CBC/PKCS5Padding";

	/**
	 * @param buf 二进制
	 * @return java.lang.String
	 * @description 将二进制转换成16进制
	 * @date 2019/5/8 9:49
	 */
	public static String parseByte2HexStr(byte[] buf)
	{
		if (null == buf)
		{
			return null;
		}
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < buf.length; i++)
		{
			String hex = Integer.toHexString(buf[i] & 0xFF);
			if (hex.length() == 1)
			{
				hex = '0' + hex;
			}
			sb.append(hex.toUpperCase(Locale.US));
		}
		return sb.toString();
	}

	/**
	 * @param hexStr 16进制
	 * @return byte[]
	 * @description 将16进制转换为二进制
	 * @date 2019/5/8 9:50
	 */
	public static byte[] parseHexStr2Byte(String hexStr)
	{
		if (hexStr.length() < 1)
		{
			return null;
		}
		byte[] result = new byte[hexStr.length() / 2];
		for (int i = 0; i < hexStr.length() / 2; i++)
		{
			int high = Integer.parseInt(hexStr.substring(i * 2, i * 2 + 1), 16);
			int low = Integer.parseInt(hexStr.substring(i * 2 + 1, i * 2 + 2), 16);
			result[i] = (byte) (high * 16 + low);
		}
		return result;
	}

	/**
	 * @return java.lang.String
	 * @description 生成base64 编码后的AES128位密钥
	 * @date 2019/5/8 9:51
	 */
	public static String getAESKey()
	{
		KeyGenerator kg = null;
		try
		{
			kg = KeyGenerator.getInstance("AES");
		}
		catch (NoSuchAlgorithmException e)
		{
			e.printStackTrace();
		}
		kg.init(128);// 要生成多少位，只需要修改这里即可128, 192或256
		SecretKey sk = kg.generateKey();
		byte[] b = sk.getEncoded();
		String hexKey = parseByte2HexStr(b);
		return hexKey;
	}

	/**
	 * @param text      待加密的字符串
	 * @return byte[] 加密后的byte[] 数组
	 * @description AES加密
	 * @date 2019/5/8 9:51
	 */
	public static String getAESEncode(String text)
	{
		if (text == null) {
			return null;
		}
		if (KEY.length() != 16) {
			throw new IllegalArgumentException("Invalid key size.");
		}
		byte[] encodeResult = null;
		String encrypted = "";
		try {
			SecretKeySpec skeySpec = new SecretKeySpec(KEY.getBytes(ENCODING), "AES");
			Cipher cipher = Cipher.getInstance(TRANSFORMATION);
			/**
			 * aes-cbc模式加密在加密和解密是需要一个初始化向量(Initialization Vector, IV)，在每次加密之前或者解密之后，使用初始化向量与明文或密文异或。
			 */
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec, new IvParameterSpec(iv.getBytes(ENCODING)));
			encodeResult = cipher.doFinal(text.getBytes(Charset.forName(ENCODING)));
			encrypted  = android.util.Base64.encodeToString(encodeResult, android.util.Base64.NO_WRAP);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return encrypted;
	}

	/**
	 * @param text      待解密的字符串
	 * @return byte[] 解密后的byte[] 数组
	 * @description AES解密
	 * @date 2019/5/8 9:51
	 */
	public static String getAESDecode(byte[] text) throws Exception
	{
		try {
			if (null == text) {
				return null;
			}
			if (KEY.length() != 16) {
				throw new IllegalArgumentException("Invalid key size.");
			}
			SecretKeySpec skeySpec = new SecretKeySpec(KEY.getBytes(ENCODING), "AES");
			Cipher cipher = null;
			byte[] original = new byte[0];
			try {
				cipher = Cipher.getInstance(TRANSFORMATION);
				cipher.init(Cipher.DECRYPT_MODE, skeySpec, new IvParameterSpec(iv.getBytes(ENCODING)));
				original = cipher.doFinal(text);
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			return new String(original, Charset.forName(ENCODING));
		}
		catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}
