package com.supdatas.asset.frame.utility;

/**
 * Created by Administrator on 2017/10/19.
 */
import android.content.Context;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.security.MessageDigest;
import org.apache.commons.codec.digest.DigestUtils;  //commons-codec-1.10.jar

public class FileUtil {

    public static String getMD5(String fileFullPath) throws IOException {

        try {
            return DigestUtils.md5Hex(new FileInputStream(fileFullPath));
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
    }
    public static String getMd5OfFile(File file) throws FileNotFoundException {
        String value = null;
        FileInputStream in = new FileInputStream(file);
        try {
            MappedByteBuffer byteBuffer = in.getChannel().map(FileChannel.MapMode.READ_ONLY, 0, file.length());
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            md5.update(byteBuffer);
            BigInteger bi = new BigInteger(1, md5.digest());
            value = bi.toString(16);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if(null != in) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return value;
    }

    public int copyFile(String fromDir, String toDir) {

        File from = new File(fromDir);
        File to = new File(toDir);
        File[] files;
        if (!from.exists()) {
            return -1;
        }
        if (!to.exists()) {
            to.mkdirs();
        }
        files = from.listFiles();
        for (int i = 0; i < files.length; i++) {
            if (files[i].isDirectory()) {
                copyFile(files[i].getPath() + File.separator, toDir);
            } else {
                copy(files[i].getPath(), toDir + files[i].getName());
            }
        }
        return 0;
    }

    public int copy(String fromFile, String toFile) {
        try {
            InputStream is = new FileInputStream(fromFile);
            OutputStream os = new FileOutputStream(toFile);
            byte[] b = new byte[1024];
            int c;
            while ((c = is.read(b)) > 0) {
                os.write(b, 0, c);
            }
            is.close();
            os.close();
            return 0;
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return -1;
    }

    private static void CopyAssetsFile(Context context, String destDir, String assetsFileName) {
        try
        {
            //先判断目录文件是否存在，存在则不要拷贝
            String filePath = destDir + assetsFileName;//数据库路径
            File dbFile = new File(filePath);
            if(dbFile.exists())
                return; //文件已存在则退出

            InputStream myInput;
            FileOutputStream myOutput = new FileOutputStream(new File(filePath));
            myInput = context.getAssets().open(assetsFileName);
            byte[] buffer = new byte[1024];
            int length = myInput.read(buffer);
            while(length > 0)
            {
                myOutput.write(buffer, 0, length);
                length = myInput.read(buffer);
            }

            myOutput.flush();
            myInput.close();
            myOutput.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
