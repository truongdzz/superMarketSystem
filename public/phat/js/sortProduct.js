function sortdecreaseByCategory(catergoryId){
    // alert(catergoryId);
    url='sortProductdecreasingBycategory/'+catergoryId;
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET",url);
    xhttp.send();

    xhttp.onload=function(){
        if(this.status==200){
            let json=this.responseText;
            // console.log(json);
            json = JSON.parse(this.responseText);
            // console.log(json);
            // alert(json.length);
            if(json.length>0){
                let homeProduct = document.querySelector('.home-product');
            
                // console.log(homeProduct);
                // console.log(homeProduct.querySelector('.grid__row'));
                // homeProduct.querySelector('.grid__row').removeChild();
                // homeProduct.querySelector('.grid__row').innerHTML='<h1> xin chao ahihi </h1>'
                let sourceCode ='';
                for (let i = 0; i < json.length; i++) {
                    const element = json[i];
                    sourceCode=sourceCode+`
                    <div class="grid__column-2-4">
                        <div class="home-product-item" href="#">
                            <div class="home-product-item__img" style="background-image: url('${element.good_img}');"></div>
                            <h4 class="home-product-item__name">${element.name} </h4>
                            <div class="home-product-item__price">
                    `
                    
                    if(element.discount>0){
                        sourceCode=sourceCode+`
                            <span class="home-product-item__price-old">${element.sellPrice} VND</span>
                            <span class="home-product-item__price-current">${element.sellPrice * (1 - element.discount*0.01)} VNĐ</span>
                        `;
                    }
                    else{
                        sourceCode=sourceCode+`<span class="home-product-item__price-current">${element.sellPrice} VNĐ</span>
                        `;
                    }
                    sourceCode=sourceCode+`
                    </div>
                    <!--<div class="home-product-item__action">
                        <span class="home-product-item__like home-product-item__like--liked">
                            <i class="home-product-item__like-icon-empty fa-regular fa-heart"></i>
                            <i class="home-product-item__like-icon-fill fa-solid fa-heart"></i>
                            
                        </span>
                        <div class="home-product-item__rating">
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span class="home-product-item__sold">88 Đã bán</span>
                    </div>-->
                    
                    <div class="home-product-item__buy-btn" onclick="insertProducttocart('${element.id}')">
                        <span class="home-product-item__buy-btn-title">Thêm vào giỏ</span>
                        <span class="home-product-item__buy-btn-icon">
                            <i class="fa-solid fa-cart-plus"></i>
                        </span>
                    </div>
                    
                    `;
                    if(element.amount>50){
                        sourceCode=sourceCode+`
                        <div class="home-product-item__favourite">
                            <i class="fa-solid fa-check"></i>
                            <span>Yêu Thích</span>
                        </div>`;
                    }
                    if(element.discount>0){
                        sourceCode=sourceCode+`
                        <div class="home-product-item__sale-off">
                            <span class="home-product-item__sale-off-percent">${element.discount}%</span>
                            <span class="home-product-item__sale-off-label">Giảm</span>
                        </div>`;
                    }
                    sourceCode=sourceCode+`
                    
                    </div>
                    </div>`;
                }
                homeProduct.querySelector('.grid__row').innerHTML=sourceCode;
                // console.log(sourceCode);
                
            }

        }
    }

}

