package com.supdatas.asset.frame.utility.clientConfig;

import com.supdatas.asset.frame.utility.SysDirs;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import java.io.FileInputStream;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;


public class SocketCfg {
	
	private SocketCfg()
	{
	    Read();
	}
	
	private String _cfgPath = SysDirs.instance().getConfigClientSKPathFile();
	
	public void Read()
	{
		try{
    		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			String filePath = _cfgPath;   								//ceclient.cfg
			Document docu = db.parse(new FileInputStream(filePath));
			//Document docu = db.parse(new InputSource(new ByteArrayInputStream(xmlData.getBytes("utf-8"))));
			
			NodeList nl = docu.getElementsByTagName("add");
			Node node = null;
			for (int i = 0; i < nl.getLength(); ++i)
			{
				node = (Node)nl.item(0);
				NamedNodeMap node_att = node.getAttributes();		//
				for(int j = 0;j < node_att.getLength(); j++){
	           		Node node2 = node_att.item(j);
	           		if (node2.getNodeName().equals("FullLog"))
	           			this.fullLog = node2.getNodeValue().equals("true") ? true : false;
	           		else if (node2.getNodeName().equals("SKSendTimeout"))
	           			this.SKSendTimeout = Integer.parseInt(node2.getNodeValue());
	           		else if (node2.getNodeName().equals("SKRevTimeout"))
	           			this.SKRevTimeout = Integer.parseInt(node2.getNodeValue());
	           		else if (node2.getNodeName().equals("OnceSendTimeout"))
	           			this.OnceSendTimeout = Integer.parseInt(node2.getNodeValue());
	           		else if (node2.getNodeName().equals("OnceRevTimeout"))
	           			this.OnceRevTimeout = Integer.parseInt(node2.getNodeValue());
	           		
	           		System.out.print(node2.getNodeName()+":" + node2.getNodeValue()+" ");
	           	}
			}
    	} 
    	catch (ParserConfigurationException e) 
    	{
			e.printStackTrace();
		} catch (SAXException e) 
    	{
			e.printStackTrace();
		} catch (IOException e) 
    	{
			e.printStackTrace();
		}
    	catch(Exception e4)
    	{
    		e4.printStackTrace();
    	}
	}
	private static SocketCfg _instance = new SocketCfg();
	public static SocketCfg instance()
	{
		if (_instance == null)
        {
            _instance = new SocketCfg();
        }
		return _instance;
	}
	
	/// <summary>
	/// 是否写当前系统数据日志
	/// </summary>
	public boolean fullLog;

	/// <summary>
	///  Ms，发送超时
	/// </summary>
	public int SKSendTimeout;

	/// <summary>
	/// Ms，接收超时
	/// </summary>
	public int SKRevTimeout;

	/// <summary>
	/// 一次发送，如果超过该时间未发送成功，则按超时处理
	/// </summary>
	public int OnceSendTimeout;

	/// <summary>
	/// 一次接收如果超进该时间无数据，则按超时处理
	/// </summary>
	public int OnceRevTimeout;
}
