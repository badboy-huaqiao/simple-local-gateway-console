package edgexfoundry.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;


public class LoginInterceptor extends HandlerInterceptorAdapter {

//	@Override
//	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object arg2, Exception arg3)
//			throws Exception {
//		// TODO Auto-generated method stub
//		
//	}
//
//	@Override
//	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object arg2, ModelAndView arg3)
//			throws Exception {
//		// TODO Auto-generated method stub
//		
//	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
		System.out.println("interceptor......");
//		HttpSession session = request.getSession(false);
//		if(session == null) {
//			response.sendRedirect("/login");
//			return false;
//		}
//		if(session != null) {
//			Object userId = session.getAttribute("userId");
//			if(userId == null) {
//				response.sendRedirect("/login");
//				return false;
//			}
//			return true;
//		}
		return true;
	}

}
