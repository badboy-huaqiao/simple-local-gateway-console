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
	deviceModule.loadDeviceData();
	deviceModule.loadServiceSelectData();
	deviceModule.loadProfileSelectData();
});

var deviceModule = {
		deviceDataCache:[],
		loadDeviceData:function(){
			$.ajax({
				url:'/core-metadata/api/v1/device',
				type:'GET',
				success:function(data){
					if(data && data.length != 0){
						
						deviceModule.renderDeviceGirdList(data);
					}
				},
				error:function(){
					
				}
			});
		},
		renderDeviceGirdList:function(data){
			deviceModule.deviceDataCache = data;
			$("#device_list table tbody").empty();
			$.each(data,function(index,ele){
				var rowData = "<tr>";
				rowData += '<td><input type="radio" name="blankRadio" value="'+ele.id+'"></td>';
				rowData += "<td>" + (index + 1) +"</td>";
				rowData += "<td>" +  ele.id.substr(0,8) + "</td>";
				rowData += "<td>" +  ele.name + "</td>";
				rowData += "<td>" +  ele.description + "</td>";
				rowData += "<td>" +  ele.labels[0] + "</td>";
				rowData += "<td>" +  ele.addressable.address + "</td>";
				rowData += "<td>" +  ele.adminState + "</td>";
				rowData += "<td>" +  ele.operatingState + "</td>";
				rowData += "<td>" +  ele.service.name + "</td>";
				rowData += "<td>" +  ele.profile.name + "</td>";
				rowData += "<td>" +  ele.created + "</td>";
				rowData += "<td>" +  ele.modified + "</td>";
				rowData += "</tr>";
				$("#device_list table tbody").append(rowData);
			});
			$("#device_list table tfoot").hide();
		},
		loadServiceSelectData:function(){
			$.ajax({
				url:'/core-metadata/api/v1/deviceservice',
				type:'GET',
				success:function(data){
					$("#device_advanced_search select[name='device_service']").empty();
					var opt = '<option value="" selected>pleace select</option>';
					$("#device_advanced_search select[name='device_service']").append(opt);
					$.each(data,function(index,ele){
						var option = '<option value="' + ele.name + '">' + ele.name + '</option>';
						$("#device_advanced_search select[name='device_service']").append(option);
					});
					//bind onchange event.
					$("#device_advanced_search select[name='device_service']").on('change',function(){
						var v = $(this).val();
						if(v != '') {
							$.ajax({
								url:'/core-metadata/api/v1/device/servicename/' + v + '',
								type:'GET',
								success:function(data){
									deviceModule.renderDeviceGirdList(data);
								}
							});
						}
					});
				}
			});
		},
		loadProfileSelectData:function(){
			$.ajax({
				url:'/core-metadata/api/v1/deviceprofile',
				type:'GET',
				success:function(data){
					$("#device_advanced_search select[name='device_profile']").empty();
					var opt = '<option selected value="">pleace select</option>';
					$("#device_advanced_search select[name='device_profile']").append(opt);
					$.each(data,function(index,ele){
						var option = '<option value="' + ele.name + '">' + ele.name + '</option>';
						$("#device_advanced_search select[name='device_profile']").append(option);
					});
					//bind onchange event.
					$("#device_advanced_search select[name='device_profile']").on('change',function(){
						var v = $(this).val();
						if(v != ''){
							$.ajax({
								url:'/core-metadata/api/v1/device/profilename/' + v + '',
								type:'GET',
								success:function(data){
									deviceModule.renderDeviceGirdList(data);
								}
							});
						}
					});
				}
			});
		}
}

var deviceModuleBtnGroup = {
		
}