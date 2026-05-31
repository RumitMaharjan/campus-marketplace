import {requireAuth, signOutUser} from './auth.js';
import {db} from './firebase-config.js';
import {  
    collection, 
    getDocs,
    query, 
    where,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const signoutBtn = document.getElementById('signout-btn');
const itemsGrid = document.getElementById('items-grid');
const loadingSpinner = document.getElementById('loading-spinner');


requireAuth((user)=>{
    signoutBtn.addEventListener('click',()=>{
        signOutUser()
        .catch((error)=>{
            window.alert("Could not log out. Please try again.");
        });
    });

    loadItems(user);
});

async function loadItems(user){

    try{
        const itemsQuery = query(collection(db, 'items'), where('sellerId','==',user.uid));

        const snapshot = await getDocs(itemsQuery);

        const docsArray = snapshot.docs;

        if(loadingSpinner) loadingSpinner.classList.add('d-none');
        if(itemsGrid) itemsGrid.classList.remove('d-none');

        if(docsArray.length === 0){
            itemsGrid.innerHTML = `<p class="text-center text-muted my-5 w-100">You haven't listed any items in the marketplace.</p>`;
            return;
        }

        let gridHTML = ``;

        docsArray.forEach(docSnapshot => {
            const itemData = docSnapshot.data();
            
            gridHTML += createItemCard(docSnapshot.id, itemData);
        });

        itemsGrid.innerHTML = gridHTML;

    }catch(error){
        window.alert('Error retrieving marketplace documents: '+ error.message);
        if(loadingSpinner){
            loadingSpinner.innerHTML = `<p class="text-danger fw-bold">Failed to load your items. Please refresh.</p>`;
        }
    }
}

function createItemCard(id, item){

    return  `
        <div class="product-card">
            <div class="product-image-wrapper">
                <span class="category-badge">${item.category || 'General'}</span>
                <img src="${item.imageUrl || 'https://placehold.co'}" alt="${item.name}" onerror="this.src='https://placehold.co'">
            </div>
            <div class="product-info">
                <div class="product-header-row">
                    <h2 class="product-title">${item.name}</h2>
                    <span class="product-price">$${item.price}</span>
                </div>
                <p class="product-description">${item.description}</p>
            </div>
            <div class="product-footer">
                <span class="seller-info" title="${item.sellerEmail}">
                    <i class="fa-solid fa-user"></i> ${item.sellerEmail}
                </span>
            </div>
        </div>
    `;
}