function sortincreaseByCategory(catergoryId){
    // alert(catergoryId);
    url='sortProductincreasingBycategory/'+catergoryId;
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET",url);
    xhttp.send();

    xhttp.onload=function(){
        if(this.status==200){
            let json=this.responseText;
            // console.log(json);
            json = JSON.parse(this.responseText);
            // console.log(json);
            // alert(json.length);
            if(json.length>0){
                let homeProduct = document.querySelector('.home-product');
            
                // console.log(homeProduct);
                // console.log(homeProduct.querySelector('.grid__row'));
                // homeProduct.querySelector('.grid__row').removeChild();
                // homeProduct.querySelector('.grid__row').innerHTML='<h1> xin chao ahihi </h1>'
                let sourceCode ='';
                for (let i = 0; i < json.length; i++) {
                    const element = json[i];
                    sourceCode=sourceCode+`
                    <div class="grid__column-2-4">
                        <div class="home-product-item" href="#">
                            <div class="home-product-item__img" style="background-image: url('${element.good_img}');"></div>
                            <h4 class="home-product-item__name">${element.name} </h4>
                            <div class="home-product-item__price">
                    `
                    
                    if(element.discount>0){
                        sourceCode=sourceCode+`
                            <span class="home-product-item__price-old">${element.sellPrice} VND</span>
                            <span class="home-product-item__price-current">${element.sellPrice * (1 - element.discount*0.01)} VNĐ</span>
                        `;
                    }
                    else{
                        sourceCode=sourceCode+`<span class="home-product-item__price-current">${element.sellPrice} VNĐ</span>
                        `;
                    }
                    sourceCode=sourceCode+`
                    </div>
                    <!--<div class="home-product-item__action">
                        <span class="home-product-item__like home-product-item__like--liked">
                            <i class="home-product-item__like-icon-empty fa-regular fa-heart"></i>
                            <i class="home-product-item__like-icon-fill fa-solid fa-heart"></i>
                            
                        </span>
                        <div class="home-product-item__rating">
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span class="home-product-item__sold">88 Đã bán</span>
                    </div>-->
                    
                    <div class="home-product-item__buy-btn" onclick="insertProducttocart('${element.id}')">
                        <span class="home-product-item__buy-btn-title">Thêm vào giỏ</span>
                        <span class="home-product-item__buy-btn-icon">
                            <i class="fa-solid fa-cart-plus"></i>
                        </span>
                    </div>
                    
                    `;
                    if(element.amount>50){
                        sourceCode=sourceCode+`
                        <div class="home-product-item__favourite">
                            <i class="fa-solid fa-check"></i>
                            <span>Yêu Thích</span>
                        </div>`;
                    }
                    if(element.discount>0){
                        sourceCode=sourceCode+`
                        <div class="home-product-item__sale-off">
                            <span class="home-product-item__sale-off-percent">${element.discount}%</span>
                            <span class="home-product-item__sale-off-label">Giảm</span>
                        </div>`;
                    }
                    sourceCode=sourceCode+`
                    
                    </div>
                    </div>`;
                }
                homeProduct.querySelector('.grid__row').innerHTML=sourceCode;
                // console.log(sourceCode);
                
            }

        }
    }

}

function sortincreaseALL(){
    url='sortProductincreasingALL/';
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET",url);
    xhttp.send();
    xhttp.onload=function(){
        if(this.status==200){
            // console.log(this.responseText);
            let json = JSON.parse(this.responseText);
            // console.log(json);
            let homeProduct = document.querySelector('.home-product');
            
            // console.log(homeProduct);
            // console.log(homeProduct.querySelector('.grid__row'));
            // homeProduct.querySelector('.grid__row').removeChild();
            // homeProduct.querySelector('.grid__row').innerHTML='<h1> xin chao ahihi </h1>'
            let sourceCode ='';
            for (let i = 0; i < json.length; i++) {
                const element = json[i];
                sourceCode=sourceCode+`
                <div class="grid__column-2-4">
                    <div class="home-product-item" href="#">
                        <div class="home-product-item__img" style="background-image: url('${element.good_img}');"></div>
                        <h4 class="home-product-item__name">${element.name} </h4>
                        <div class="home-product-item__price">
                `
                
                if(element.discount>0){
                    sourceCode=sourceCode+`
                        <span class="home-product-item__price-old">${element.sellPrice} VND</span>
                        <span class="home-product-item__price-current">${element.sellPrice * (1 - element.discount*0.01)} VNĐ</span>
                    `;
                }
                else{
                    sourceCode=sourceCode+`<span class="home-product-item__price-current">${element.sellPrice} VNĐ</span>
                    `;
                }
                sourceCode=sourceCode+`
                </div>
                <!--<div class="home-product-item__action">
                    <span class="home-product-item__like home-product-item__like--liked">
                        <i class="home-product-item__like-icon-empty fa-regular fa-heart"></i>
                        <i class="home-product-item__like-icon-fill fa-solid fa-heart"></i>
                        
                    </span>
                    <div class="home-product-item__rating">
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <span class="home-product-item__sold">88 Đã bán</span>
                </div>-->
                
                <div class="home-product-item__buy-btn" onclick="insertProducttocart('${element.id}')">
                    <span class="home-product-item__buy-btn-title">Thêm vào giỏ</span>
                    <span class="home-product-item__buy-btn-icon">
                        <i class="fa-solid fa-cart-plus"></i>
                    </span>
                </div>
                
                `;
                if(element.amount>50){
                    sourceCode=sourceCode+`
                    <div class="home-product-item__favourite">
                        <i class="fa-solid fa-check"></i>
                        <span>Yêu Thích</span>
                    </div>`;
                }
                if(element.discount>0){
                    sourceCode=sourceCode+`
                    <div class="home-product-item__sale-off">
                        <span class="home-product-item__sale-off-percent">${element.discount}%</span>
                        <span class="home-product-item__sale-off-label">Giảm</span>
                    </div>`;
                }
                sourceCode=sourceCode+`
                
                </div>
                </div>`;
            }
            homeProduct.querySelector('.grid__row').innerHTML=sourceCode;
            // console.log(sourceCode);
            

        }
    }
}

