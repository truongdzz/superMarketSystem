//for order detail
const ahttp = new XMLHttpRequest();
ahttp.onload = function(){
	const data = JSON.parse(this.responseText);
	alert(data.message);
}
function changeStatus(value, id){
	const url = '/admin/changeOrderStatus' + "?value=" + value + "&id=" + id;
	ahttp.open("PUT", url);
	ahttp.send();
}