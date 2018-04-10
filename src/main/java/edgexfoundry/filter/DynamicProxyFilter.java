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
package edgexfoundry.filter;

import java.net.MalformedURLException;
import java.net.URL;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import edgexfoundry.config.ZuulDynamicProxyCache;

public class DynamicProxyFilter extends ZuulFilter {
	
	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() {
		RequestContext ctx = RequestContext.getCurrentContext();
		String sessionID = ctx.getRequest().getSession().getId();
		
		String originHostURL = "http://" + ZuulDynamicProxyCache.getProxymapping().get(sessionID);
		
		String reqPath = ctx.getRequest().getRequestURI();
		
		//there can be get Mapping from database,but now just hard-code.
		
		if(reqPath.startsWith("/core-data")) {
			originHostURL += ":48080";
		}
		
		if(reqPath.startsWith("/core-metadata")) {
			originHostURL += ":48081";
		}
		
		if(reqPath.startsWith("/core-command")) {
			originHostURL += ":48082";
		}
		
		if(reqPath.startsWith("/core-export")) {
			originHostURL += ":48071";
		}
		
		if(reqPath.startsWith("/rule-engine")) {
			originHostURL += ":48075";
		}
		
		try {
			ctx.setRouteHost(new URL(originHostURL));
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public String filterType() {
		return "pre";
	}

	@Override
	public int filterOrder() {
		//if too high , it will result to AuthFilter doChain() can not find  originHostURL .
		return 10;
	}

}
