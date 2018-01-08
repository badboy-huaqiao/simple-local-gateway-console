Main Author: Zhang Huaqiao
Copyright © 2017-2018 VMware, Inc. All Rights Reserved.

# simple-local-gateway-console
EdgeX Foundry local gateway devices management platform


## program language:

*   javascript
*   css
*   html
*   jquery
*   bootstrap
*   awesome font lib

## CORS proxy:

> use netflix zuul proxy technology


## config proxy to edgexfoundry microservice to solve CORS


	zuul.routes.core-command.path=/core-command/**
	
	zuul.routes.core-command.url=http://edgex_foundry_host:48082/
	
	zuul.routes.core-metadata.path=/core-metadata/**
	
	zuul.routes.core-metadata.url=http://edgex_foundry_host:48081/


## how to use:

copy the jar package which in the docker-files directory to your host
execute the following command

	java -jar simple-local-gateway-console.jar &
	
then enter the http://your_host:4000 in the browser


## the further 

1.  Will be supported to run in docker
2.  Gradually improve other functions









