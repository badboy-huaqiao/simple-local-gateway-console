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
package edgexfoundry.message;

import java.io.IOException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.PongMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@ServerEndpoint(value="/")
@Component
public class WebSocketServer {

	private static final Logger logger = LoggerFactory.getLogger(WebSocketServer.class);
	
	private static Queue<Session> queue = new ConcurrentLinkedQueue<>();
	
	public static void broadcast(String message) {
		message = message.replaceAll("<", "&lt;");
		message = message.replaceAll(">", "&gt;");
		message = message.replaceAll("\\s", "");
		message = message.replaceAll("\n", "");
		//logger.error("msg from mqtt: " + message);
		for(Session session : queue) {
			if(session.isOpen()) {
				try {
					session.getBasicRemote().sendText(message);
				} catch (IOException e) {
					logger.error(" send msg failed ! ");
					e.printStackTrace();
				}
			}
		}
	}
	
	@OnOpen
	public void onOpen(Session session, EndpointConfig conf) {
		/* Register this connection in the queue */
		logger.info("websocket timeout :"  + Long.toString(session.getMaxIdleTimeout()));
//		session.setMaxIdleTimeout(300000);//5 minute
		queue.add(session);
		logger.info(queue.size() + " client connected success.");
	}
	
	@OnMessage
	public void onMessage(Session session, String msg) {
		String sessionID = session.getId();
		logger.info("websocket client[ " + sessionID + " ] ping.");
		
	}
	
	@OnMessage
	public void pongMessage(Session session, PongMessage msg) {
		logger.info(msg + " from " + session.getId());
	}
	
	@OnClose
	public void onClose(Session session, CloseReason reason) {
		logger.info("one client disconnection.");
		/* Remove this connection from the queue */
	    queue.remove(session);
	}
	
	public void onError(Session session, Throwable error) {
		logger.info("Connection error. ");
		/* Remove this connection from the queue */
	    queue.remove(session);
	}
	
}
