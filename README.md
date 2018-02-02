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

## CORS proxy:

> use netflix zuul proxy technology


## config proxy to edgexfoundry microservice to solve CORS
find application.properties file , and modify the host_ip of yours

	zuul.routes.core-command.path=/core-command/**
	
	zuul.routes.core-command.url=http://edgex_foundry_host:48082/
	
	zuul.routes.core-metadata.path=/core-metadata/**
	
	zuul.routes.core-metadata.url=http://edgex_foundry_host:48081/


## how to start:

*   copy the docker-files folder to your host.
*   Modify the proxy path IP in the application.properties file,IP that points to the EdgeX Foundry host.
*   the administrator account is admin/admin,you can custom account in application.properties file before you start the app.

Under the docker-files folder,execute the following command:

	java -jar -Dspring.config.location=./application.properties simple-local-gateway-console.jar &

	
then enter the http://your_host:4000 in the browser

or you can  pull the whole project to your Eclipse IDE(Recommend STS IDE).

## the further 

1.  Will be supported to run in docker
2.  Gradually improve other functions









