
const gridContent = document.querySelector('.grid-custom');
const selecteditem = document.querySelector('.selected-item');
const lower = document.querySelector(".lower-content"); 
const pbar = document.querySelector(".progress");

let listproducts = [];
let Bundlelist = [];
let total= 0


const pdata = () => {
    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            listproducts = data;
            updateProduct(listproducts);
        })
        .catch(err => console.error("Error loading products:", err));
};

const updateProduct = (products) => {
    gridContent.innerHTML = "";
    products.forEach(prod => {
        let newproduct = document.createElement('div');
        newproduct.classList.add('product-item');
        newproduct.dataset.id = prod.id;
        newproduct.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}">
            <p class="product-name">${prod.name}</p>
            <p class="product-price">$${prod.price}</p>
            <button class="product-btn">
                <span class="btn-text">Add to Bundle</span>
                <span><img src="./assets/Icons/Plus.svg" alt="" class="plus-icon"></span>
            </button>
        `;
        gridContent.appendChild(newproduct);
    });
};


gridContent.addEventListener('click', (event) => {
    const clickbtn = event.target.closest('.product-btn');
    if (!clickbtn) return;

    const productId = parseInt(clickbtn.closest('.product-item').dataset.id);
    const index = Bundlelist.findIndex(value => value.product_id === productId);
    const img = clickbtn.querySelector('img.plus-icon');

    if (index === -1) {
        Bundlelist.push({ product_id: productId, quantity: 1 });
        clickbtn.classList.add('active'); 
        clickbtn.querySelector('.btn-text').textContent = "Added";
        img.src = "./assets/Icons/Check.svg";
    } else {
        Bundlelist.splice(index, 1);
        clickbtn.classList.remove('active'); 
        clickbtn.querySelector('.btn-text').textContent = "Add to Bundle";
        img.src = "./assets/Icons/Plus.svg";
    }

    updatebundle(Bundlelist);
    fillprogress(Bundlelist.length);
    total = calculateSubtotal();
    const disNum = discount(total);
    const subtotal = total - disNum;
    updatelower(disNum, subtotal);
});



const addtobundle = (productId) => {
      const checkproduct = Bundlelist.findIndex(value => value.product_id === productId);
          if (Bundlelist.length <= 0) {
        Bundlelist = [{ product_id: productId, quantity: 1 }];
    } else if (checkproduct < 0) {
        Bundlelist.push({ product_id: productId, quantity: 1 });
    } else {
        Bundlelist[checkproduct].quantity += 1;
    }

    updatebundle(Bundlelist);
    fillprogress(Bundlelist.length);
    
    total = calculateSubtotal()
    const disNum = discount(total);
    const subtotal = total -disNum ;
    updatelower(disNum, subtotal);
};

const updatebundle = (bundleitem) => {
    selecteditem.innerHTML = "";

    const displayItems = bundleitem.slice(0, 3);

    displayItems.forEach(prod => {
        let productinfo = listproducts.find(value => value.id === prod.product_id);

        let item = document.createElement('div');
        item.classList.add('selected-product');
        item.innerHTML = `
            <div class="img-sec" style="background-color:transparent">
                <img src="${productinfo.image}" alt="" class="cart-img">
            </div>
            <div class="item-content" style="background-color:transparent">
                <h4>${productinfo.name}</h4>
                <p>$${productinfo.price}</p>
                <div class="card-button">
                    <div class="selected-button">
                        <button class = "decrement" data-id="${prod.product_id}">-</button>
                        <p>${prod.quantity}</p>
                        <button class = "increment" data-id="${prod.product_id}">+</button>
                    </div>
                    <div class="delete" data-id="${prod.product_id}">
                        <img src="./assets/bundle-cart-remove-button.png">
                    </div>                                        
                </div>
            </div>
        `;
        selecteditem.appendChild(item);
    });

    for (let i = displayItems.length; i < 3; i++) {
        let skeleton = document.createElement('div');
        skeleton.classList.add('selected-product');
        skeleton.innerHTML = `
            <div class="img-sec"></div>
            <div class="skeleton"></div>
        `;
        selecteditem.appendChild(skeleton);
    }
};

selecteditem.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete');
    if (deleteBtn) {
        const idToRemove = parseInt(deleteBtn.dataset.id);
        const index = Bundlelist.findIndex(item => item.product_id === idToRemove);
        if (index !== -1) {
            Bundlelist.splice(index, 1);
        }

            const productBtn = gridContent.querySelector(`.product-item[data-id="${idToRemove}"] .product-btn`);
            if (productBtn) {
                productBtn.classList.remove('active');
                productBtn.querySelector('.btn-text').textContent = "Add to Bundle";
                productBtn.querySelector('img.plus-icon').src = "./assets/Icons/Plus.svg";
            }
    
        updatebundle(Bundlelist);
        fillprogress(Bundlelist.length);
        total = calculateSubtotal()
     const disNum = discount(total);
     const subtotal = total -disNum ;
        updatelower(disNum, subtotal);
    }    
});



selecteditem.addEventListener('click' , (event)=>{
    const decrement = event.target.closest('.decrement');
    if(decrement){
        const id = parseInt(decrement.dataset.id);
        const item = Bundlelist.find(value => value.product_id === id);
        if(item && item.quantity >1){
            
            item.quantity--;
        }
        else{
           alert("cannot be less than zero")
        }
         updatebundle(Bundlelist);
        fillprogress(Bundlelist.length);
        total = calculateSubtotal();
        const disNum = discount(total);
        const subtotal = total - disNum;
        updatelower(disNum, subtotal);
    }
})

selecteditem.addEventListener('click' , (event)=>{
    const increment = event.target.closest('.increment');
    if(increment){
        const id = parseInt(increment.dataset.id);
        const item = Bundlelist.find(value => value.product_id === id);
        if(item ){
            item.quantity++;
        }
         updatebundle(Bundlelist);
        fillprogress(Bundlelist.length);
        total = calculateSubtotal();
        const disNum = discount(total);
        const subtotal = total - disNum;
        updatelower(disNum, subtotal);
    }
})

const renderSkeletons = () => {
    selecteditem.innerHTML = "";

    if(Bundlelist.length > 3){
           for (let i = 0; i < Bundlelist.length; i++) {
        let skeleton = document.createElement('div');
        skeleton.classList.add('selected-product');
        skeleton.innerHTML = `
            <div class="img-sec"></div>
            <div class="skeleton"></div>
        `;
        selecteditem.appendChild(skeleton);
        
    }

    }else{
           for (let i = 0; i < 3; i++) {
        let skeleton = document.createElement('div');
        skeleton.classList.add('selected-product');
        skeleton.innerHTML = `
            <div class="img-sec"></div>
            <div class="skeleton"></div>
        `;
        selecteditem.appendChild(skeleton);

    }
    }

};

const updatelower = (disNum = 0, subtotal = 0) => {
    lower.innerHTML = ''; 

    const lowerelement = document.createElement('div');
    lowerelement.classList.add('lower-section');
    lowerelement.innerHTML = `
        <div id="discount">
            <hr class="line">
            <h3 class="discount">Discount <p>$${disNum.toFixed(2)} (30%)</p></h3>
            <hr class="line">
        </div>
        <div id="subtotal">
            <h2><strong>Subtotal</strong></h2>
            <h2><strong>$${subtotal.toFixed(2)}</strong></h2>
        </div>
        <button id="btn-cart">
            <span class = "cart-txt">ADD TO CART </span>
            <span><img src="./assets/Icons/CaretRight.svg" alt="#"></span>
        </button>
    `;

    lower.appendChild(lowerelement);
};


let Adding = false; 

lower.addEventListener('click', (event) => {
    const cartBtn = event.target.closest('#btn-cart');
    const carttxt = cartBtn.querySelector('.cart-txt');
    
    if (!Adding) {
        Adding = true;
        carttxt.textContent = "ADDED TO CART !";
        alert("Thank you for Adding to Cart")
       
    } else {
        Adding = false;
        carttxt.textContent = "ADD TO CART";
      
    }
});




const calculateSubtotal = () => {
    let total = 0;
    Bundlelist.forEach(item => {
        const product = listproducts.find(value => value.id === item.product_id);
        if (product) total += product.price * item.quantity;
    });
    return total;
};

const discount = (total) => {
let dnum = total * (30 / 100);
return dnum;
}

const updateprogress = (progressbar, value) => {
    progressbar.querySelector(".progress-fill").style.width = `${value}%`;
};

const fillprogress = (value) => {
    if (value === 0) updateprogress(pbar, 0);
    else if (value === 1) updateprogress(pbar, 33.33);
    else if (value === 2) updateprogress(pbar, 66.66);
    else updateprogress(pbar, 100);
};

document.querySelectorAll('.cart-img').forEach(img => {
    if (!img.getAttribute('src')) {
        img.style.display = 'none';
    }
});

renderSkeletons();
updatelower(); 
pdata();
