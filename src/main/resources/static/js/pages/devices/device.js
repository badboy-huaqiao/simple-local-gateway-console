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
//$(window).unload(function(){ alert("device Bye now!"); });
var deviceModule = {
		deviceDataCache:[],
		selectedRow:null,
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
				rowData += '<td><input type="radio" name="deviceRadio" value="'+ele.id+'"></td>';
				rowData += "<td>" + (index + 1) +"</td>";
				rowData += "<td>" +  ele.id.substr(0,8) + "</td>";
				rowData += "<td>" +  ele.name + "</td>";
				rowData += "<td>" +  ele.description + "</td>";
				rowData += "<td>" +  ele.labels[0] + "</td>";
//				rowData += "<td>" +  ele.addressable.address + "</td>";
				rowData += "<td>" +  ele.adminState + "</td>";
				rowData += "<td>" +  ele.operatingState + "</td>";
//				rowData += "<td>" +  ele.service.name + "</td>";
//				rowData += "<td>" +  ele.profile.name + "</td>";
				rowData += "<td>" +  ele.created + "</td>";
				rowData += "<td>" +  ele.modified + "</td>";
				rowData += "</tr>";
				$("#device_list table tbody").append(rowData);
			});
			$("#device_list table tbody input:radio").on('click',function(){
				var checked = $(this).prop("checked");
				if(checked){
					var deviceId = $(this).val();
					$.each(deviceModule.deviceDataCache,function(index,ele){
						if(ele.id == deviceId){
							deviceModule.selectedRow = ele;
						}
					});
				}
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
						debugger
						if(v != '') {
							$.ajax({
								url:'/core-metadata/api/v1/device/servicename/' + v + '',
								type:'GET',
								success:function(data){
									deviceModule.renderDeviceGirdList(data);
									if(data.length == 0){
										$("#device_list table tfoot").show()
									}
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
									if(data.length == 0){
										$("#device_list table tfoot").show()
									}
								}
							});
						}
					});
				}
			});
		}
}

var deviceModuleBtnGroup = {
		back:function(){
			$("#device_detail").hide("fast");
			$("#device_main").show("fast");
		},
		deleteDevice:function(){
			
		},
		detail:function(){
			if(!deviceModule.selectedRow){
				alert("please select desired item.");
				return;
			}
			$("#device_detail input[name='id']").val(deviceModule.selectedRow.id);
			$("#device_detail input[name='name']").val(deviceModule.selectedRow.name);
			$("#device_detail input[name='description']").val(deviceModule.selectedRow.description);
			$("#device_detail input[name='address']").val(deviceModule.selectedRow.addressable.address);
			$("#device_detail input[name='profile_name']").val(deviceModule.selectedRow.profile.name);
			$("#device_detail input[name='service_name']").val(deviceModule.selectedRow.service.name);
			
			$.ajax({
				url:'/core-command/api/v1/device/'+deviceModule.selectedRow.id+'',
				type:'GET',
				success:function(data){
					var commands = data.commands;
					$.each(commands,function(index,ele){
						var rowData = '<tr>';
						rowData += '<td>' + ele.name + '</td>';
						
						rowData += '<td>' + '<input type="radio" name="commandRadio_'+ele.id+'" checked value="get" style="width:20px">&nbsp;get' 
										+ '&nbsp<input type="radio" name="commandRadio_'+ele.id+'" value="set"  style="width:20px">&nbsp;set' 
										+ '</td>';
						
						rowData += '<td>' + '<input type="text" name="reading_value'+ele.id+'" disabled style="width:100px;">' + '</td>'
						
						rowData += '<td>';
						if(ele.put != null) {
							$.each(ele.put.parameterNames,function(i,el){ 
								rowData += el + '&nbsp<input type="text" name="' + el + '" style="width:80px;">'
							});
						}
						rowData += '</td>';
						rowData += '<td>' 
							+ '<button id=\''+ele.id+'\' type=\'button\' class=\'btn btn-success\'  onclick=\'deviceModuleBtnGroup.sendCommand('+JSON.stringify(ele)+')\'>send</button>' 
							+ '</td>';
						
						rowData += '</tr>';
						$("#device_detail #command_list table tbody").append(rowData);
					});
					$("#device_main").hide("fast");
					$("#device_detail").show("fast");
				}
			});	
		},
		sendCommand: function(command){
			$('#'+command.id+'').prop('disabled',true);
			var method = $('#device_detail #command_list tbody input[name="commandRadio_'+command.id+'"]:radio:checked').val();
			if(method == 'set' && command.put != null) {
				var cmdUrl = command.put.url;
				cmdUrl = cmdUrl.replace(/http:\/\/[\w(?=.)]+:[0-9]+/g,"/core-command");
				var paramBody={};
				$.each(command.put.parameterNames,function(i,param){
					var p = $('#device_detail #command_list table tbody input[name="'+param+'"]').val();
					paramBody[param] = p;
				});
				$.ajax({
					url:cmdUrl,
					type:'PUT',
					contentType:'application/json',
					data:JSON.stringify(paramBody),
					success:function(data){
						$('#device_detail #command_list tbody input[name="reading_value'+command.id+'"]').val("success");
						$('#'+command.id+'').prop('disabled',false);
					},
					error:function(){
						$('#device_detail #command_list tbody input[name="reading_value'+command.id+'"]').val("failed");
						$('#'+command.id+'').prop('disabled',false);
					}
				});
			} else {
				var cmdUrl = command.get.url;
				cmdUrl = cmdUrl.replace(/http:\/\/[\w(?=.)]+:[0-9]+/g,"/core-command");
				$.ajax({
					url:cmdUrl,
					type:'GET',
					success:function(data){
						$('#device_detail #command_list tbody input[name="reading_value'+command.id+'"]').val(data);	
						$('#'+command.id+'').prop('disabled',false);
					},
					error:function(){
						$('#device_detail #command_list tbody input[name="reading_value'+command.id+'"]').val("failed");
						$('#'+command.id+'').prop('disabled',false);
					}
				});
			
			}
		},
}