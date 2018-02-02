package edgexfoundry.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Configuration;

@WebFilter(urlPatterns="/**")
@Configuration
public class authFilter implements Filter{

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest)request;
		HttpServletResponse resp = (HttpServletResponse)response;
		String reqPath = req.getRequestURI();
		//permit any path of static resource request to pass.
		if(	reqPath.endsWith(".css") 
				|| reqPath.endsWith(".js")
				|| reqPath.endsWith(".html")
				|| reqPath.contains("loginVerify")
				|| reqPath.equals("/login")) {
				chain.doFilter(request, response);
				return;
		}
        HttpSession session = req.getSession(false); 
        //no session or no user info in session will be prevented.
        if (session == null || session.getAttribute("userId") == null) {  
        		//when session timeout or user logout , but user still stay in some page which can click some button,then force user to login.
        		if(req.getHeader("X-Requested-With") != null && req.getHeader("X-Requested-With").equals("XMLHttpRequest")) {
        			 //resp.setHeader("sessionstatus", "timeout");
        	         resp.setStatus(302);
        	         return;
        		}
            System.out.println("request.getContextPath()=" + req.getContextPath());  
            resp.sendRedirect("/login");  
            return;  
        } 
        //permit any path of ajax request for business data to pass.
        chain.doFilter(request, response);  
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
	}

}
