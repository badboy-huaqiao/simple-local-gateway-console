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

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import edgexfoundry.config.ZuulDynamicProxyConfig;
import edgexfoundry.domain.GatewayInfo;

@Controller
public class DynamicProxyController {

		@RequestMapping(value="/proxy/host",method=RequestMethod.POST)
		@ResponseBody
		public String dynamicConfigProxy(@RequestBody Map<String,String> originHostIP,HttpServletRequest req) {
			synchronized (ZuulDynamicProxyConfig.class) {
				ZuulDynamicProxyConfig.getProxymapping().put(req.getSession().getId(), originHostIP.get("hostIP"));
			}
			return "success";
		}
		
		@RequestMapping(value="/gateway",method=RequestMethod.POST)
		@ResponseBody
		public String save(@RequestBody GatewayInfo gatewayInfo) {
			
			return "success";
		}
	
}
