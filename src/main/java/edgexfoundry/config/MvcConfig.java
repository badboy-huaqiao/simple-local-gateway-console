package edgexfoundry.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
//@EnableWebMvc
public class MvcConfig extends WebMvcConfigurerAdapter {
	
		@Override
		public void addViewControllers(ViewControllerRegistry registry) {
			registry.addViewController("/").setViewName("index.html");
			//if you have declare '/login' path in Controller class,this will be invalid or conflict to Controller class.
			registry.addViewController("/loginPage").setViewName("login.html"); 
			registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
		}	
}
