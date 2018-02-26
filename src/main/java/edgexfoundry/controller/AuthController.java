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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import edgexfoundry.domain.User;

@Controller
public class AuthController {
	
	@Value(value = "${USER_NAME}")
	private String userName;
	@Value("${USER_PWD}")
	private String userPwd;
	
	@RequestMapping(value="/auth/login",method=RequestMethod.POST)
	@ResponseBody
	public void login(@RequestBody User user,HttpServletRequest req,HttpServletResponse resp) throws Exception{
		System.out.println(user.getUserPwd());
		if(user.getUserName().equals(userName) && user.getUserPwd().equals(userPwd)) {
			//should use form to login , if not the user's pwd will be in memory,it's not safe.
			//i will replace this approach of login
			req.getSession().setAttribute("user", user);
		}
		//resp.sendRedirect("http://localhost:4000");
		return ;
	}
	
	@RequestMapping(value="/auth/logout",method=RequestMethod.GET)
	@ResponseBody
	public void logout(HttpServletRequest req,HttpServletResponse resp) throws Exception{
		HttpSession session = req.getSession();
		session.invalidate();
		//resp.sendRedirect(req.getContextPath()+"/");
		return ;
	}
}
