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

$(document).ready(function(){
	//global ajax setting to redirect to login when session timeout (but use stay in old page) or user logout
	//don't worry about user bypass it,the back-end has set permission to pass if user logout or session timeout.
	//it just improve user experience.
	$.ajaxSetup({
		statusCode: {
			302: function() {
				window.location.href='/';
			}
		}
	});
	//get menu data dynamically.
	$.ajax({
		url:"/data/menu.json",
		type:"GET",
		success:function(data){
			var menu = eval(data);
			menuRender(menu);
		}
	}); 	
	
	//logout control
	$(".headbar li.logout").on("click",function(){
		$.ajax({
			url:'/logout',
			type:'GET',
			success:function(){
				window.location.href='/';
			}
		});
	});
	
	//user information control
	$(".headbar li.user").on("click",function(){
		$(".msgbox").load("/pages/userInfo.html")
		$(".msgbox").animate({"right":"0"},"fast");
		$(".shelter_layer").show("fast");
	});
	
	//notification control
	$(".headbar li.notification").on("click",function(){
		$(".msgbox").load("/pages/notification.html")
		$(".msgbox").animate({"right":"0"},"fast");
		$(".shelter_layer").show("fast");
	});
	
	//globe shelter control
	$(".shelter_layer").on("click",function(){
		$(".shelter_layer").hide("fast");
		$(".msgbox").animate({"right":"-400px"},"fast");
	});
	
	//render side_bar menu dynamically when load index page.
	function menuRender(data){
		for(var i=0; i<data.length;i++){
			var menu = data[i];
			var subMenu = menu.children;
			var str = '<li url="' + menu.url + '"><i class="fa fa-caret-right" style="visibility:hidden"></i><i class="'+menu.icon+'"></i><span>'+menu.title+'</span></li>';
			if( subMenu != null && subMenu.length != 0 ){
				str = '<li><i class="fa fa-caret-right"></i><i class="' + menu.icon + '"></i><span>'+menu.title+'</span><div style="display:none"><ul></ul></div></li>';
				$(".sidebar ul:first").append(str);
				for(var j = 0; j < subMenu.length; j++){
					$(".sidebar ul:first > li:last ul").append('<li url="' + subMenu[j].url + '"><i class="'+subMenu[j].icon+'"></i><span>'+subMenu[j].title+'<span></li>');
				}
				continue;
			}
			$(".sidebar ul:first").append(str);
		}
		//bind menu event of click
		$(".sidebar li").on('click',function(event){
			event.stopPropagation();//prevent event propagate to parent node when click on current node
			//if not leaf node,expand current node.
			if($(this).find("li").length != 0){
				//toggle menu icon when expand current node.
				$(this).find("i:first").toggleClass(function() {
					if ($(this).hasClass("fa fa-caret-right")) {
						$(this).removeClass();
						return 'fa fa-caret-down';
					} else {
						$(this).removeClass();
						return 'fa fa-caret-right';
					}
				});
				$(this).children("div").slideToggle("normal");
				return;
			}
			//if current node is leaf node，load html resource.
			$(".center").load($(this).attr("url"));
		});
	}
});

