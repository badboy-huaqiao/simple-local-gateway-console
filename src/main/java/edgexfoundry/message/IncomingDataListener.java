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

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class IncomingDataListener implements MqttCallback {

	private static final Logger logger = LoggerFactory.getLogger(WebSocketServer.class);
	
	private MqttClient client;
	
	private String protocol = "tcp";
	private String brokerHost = "10.112.122.28";
	private String port = "1883";
	private String topic = "test-register-01";
	private String user = "huaqiao_zhang";
	private String password = "1234";
	private String clientId = "incomingDataSubscriber";
	private int qos = 0;
	private int keepAlive = 3600; //one hour.
	
	@PostConstruct
	public void init() {
		startListening();
	}
	
	private void startListening() {
		String url = protocol + "://" + brokerHost + ":" + port;
		try {
			client = new MqttClient(url, clientId);
			MqttConnectOptions connOpts = new MqttConnectOptions();
			connOpts.setUserName(user);
			connOpts.setPassword(password.toCharArray());
			connOpts.setCleanSession(true);
			connOpts.setKeepAliveInterval(keepAlive);
			client.connect(connOpts);
			client.setCallback(this);
			client.subscribe(topic, qos);
		} catch (MqttException e) {
			e.printStackTrace();
			client = null;
		}
	}
	
	@PreDestroy
	public void cleanup() throws MqttException {
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
		try {
			client.close();
		} catch (MqttException e) {
			System.out.println("Unable to close the client.");
			e.printStackTrace();
		}
		startListening();
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken arg0) {
		System.out.println("Incoming data delivery complete.");
	}
}
