package edgexfoundry.controller;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/api/v1/profile")
public class ProfileController {
	
	private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);
	
	@Autowired
	private ResourceLoader resourceLoader;
	
	@RequestMapping(value="/downloadTempalte",method=RequestMethod.GET)
	public void downloadTemplate(HttpServletResponse response) {
		response.setContentType("application/x-yaml;charset=UTF-8");
		response.setHeader("Content-disposition", "attachment;filename=\"profileTemplate.yml\"");
		try(
				InputStream is = resourceLoader
				.getResource("classpath:/templates/profileTemplate.yml")
				.getInputStream();
				OutputStream os = response.getOutputStream();
			){
			
			IOUtils.copy(is, os);
			OutputStreamWriter opw = new OutputStreamWriter(os,"UTF-8");
			Writer w = new BufferedWriter(opw);
			w.flush();
			w.close();
		} catch (IOException e) {
			logger.error("Unable to read file resource.");
			e.printStackTrace();
		}
	}
}
