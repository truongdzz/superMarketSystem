let inputsearchNode = document.getElementsByClassName('header__search-input')[0];
inputsearchNode.addEventListener('input',searchproductItem)






function searchproductItem(e){
    let inputstr =e.target.value;
    let searchstr = formatStringTosearch(inputstr);
    let listProduct = document.querySelectorAll('.grid__column-2-4 .home-product-item');
    for (let i = 0; i < listProduct.length; i++) {
        const element = listProduct[i].parentNode;
        let elename = element.querySelector('.home-product-item__name').innerText;
        let elenameFormat = formatStringTosearch(elename);
        
        if(elenameFormat.includes(searchstr)){
            element.classList.remove('nonedisplay');
            
        }
        else{
            element.classList.add('nonedisplay');
            
        }
        
    }
}

function formatStringTosearch(inputstr){
    // removespace
    let outputstr=inputstr.replace(/\s/g,'');
    // lowwer case
    outputstr=outputstr.toLowerCase();
    outputstr=removeAccents(outputstr);
    return outputstr;
}

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }