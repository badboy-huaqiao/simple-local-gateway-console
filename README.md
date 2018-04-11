Main Author: Zhang Huaqiao
Copyright © 2017-2018 VMware, Inc. All Rights Reserved.

# simple-local-gateway-console
EdgeX Foundry local gateway devices management platform


## why need simple-local-gateway-console

1.  After the user runs the EdgeX Foundry,they often do not know what to do next,the console will help users to quickly use and understand EdgeX Foundry.
2. For developers to test, they don't have to assemble complex JSON data in order to add a device,etc.


## developer IDE:

spring tool suite(STS)
[](https://spring.io/tools "spring tool suite") 

## program language and third-party framework:

*   javascript
*   css
*   html
*   jquery
*   bootstrap
*   awesome font lib
*   Echarts

## CORS proxy:

> use netflix zuul proxy technology


## config proxy to edgexfoundry microservice to solve CORS

	zuul.routes.core-command.path=/core-command/**
	#there will be dynamic revserse proxy,don't hard-code config there if you want to manage multi-gateway
	#zuul.routes.core-command.url=http://10.117.170.136:48082/

	zuul.routes.core-metadata.path=/core-metadata/**
	zuul.routes.core-data.path=/core-data/**
	zuul.routes.core-export.path=/core-export/**
	zuul.routes.rule-engine.path=/rule-engine/**

## how to start:

*   copy the docker-files folder to your host.
*   the administrator account is admin/admin,you can custom account in application.properties file before you start the app.

Under the docker-files folder,execute the following command:

	java -jar -Dspring.config.location=./application.properties simple-edgex-foundry-console.jar &

	
then enter the http://your_host:4000 in the browser

or you can  pull the whole project to your Eclipse IDE(Recommend STS IDE).


## there is a video demo will be useful for beginner

https://www.youtube.com/watch?v=2EOHR_gUeic&feature=youtu.be

## Completed functions

1.  the CRUD of Device,Device Service,Device Profile,Export Register,Rule Engine.
2.  Gateway(multi-instances)management sharing one web UI.
3.  Gateway instance CRUD with h2-database(a memory DB,will be placed with persistence DB further.)
4.  user login auth.
5.  user choose one gateway instance before operating other function module.
6.  all data from EdgeX Foundry can be showed in json formatter,which will be useful for developer.
7.  Export Registration data can be previewed.

![altText](https://raw.githubusercontent.com/badboy-huaqiao/simple-local-gateway-console/master/image/device.png)  
![altText](https://raw.githubusercontent.com/badboy-huaqiao/simple-local-gateway-console/master/image/export_data_show.png) 

## the further 

1.  Will be supported to run in docker
2.  Google Map Location to manage multi-gateway instance.
3.  camera device Living Stream Rendering on web console.
4.  Gradually improve other functions






