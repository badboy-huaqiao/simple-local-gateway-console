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

> netflix zuul

#config proxy to edgexfoundry microservice to solve CORS
	zuul.routes.core-command.path=/core-command/**
	zuul.routes.core-command.url=http://10.117.170.136:48082/
	zuul.routes.core-metadata.path=/core-metadata/**
	zuul.routes.core-metadata.url=http://10.117.170.136:48081/








