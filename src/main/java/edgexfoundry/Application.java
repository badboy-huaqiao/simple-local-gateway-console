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
package edgexfoundry;

import javax.servlet.ServletContext;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import edgexfoundry.filter.DynamicProxyFilter;

@SpringBootApplication
@EnableZuulProxy
@ServletComponentScan
@EnableJpaAuditing
public class Application{
	
	@Bean
	public DynamicProxyFilter dynamicProxyFilter() {
		return new DynamicProxyFilter();
	}
	
	@Bean
    public ServletContextAware endpointExporterInitializer(final ApplicationContext applicationContext) {
        return new ServletContextAware() {
            @Override
            public void setServletContext(ServletContext servletContext) {
                ServerEndpointExporter exporter = new ServerEndpointExporter();
                exporter.setApplicationContext(applicationContext);
                exporter.afterPropertiesSet();
            }
        };
    }
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
