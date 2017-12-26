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
	//动态获取菜单数据
	$.ajax({
		url:"/menu.json",
		type:"GET",
		success:function(data){
			var menu = eval(data);
			menuRender(menu);
		}
	}); 	
});

//动态渲染侧边栏菜单
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
	//绑定菜单点击事件
	$(".sidebar li").on('click',function(event){
		event.stopPropagation();//阻止点击子节点触发父节点的事件传播
		//如果当前节点非叶子节点，展开当前节点
		if($(this).find("li").length != 0){
			//展开下拉菜单时切换图标
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
		//如果当前节点是叶子节点，加载资源
		$(".center").load($(this).attr("url"));
	});
}