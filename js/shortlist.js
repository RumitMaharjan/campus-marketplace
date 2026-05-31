import {requireAuth, signOutUser} from './auth.js';
import {db} from './firebase-config.js';
import {  
    collection, 
    getDocs,
    query, 
    where,
    doc, 
    getDoc,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const signoutBtn = document.getElementById('signout-btn');
const itemsGrid = document.getElementById('items-grid');
const loadingSpinner = document.getElementById('loading-spinner');

// Required auth check
requireAuth((user)=>{
    signoutBtn.addEventListener('click',()=>{
        signOutUser()
        .catch((error)=>{
            window.alert("Could not log out. Please try again.");
        });
    });

    itemsGrid.addEventListener('click',(e)=>{
        const btn = e.target.closest('.delete-action-btn');
        if(!btn) return;

        const itemId = btn.dataset.id;

        if(confirm("Are you sure you want to remove this item from your shortlist?")){
            removeShortlist(user, itemId, btn);
        }
    });

    loadItems(user);
});

async function loadItems(user){

    try{
        // Shortlist query where userID == user.uid
        const shortlistQuery = query(collection(db, 'shortlists'), where('userId','==',user.uid));

        const shortlistDocs = await getDocs(shortlistQuery);

        // Get the items for every shortlisted items we got
        const itemPromises = shortlistDocs.docs.map(shortDoc=>{
            const itemId = shortDoc.data().itemId;
            return getDoc(doc(db, 'items', itemId));
        });

        const docsArray = await Promise.all(itemPromises);

        if(loadingSpinner) loadingSpinner.classList.add('d-none');
        if(itemsGrid) itemsGrid.classList.remove('d-none');

        if(docsArray.length === 0){
            itemsGrid.innerHTML = `<p class="text-center text-muted my-5 w-100">You haven't shortlisted any items yet.</p>`;
            return;
        }

        let gridHTML = ``;
        let visibleCount = 0;

        docsArray.forEach(docSnapshot => {

            if(docSnapshot.exists()){
                const itemData = docSnapshot.data();
                const itemId = docSnapshot.id;
                
                gridHTML += createItemCard(itemId, itemData);
                visibleCount++;
            }
           
        });

        if (visibleCount === 0) {
            itemsGrid.innerHTML = `<p class="text-center text-muted my-5 w-100">Your shortlisted items are no longer available.</p>`;
        } else {
            itemsGrid.innerHTML = gridHTML;
        }

    }catch(error){
        window.alert('Error retrieving marketplace documents: '+ error.message);
        if(loadingSpinner){
            loadingSpinner.innerHTML = `<p class="text-danger fw-bold">Failed to load shortlist data. Please refresh.</p>`;
        }
    }
}

// Create the shortlisted items with delete button
function createItemCard(id, item){
    return  `
        <div class="product-card" id="card-${id}">
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
                <button class="delete-action-btn" data-id="${id}" title='Remove Shortlist'>
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `;
}

// Remove shortlist using deleteDoc
async function removeShortlist(user, itemId, btn) {

    try{
        const customDocId = `${user.uid}_${itemId}`;

        const shortListRef = doc(db, 'shortlists', customDocId);

        await deleteDoc(shortListRef);

        const productTile = document.getElementById(`card-${itemId}`);

        if(productTile){
            productTile.remove();
        }

        if (itemsGrid.children.length === 0) {
            itemsGrid.innerHTML = `<p class="text-center text-muted my-5 w-100">You haven't shortlisted any items yet.</p>`;
        }

    }catch(error) {
        window.alert("Failed to remove item from your shortlist. Error: " + error.message);
    }
    
}