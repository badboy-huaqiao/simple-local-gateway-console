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
	$("#export_register_data").hide();
	$("#add_new_export").hide();
	coreExportModule.loadExportData();
	coreExportModule.exportChart = echarts.init($('#export_data_charts')[0],'wonderland');//macarons
    var option = {
    	    title : {
    	        text: 'Export Data',
    	        subtext: 'total'
    	    },
    	    tooltip : {
    	        trigger: 'axis'
    	    },
    	    legend: {
    	        data:['KMC.BAC-121036CE01','GS1-AC-Drive01']
    	    },
    	    toolbox: {
    	        show : true,
    	        feature : {
    	            mark : {show: true},
    	            dataView : {show: true, readOnly: false},
    	            magicType : {show: true, type: ['line', 'bar']},
    	            restore : {show: true},
    	            saveAsImage : {show: true}
    	        }
    	    },
    	    calculable : true,
    	    xAxis : [
    	        {
    	            type : 'category',
    	            data : ['Temperature','Humidity','OutputVoltage','RPM']
    	        }
    	    ],
    	    yAxis : [
    	        {
    	            type : 'value',
    	            splitNumber: 6,
    	            max: 300,
    	            min: -100
    	        }
    	    ],
    	    series : [
    	        {
    	            name:'KMC.BAC-121036CE01',
    	            type:'bar',
    	            data:[0,0,0,0]
    	        },
    	        {
    	            name:'GS1-AC-Drive01',
    	            type:'bar',
    	            data:[0,0,0,0]
    	        }
    	    ]
    	};
    coreExportModule.exportChart.setOption(option);
    $("#export_data_charts").hide();
    document.addEventListener('click',function(event){
    		$("#export_register_json_format").hide('fast');
    });
    document.addEventListener('click',function(event){
    		event.stopPropagation();
    });
});

var coreExportModule = {
		exportChart:{},
		exportDataCache:[],
		selectedRow:{},
		loadExportData:function(){
//			coreExportModule.exportDataCache = testExportData;
//			coreExportModule.renderExportGridList(testExportData);
			$.ajax({
				url:'/core-export/api/v1/registration',
				type:'GET',
				success:function(data){
					coreExportModule.exportDataCache = data;
					coreExportModule.renderExportGridList(data);
				}
			});
		},
		renderExportGridList:function(data){
			$("#export_list > table tbody").empty();
			$.each(data,function(i,e){
				var rowData = "<tr>";
				rowData += '<td><input type="radio" name="exportRadio" value="'+e.id+'"></td>';
				rowData += "<td>" + (i + 1) +"</td>";
				rowData += "<td>" +  e.id.substr(0,8) + "</td>";
				rowData += "<td>" +  e.name + "</td>";
				rowData += "<td>" +  e.destination + "</td>";
				if(e.enable){
					rowData += '<td value=' + e.id + ' enable="true">' + '<i class="fa fa-unlock fa-lg" aria-hidden="true"></i> ' + '</td>';
				}else{
					rowData += '<td value=' + e.id + ' enable="false">' + '<i class="fa fa-lock fa-lg" aria-hidden="true"></i> ' + '</td>';
				}
				rowData += "<td>" +  dateToString(e.created) + "</td>";
				rowData += "<td>" +  dateToString(e.modified) + "</td>";
				rowData += "</tr>";
				$("#export_list > table tbody").append(rowData);
			});
			$("#export_list table tbody input:radio").on('click',function(){
				if($(this).prop("checked")){
					var checked_input = this;
					$.each(coreExportModule.exportDataCache,function(index,ele){
						if(ele.id == $(checked_input).val()){
							coreExportModule.selectedRow = Object.assign({},ele);
							return false;
						}
					}); 
				}
			});
			$("#export_list table tbody i").parent().on('click',function(){
				var radios = $("#export_list > table > tbody input:radio");
				var td = this;
				$.each(radios,function(i,e){
					if($(e).prop('value') == $(td).attr('value')){
						$(e).prop('checked',true);
					}
				});
				
				$.each(coreExportModule.exportDataCache,function(index,ele){
					if(ele.id == $(td).attr("value")){
						coreExportModule.selectedRow = Object.assign({},ele);
						return false;
					}
				}); 
				$(td).children('i').toggleClass(function(){
					if($(td).attr("enable") == "false"){
						coreExportBtnGroup.isEnableExport(true);
						$("#export_register_data").show();
						$("#export_data_charts").show();
						$("#websocket_msg_content table tbody").empty();
						$(this).removeClass();
						$(td).attr("enable","true") ;
						coreExportModule.webSocketMsg();
						return 'fa fa-unlock fa-lg';	
					}else{
						coreExportBtnGroup.isEnableExport(false);
						$(this).removeClass();
						$(td).attr("enable","false");
						coreExportModule.disconnWebsocket();
						return 'fa fa-lock fa-lg';	
					}
				});
				//$("#export_list table tbody input:radio").prop('checked',true);
			});
			if(data.length != 0){
				$("#export_list table tfoot").hide();
			}	
		},
		webSocket:null,
		webSocketMsg:function(){
			if(coreExportModule.webSocket == null || coreExportModule.webSocket.readyState == "CLOSED"){
				if ('WebSocket' in window) {
					coreExportModule.webSocket = new WebSocket("ws://localhost:4000");
			    } else {
			        alert("your browser not support WebSocket.");
			    }
			}
			coreExportModule.webSocket.onmessage = function(event){
				//console.log(event.data);
				 $("#websocket_msg_content table tbody").append('<tr><td>' + event.data + '</td></tr>');
				 var div = $("#websocket_msg_content")[0];
				 div.scrollTop = div.scrollHeight;
				 $("#websocket_msg_content table tbody tr:odd").css({color:'#7CFC00'});
				 var d = JSON.parse(event.data);
				 var dataMapping = {'AnalogValue_40':"temperature",'AnalogValue_22':"humidity",
						 'HoldingRegister_8455':"OutputVoltage",'HoldingRegister_8454':'RPM'} 
				 var echartOpts = coreExportModule.exportChart.getOption();
				 if(d.device == "KMC.BAC-121036CE01"){
					 if(d.readings[0].name == 'AnalogValue_40'){
						 echartOpts.series[0].data.splice(0,1,d.readings[0].value);
					 }else if(d.readings[0].name == 'AnalogValue_22'){
						 echartOpts.series[0].data.splice(1,1,d.readings[0].value);
					 }
					 coreExportModule.exportChart.setOption(echartOpts);
				 } 
				 if(d.device == 'GS1-AC-Drive01'){
					 if(d.readings[0].name == 'HoldingRegister_8455'){
						 echartOpts.series[1].data.splice(2,1,d.readings[0].value);
					 }else if(d.readings[0].name == 'HoldingRegister_8454'){
						 echartOpts.series[1].data.splice(3,1,d.readings[0].value);
					 }
					 
					 coreExportModule.exportChart.setOption(echartOpts);
				 }
			}	
		},
		disconnWebsocket:function(){
			//coreExportModule.webSocket.close();
		},
		echartShow:function(data){
			
		}
}
var coreExportBtnGroup = {
		add:function(){
			$("#export_list").hide();
			$("#add_new_export").show();
			$("#add_new_export > button[name='submit']").show();
			$("#add_new_export > button[name='update']").hide();
			var form = $("#add_new_export").children("form")[0];
			form.reset();
		},
		deleteExport:function(confirm){
			$('#deleteConfirmDialog').modal('show');
			if(confirm){
				$('#deleteConfirmDialog').modal('hide');
				return;
			}
		},
		detail:function(){
			var form = $("#add_new_export").children("form")[0];
			form.reset();
			console.dir(coreExportModule.selectedRow);
			$("#export_list").hide();
			$("#add_new_export input[name='id']").val(coreExportModule.selectedRow.id);
			$("#add_new_export input[name='name']").val(coreExportModule.selectedRow.name);
			$("#add_new_export select[name='destination']").val(coreExportModule.selectedRow.destination);
			$("#add_new_export select[name='compression']").val(coreExportModule.selectedRow.compression);
			$("#add_new_export select[name='format']").val(coreExportModule.selectedRow.format);
			$("#add_new_export input[name='enable']").prop("checked",coreExportModule.selectedRow.enable);
			$("#add_new_export input[name='addressName']").val(coreExportModule.selectedRow.addressable.name);
			$("#add_new_export input[name='address']").val(coreExportModule.selectedRow.addressable.address);
			$("#add_new_export input[name='port']").val(coreExportModule.selectedRow.addressable.port);
			$("#add_new_export input[name='path']").val(coreExportModule.selectedRow.addressable.path);
			$("#add_new_export input[name='publisher']").val(coreExportModule.selectedRow.addressable.publisher);
			$("#add_new_export input[name='user']").val(coreExportModule.selectedRow.addressable.user);
			$("#add_new_export input[name='password']").val(coreExportModule.selectedRow.addressable.password);
			$("#add_new_export input[name='topic']").val(coreExportModule.selectedRow.addressable.topic);
//			$("#add_new_export input[name='key']").val(coreExportModule.selectedRow.id);
//			$("#add_new_export input[name='id']").val(coreExportModule.selectedRow.id);
			if(coreExportModule.selectedRow.filter != null){
				$("#add_new_export input[name='valueDescriptor']").val(coreExportModule.selectedRow.filter.valueDescriptorIdentifiers[0]);
				$("#add_new_export input[name='deviceName']").val(coreExportModule.selectedRow.filter.deviceIdentifiers[0]);
			}
			$("#add_new_export > button[name='submit']").hide();
			$("#add_new_export > button[name='update']").show();
			$("#add_new_export").show();
		},
		back:function(){
			$("#add_new_export").hide();
			$("#export_list").show();
		},
		submit:function(){
			$("#core_export_shelter").show();
			var exportRegister = {};
			var exportAddr = {};
			//exportRegister['id'] = $("#add_new_export input[name='id']").val();
			exportRegister['name'] = $("#add_new_export input[name='name']").val();
			exportRegister['destination'] = $("#add_new_export input[name='destination']").val();
			exportRegister['compression'] = $("#add_new_export input[name='compression']").val();
			exportRegister['format'] = $("#add_new_export input[name='format']").val();
			exportRegister['enable'] = $("#add_new_export input[name='enable']").prop("checked");
			
			exportAddr['name'] = $("#add_new_export input[name='addressName']").val();
			exportAddr['address'] = $("#add_new_export input[name='address']").val();
			exportAddr['port'] = $("#add_new_export input[name='port']").val();
			exportAddr['path'] = $("#add_new_export input[name='path']").val();
			exportAddr['publisher'] = $("#add_new_export input[name='publisher']").val();
			exportAddr['user'] = $("#add_new_export input[name='user']").val();
			exportAddr['password'] = $("#add_new_export input[name='password']").val();
			exportAddr['topic'] = $("#add_new_export input[name='topic']").val();
			exportAddr['method'] = "POST";
			exportAddr['protocol'] = "TCP";
			
			var exportFilter = {};
			exportFilter['deviceIdentifiers'] = [];
			exportFilter['valueDescriptorIdentifiers'] = [];
			if($("#add_new_export input[name='deviceName']").val() != ""){
				exportFilter['deviceIdentifiers'].push($("#add_new_export input[name='deviceName']").val());
			}
			if($("#add_new_export input[name='valueDescriptor']").val() != ""){
				exportFilter['valueDescriptorIdentifiers'].push($("#add_new_export input[name='valueDescriptor']").val());
			}

			exportRegister['addressable'] = exportAddr;	
			exportRegister['filter'] = exportFilter;
			$.ajax({
				url:'/core-export/api/v1/registration',
				type:'POST',
				data:JSON.stringify(exportRegister),
				contentType:'application/json',
				success:function(){
					$("div.core_export_shelter").hide('fast');
					$("#export_list").show();
					$("#add_new_export").hide();
					coreExportModule.loadExportData();
				}
			});
		},
		update:function(){
			$("div.core_export_shelter").show('fast');
			var exportRegister = {};
			var exportAddr = {};
			var exportFilter = {};
			
			exportFilter['deviceIdentifiers'] = [];
			exportFilter['valueDescriptorIdentifiers'] = [];
			if($("#add_new_export input[name='deviceName']").val() != ""){
				exportFilter['deviceIdentifiers'].push($("#add_new_export input[name='deviceName']").val());
			}
			if($("#add_new_export input[name='valueDescriptor']").val() != ""){
				exportFilter['valueDescriptorIdentifiers'].push($("#add_new_export input[name='valueDescriptor']").val());
			}
			
			exportRegister['id'] = $("#add_new_export input[name='id']").val();
			exportRegister['name'] = $("#add_new_export input[name='name']").val();
			exportRegister['destination'] = $("#add_new_export select[name='destination']").val();
			exportRegister['compression'] = $("#add_new_export select[name='compression']").val();
			exportRegister['format'] = $("#add_new_export select[name='format']").val();
			exportRegister['enable'] = $("#add_new_export input[name='enable']").prop("checked");
			
			exportAddr['name'] = $("#add_new_export input[name='addressName']").val();
			exportAddr['address'] = $("#add_new_export input[name='address']").val();
			exportAddr['port'] = $("#add_new_export input[name='port']").val();
			exportAddr['path'] = $("#add_new_export input[name='path']").val();
			exportAddr['publisher'] = $("#add_new_export input[name='publisher']").val();
			exportAddr['user'] = $("#add_new_export input[name='user']").val();
			exportAddr['password'] = $("#add_new_export input[name='password']").val();
			exportAddr['topic'] = $("#add_new_export input[name='topic']").val();
			exportAddr['method'] = "POST";
			exportAddr['protocol'] = "TCP";
			exportRegister['addressable'] = exportAddr;	
			exportRegister['filter'] = exportFilter;
			console.dir(exportRegister);
			$.ajax({
				url:'/core-export/api/v1/registration',
				type:'PUT',
				data:JSON.stringify(exportRegister),
				contentType:'application/json',
				success:function(){
					window.setTimeout(function(){
						$("div.core_export_shelter").hide('fast');
						coreExportModule.loadExportData();
						$("#export_list").show();
						$("#add_new_export").hide();
					},1000);
				}
			});
		},
		isEnableExport:function(enable){
			coreExportModule.selectedRow.enable =  enable;
			$.ajax({
				url:'/core-export/api/v1/registration',
				type:'PUT',
				data:JSON.stringify(coreExportModule.selectedRow),
				contentType:'application/json',
				success:function(){
					
				}
			});
		},
		hideWebsocketContent:function(){
			$("#export_register_data").hide();
			$("#export_data_charts").hide();
		},
		showJsonFormatter:function(event){
			event.stopPropagation();
			$("#export_register_json_format").empty();
			$("#export_register_json_format").append("<pre>" + JSON.stringify(coreExportModule.selectedRow,null,3) + "</pre>");
			$("#export_register_json_format").toggle();
		}
}


var testExportData = [
    {
        "id": "5aa89209e4b01d97205d7f4c",
        "created": 1520996873655,
        "modified": 1520996873655,
        "origin": 0,
        "name": "EdgeXRulesEngine",
        "addressable": {
            "id": null,
            "created": 0,
            "modified": 0,
            "origin": 0,
            "name": "EdgeXRulesEngineAddressable",
            "method": "POST",
            "protocol": "ZMQ",
            "address": "",
            "port": 0,
            "path": "",
            "publisher": null,
            "user": null,
            "password": null,
            "topic": null,
            "url": "ZMQ://:0",
            "baseURL": "ZMQ://:0"
        },
        "format": "SERIALIZED",
        "filter": null,
        "encryption": null,
        "compression": "NONE",
        "enable": true,
        "destination": "ZMQ_TOPIC"
    }
]