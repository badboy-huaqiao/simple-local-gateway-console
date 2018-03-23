/*
 * Date format  yyyy-MM-dd hh:mm:ss
 */
var dateToString = function (num){
	var date = new Date();
	date.setTime(num);
	var y = date.getFullYear();
	var M = date.getMonth() + 1;
	M = (M < 10) ? ('0' + M) : M ;
	var d = date.getDate();
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