function sortdecreaseALL(){
    url='sortProductdecreasingALL/';
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET",url);
    xhttp.send();

    xhttp.onload=function(){
        if(this.status==200){
            // console.log(this.responseText);
            let json = JSON.parse(this.responseText);
            // console.log(json);
            let homeProduct = document.querySelector('.home-product');
            
            // console.log(homeProduct);
            // console.log(homeProduct.querySelector('.grid__row'));
            // homeProduct.querySelector('.grid__row').removeChild();
            // homeProduct.querySelector('.grid__row').innerHTML='<h1> xin chao ahihi </h1>'
            let sourceCode ='';
            for (let i = 0; i < json.length; i++) {
                const element = json[i];
                sourceCode=sourceCode+`
                <div class="grid__column-2-4">
                    <div class="home-product-item" href="#">
                        <div class="home-product-item__img" style="background-image: url('${element.good_img}');"></div>
                        <h4 class="home-product-item__name">${element.name} </h4>
                        <div class="home-product-item__price">
                `
                
                if(element.discount>0){
                    sourceCode=sourceCode+`
                        <span class="home-product-item__price-old">${element.sellPrice} VND</span>
                        <span class="home-product-item__price-current">${element.sellPrice * (1 - element.discount*0.01)} VNĐ</span>
                    `;
                }
                else{
                    sourceCode=sourceCode+`<span class="home-product-item__price-current">${element.sellPrice} VNĐ</span>
                    `;
                }
                sourceCode=sourceCode+`
                </div>
                <!--<div class="home-product-item__action">
                    <span class="home-product-item__like home-product-item__like--liked">
                        <i class="home-product-item__like-icon-empty fa-regular fa-heart"></i>
                        <i class="home-product-item__like-icon-fill fa-solid fa-heart"></i>
                        
                    </span>
                    <div class="home-product-item__rating">
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <span class="home-product-item__sold">88 Đã bán</span>
                </div>-->
                
                <div class="home-product-item__buy-btn" onclick="insertProducttocart('${element.id}')">
                    <span class="home-product-item__buy-btn-title">Thêm vào giỏ</span>
                    <span class="home-product-item__buy-btn-icon">
                        <i class="fa-solid fa-cart-plus"></i>
                    </span>
                </div>
                
                `;
                if(element.amount>50){
                    sourceCode=sourceCode+`
                    <div class="home-product-item__favourite">
                        <i class="fa-solid fa-check"></i>
                        <span>Yêu Thích</span>
                    </div>`;
                }
                if(element.discount>0){
                    sourceCode=sourceCode+`
                    <div class="home-product-item__sale-off">
                        <span class="home-product-item__sale-off-percent">${element.discount}%</span>
                        <span class="home-product-item__sale-off-label">Giảm</span>
                    </div>`;
                }
                sourceCode=sourceCode+`
                
                </div>
                </div>`;
            }
            homeProduct.querySelector('.grid__row').innerHTML=sourceCode;
            // console.log(sourceCode);
            

        }
    }
}