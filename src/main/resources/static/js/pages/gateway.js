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
	gatewayManagementModule.loadGatewayList();
});

var gatewayManagementModule = {
	selectedRow:{},
	gatewayDataCache:[],
	loadGatewayList:function(){
		gatewayManagementModule.renderGatewayList(gatewayListDataTest);
		gatewayManagementModule.gatewayDataCache = gatewayListDataTest;
		gatewayManagementModule.selectedRow = Object.assign({},gatewayListDataTest[0]);
//		$.ajax({
//			url: '/core-gateway/api/v1/gateway',
//			type: 'GET',
//			success: function(data){
//				$("#gateway_list > table > tbody").empty();
//				gatewayManagementModule.renderGatewayList(data);
//				$("#gateway_list > table > tfoot").hide();
//				gatewayManagementModule.gatewayDataCache = data;
//				gatewayManagementModule.selectedRow = Object.assign({},data[0]);
//			},
//			error: function(){
//			}
//		});
	},
	renderGatewayList:function(data){
		$.each(data,function(index,element){
			var rowData = '<tr>';
			
			rowData += '<td><input type="radio" name="gatewayRadio" value="'+element.id+'"></td>';
			rowData += '<td>' + (index + 1) +'</td>';
			rowData += '<td>' + element.id.substr(0,8) + '</td>';
			rowData += '<td>' + element.name + '</td>';
			rowData += '<td>' + element.description + '</td>';
			rowData += '<td>' + element.address + '</td>';
			rowData += '<td>' + dateToString(element.created) + '</td>';
			
			rowData += "</tr>";
			$("#gateway_list > table > tbody").append(rowData);
		});
		$("#gateway_list > table input:radio").on('click',function(){
			var currentRowID =  $(this).val();
			$.each(gatewayManagementModule.gatewayDataCache,function(index,ele){
				if(ele.id == currentRowID){
					gatewayManagementModule.selectedRow = Object.assign({},ele);
				}
			});
			
			var param = {"hostIP":gatewayManagementModule.selectedRow.address}
			
			$.ajax({
				url: '/proxy/host',
				type: 'POST',
				contentType:'application/json',
				data:JSON.stringify(param),
				success:function(data){
					alert("you hava change gateway to " + gatewayManagementModule.selectedRow.name);
				}
			});
		});
	}
}

var dateToString = function (num){
	var date = new Date(num);
	var y = date.getFullYear();
	var M = date.getMonth() + 1;
	M = (M < 10) ? ('0' + M) : M ;
	var d = date.getDay();
	d = (d < 10) ? ('0' + d) : d ;
	var hh = date.getHours();
	hh = (hh < 10 )? ('0' + hh) : hh ;
	var mm = date.getMinutes();
	mm = (mm < 10 )? ('0' + mm) : mm ;
	var ss = date.getSeconds();
	ss = (ss < 10) ?('0' + ss) : ss ;
	
	var str = y + '-' + M + '-' + d + ' ' + hh + ':' + mm + ':' + ss
	return str;
}

var gatewayManagementModuleBtnGroup = {
	add:function(){
		
	},
	refresh:function(){
		
	}
}

var gatewayListDataTest = [
	{
		'id':'1234567890',
		'name':'test-gateway-01',
		'description':'this just test-01',
		'address':'10.117.170.136',
		'created':1513156359765
	},{
		'id':'0987654321',
		'name':'test-gateway-02',
		'description':'this just test-02',
		'address':'10.211.55.9',
		'created':1513156359765
	}
]