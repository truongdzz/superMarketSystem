//for order detail
const ahttp = new XMLHttpRequest();
ahttp.onload = function(){
	const data = JSON.parse(this.responseText);
	alert(data.message);
}
function changeStatus(value, id, userid){
	const url = '/admin/changeOrderStatus' + "?value=" + value + "&id=" + id + "&user=" + userid;
	ahttp.open("PUT", url);
	ahttp.send();
} 