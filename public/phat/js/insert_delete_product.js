function deleteProductoutofcartbanner(e,idProduct,idOrder){
    let xhttp=new XMLHttpRequest();
    let quantity = e.target.parentNode.parentNode.querySelector('.header__cart-item-qnt').innerText.trim();
    // console.log(quantity);
    // console.log(idOrder+' - '+idProduct);
    url='/delProductOutCart/'+idProduct+'/'+idOrder+'/'+quantity;
    xhttp.open("GET",url);
    xhttp.send();
    xhttp.onload=function(){
        // alert(this.responseText);
        location.reload();
    }

}

function insertProducttocart(idProduct){
    // alert(idProduct);
    let xhttp = new XMLHttpRequest();
    url='/insertProductToCart/'+idProduct;
    xhttp.open("GET",url);
    xhttp.send();
    // xhttp.onload=function(){
    //     alert(this.responseText);
    // }
    // xhttp.onload=function(){
    //     alert('ok');
    // }
    xhttp.onload=function(){
        if(this.status==400){
            alert(this.responseText);
        }
        else if(this.status==200){
            alert(this.responseText+this.status);
            location.reload();
        }
    }

}