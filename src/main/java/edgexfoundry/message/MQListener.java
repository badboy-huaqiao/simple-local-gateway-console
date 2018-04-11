/*******************************************************************************
 * Copyright © 2017-2018 VMware, Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author: Huaqiao Zhang, <huaqiaoz@vmware.com>
 * @version: 0.1.0
 *******************************************************************************/
package edgexfoundry.message;

import javax.annotation.PreDestroy;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MQListener implements MqttCallback {

	private static final Logger logger = LoggerFactory.getLogger(MQListener.class);
	
	private MqttClient client;
	
	private String protocol;
	private String broker;
	private String port;
	private String topic;
	private String user;
	private String password;
	private String clientId = "MQListener";
	private int qos = 0;
	private int keepAlive = 3600; //1 hour.
	
	public MQListener(String protocol,String broker,String port,String user,String password,String topic) {
		super();
		this.protocol = protocol;
		this.broker = broker;
		this.port = port;
		this.user = user;
		this.password = password;
		this.topic = topic;
		this.startListening();
	}
	
	private void startListening() {
		//String url = protocol.toLowerCase() + "://" + broker + ":" + port;
		String url =  broker + ":" + port;
		try {
			client = new MqttClient(url, clientId + user);
			client.setCallback(this);
			MqttConnectOptions connOpts = new MqttConnectOptions();
			connOpts.setUserName(user);
			connOpts.setPassword(password.toCharArray());
			connOpts.setCleanSession(true);
			connOpts.setKeepAliveInterval(keepAlive);
			client.connect(connOpts);
			
			logger.info("Start listening topic[ " + topic + " ] from MQTT broker. ");
			client.subscribe(topic, qos);
		} catch (MqttException e) {
			logger.error("Unable to create new MqttClient. ");
			e.printStackTrace();
			client = null;
		}
	}
	
	
	@PreDestroy
	public void cleanup() throws MqttException {
		logger.info("disconnect from mqtt  before destory");
		client.disconnect();
		client.close();
	}
	
	@Override
	public void messageArrived(String topic, MqttMessage msg) throws Exception {
		logger.info("msg from export : " + new String(msg.getPayload()));
		if(this.topic.equals(topic)) {
			WebSocketServer.broadcast(new String(msg.getPayload()));
		}
	}
	
	//reconnect when disconnect.
	@Override
	public void connectionLost(Throwable arg0) {
		logger.error("disconnet to MQTT broker.");
		try {
			client.close();
		} catch (MqttException e) {
			logger.error("Unable to close the MQTT client.");
			e.printStackTrace();
		}
		logger.info("reconnet to MQTT broker.");
		startListening();
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken arg0) {
		System.out.println("Incoming data delivery complete.");
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getBroker() {
		return broker;
	}

	public void setBroker(String broker) {
		this.broker = broker;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
