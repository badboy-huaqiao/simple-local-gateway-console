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
package edgexfoundry.controller;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edgexfoundry.config.ExportMQListenerCache;
import edgexfoundry.domain.Address;
import edgexfoundry.message.MQListener;

@RestController
@RequestMapping("/api/v1/exportshow")
public class ExportShowController {
	
	private static final Logger logger = LoggerFactory.getLogger(ExportShowController.class);
	
	@RequestMapping(method=RequestMethod.POST)
	public void subscribe(@RequestBody Address address) {
		
		if(ExportMQListenerCache.getExportMQ().containsKey(address.getTopic() + address.getAddress())) {
			return ;
		}
		
		MQListener mqListener = new MQListener(
				address.getProtocol(),
				address.getAddress(),
				String.valueOf(address.getPort()),
				address.getUser(),
				address.getPassword(),
				address.getTopic());
		
		ExportMQListenerCache.getExportMQ().put(address.getTopic() + address.getAddress(),mqListener);
	}
	
	@RequestMapping(method=RequestMethod.PUT)
	public void update(@RequestBody Address address) {
		MQListener mqListener = ExportMQListenerCache.getExportMQ().get(address.getTopic() + address.getAddress());
		try {
			mqListener.cleanup();
		} catch (MqttException e) {
			logger.error("Unabled to cleanup MQClient. ");
			e.printStackTrace();
		}
		ExportMQListenerCache.getExportMQ().remove(address.getTopic() + address.getAddress());
		
		mqListener = new MQListener(
				address.getProtocol(),
				address.getAddress(),
				String.valueOf(address.getPort()),
				address.getUser(),
				address.getPassword(),
				address.getTopic());
		
		ExportMQListenerCache.getExportMQ().put(address.getTopic() + address.getAddress(),mqListener);
	}
}
