package edgexfoundry.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import edgexfoundry.domain.User;

@Controller
public class LoginController {
	
	@RequestMapping(value="/loginVerify",method=RequestMethod.POST)
	@ResponseBody
	public void login(@RequestBody User user,HttpServletRequest req,HttpServletResponse resp) throws Exception{
		System.out.println(user.getUserPwd());
		if(user.getUserName().equals("root") || user.getUserPwd().equals("root")) {
			req.getSession().setAttribute("userId", user.getUserId());
			req.getSession().setAttribute("userPwd", user.getUserPwd());
		}
		//resp.sendRedirect("http://localhost:4000");
		return ;
	}
	
	@RequestMapping(value="/logout",method=RequestMethod.GET)
	@ResponseBody
	public void logout(HttpServletRequest req,HttpServletResponse resp) throws Exception{
		HttpSession session = req.getSession();
		session.invalidate();
		//resp.sendRedirect("http://localhost:4000");
		return ;
	}
}
