let adata;

const ahttp = new XMLHttpRequest();
ahttp.onload = function(){
	if(this.status == 403){
		const ask = inform("Phiên của bạn đã hết hạn, bạn có muốn đăng nhập lại?");
		if(ask){
			location.href = "/login/staff";
		}
		return;
	} 
	else if(this.status == 401){
		const ask = inform("Bạn không có quyền truy cập vào địa chỉ này, bạn có muốn đăng nhập lại?");
		if(ask){
			location.href = "/login/staff";
		}
		return;
	}
	else if(this.status == 200){
		adata = JSON.parse(this.responseText);
		adata = adata.map(item =>{
			item.name = item.name.toUpperCase();
			return item;
		})
	} 
	else if(this.status == 500){
		alert('Server Error');
	} 
	else{
		console.log(this.status)
	}
}

ahttp.open('GET', '/admin/getAllProduct');
ahttp.send();


const aSearchBar = document.getElementById('searchBar');
const table = document.getElementById('result');
aSearchBar.addEventListener('keyup', function(event){
	if(this.value.length == 0){
		table.classList.add('hide');
		return;
	}
	let str = this.value.toUpperCase();
	str = str.trim();
	while(str.includes("  ")){
		str = str.replace("  ", " ");
	}
	const result = adata.filter(item => {
		if(item.name.includes(str) || item.id == str){
			return true;
		} else return false;
	})
	table.innerHTML = "";
	for (var i = 0; i < result.length; i++) {
		const item = result[i];
		table.innerHTML += 
		`
		<div class="row" onmousedown="gotoProduct(${item.id})">
			<div class="cell">
				<img src="${item.good_img}"></img>
			</div>
			<div class="cell">${item.name}</div>
		</div>
		`;
	}
	table.classList.remove('hide');
})
aSearchBar.addEventListener('focusout', function(event){
	table.classList.add('hide');
	this.value = "";
})

function gotoProduct(id){
	location.href = '/admin/detailProduct/' + id;
}