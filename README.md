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
find application.properties file , and modify the host_ip of yours

	zuul.routes.core-command.path=/core-command/**
	
	#there will be dynamic revserse proxy,don't hard-code config if you want to manage multi-gateway
	zuul.routes.core-command.url=http://edgex_foundry_host:48082/
	
	zuul.routes.core-metadata.path=/core-metadata/**
	
	#there will be dynamic revserse proxy,don't hard-code config if you want to manage multi-gateway
	zuul.routes.core-metadata.url=http://edgex_foundry_host:48081/


## how to start:

*   copy the docker-files folder to your host.
*   Modify the proxy path IP in the application.properties file,IP that points to the EdgeX Foundry host.
*   the administrator account is admin/admin,you can custom account in application.properties file before you start the app.

Under the docker-files folder,execute the following command:

	java -jar -Dspring.config.location=./application.properties simple-local-gateway-console.jar &

	
then enter the http://your_host:4000 in the browser

or you can  pull the whole project to your Eclipse IDE(Recommend STS IDE).


## Completed functions

1.  the CRUD of Device,Device Service,Device Profile,Export Register,Rule Engine.
2.  Gateway(multi-instances)management sharing one web UI.
3.  user login auth.
4.  gateway instance CRUD with h2-database(a memory DB,will be placed with persistence DB further.)
5.  force user to choose one gateway instance before operating other function module.
6.  all data from EdgeX Foundry can be showed in json formatter,which will be used to developer.

## the further 

1.  Will be supported to run in docker
2.  Google Map Location to manage multi-gateway instance.
3.  camera device Living Stream Rendering on web console.
4.  Gradually improve other functions






