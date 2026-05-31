import {requireAuth, signOutUser} from './auth.js';
import {db} from './firebase-config.js';
import {  
    collection, 
    getDocs,
    query, 
    where,
    doc, 
    setDoc, 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const signoutBtn = document.getElementById('signout-btn');
const itemsGrid = document.getElementById('items-grid');
const loadingSpinner = document.getElementById('loading-spinner');

// Callback for user to check if they're signed in or not
requireAuth((user)=>{
    signoutBtn.addEventListener('click',()=>{
        signOutUser()
        .catch((error)=>{
            window.alert("Could not log out. Please try again.");
        });
    });

    // Get the shortlist btn and pass it to addToShortList with itemId
    itemsGrid.addEventListener('click',(e)=>{
        const btn = e.target.closest('.shortlist-action-btn');
        if(!btn) return;

        const itemId = btn.dataset.id;
        addToShortlist(user, itemId, btn);
    })

    loadItems(user);
});

// Loading Items of the users using query and getDocs
async function loadItems(user){

    try{
        // Items query for items 
        const itemsQuery = query(collection(db, 'items'), where('sellerId','!=',user.uid));
        
        // Short list query for the shortlisted items
        const shortlistQuery = query(collection(db, 'shortlists'), where('userId','==',user.uid));

        // Promise for both snapshot
        const [itemsSnapshot, shortlistSnapshot] = await Promise.all([
            getDocs(itemsQuery),
            getDocs(shortlistQuery)
        ]);

        const docsArray = itemsSnapshot.docs;

        // Get the shortlisted items 
         const userShortlistedItemIds = new Set(
            shortlistSnapshot.docs.map(doc => doc.data().itemId)
        );

        // Loading spinner remove
        if(loadingSpinner) loadingSpinner.classList.add('d-none');
        if(itemsGrid) itemsGrid.classList.remove('d-none');

        // Check for no items
        if(docsArray.length === 0){
            itemsGrid.innerHTML = `<p class="text-center text-muted my-5 w-100">No marketplace items available from other sellers right now.</p>`;
            return;
        }

        let gridHTML = ``;

        // Set the items using createItemCard
        docsArray.forEach(docSnapshot => {
            const itemData = docSnapshot.data();
            const itemId = docSnapshot.id;

            const isSaved = userShortlistedItemIds.has(itemId);
            
            gridHTML += createItemCard(itemId, itemData, isSaved);
        });

        itemsGrid.innerHTML = gridHTML;

    }catch(error){
        window.alert('Error retrieving marketplace documents: '+ error.message);
        if(loadingSpinner){
            loadingSpinner.innerHTML = `<p class="text-danger fw-bold">Failed to load marketplace data. Please refresh.</p>`;
        }
    }
}


// Creating Item Cards
function createItemCard(id, item, isSaved){

    const heartIconClass = isSaved?'fa-solid':'fa-regular';
    const activeClass = isSaved?'is-shortlisted':'';

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
                <button class="shortlist-action-btn ${activeClass}" data-id="${id}" title='Shortlist'><i class="${heartIconClass} fa-heart"></i></button>
            </div>
        </div>
    `;
}

// Add to short list using doc and setDoc with a unique customeDocId
async function addToShortlist(user, itemId, btn) {
    
    const icon = btn.querySelector('i');

    if(btn.classList.contains('is-shortlisted')){
        window.alert('Item already added to shortlist.');
        return;
    }

    try{
        const customDocId = `${user.uid}_${itemId}`;

        const shortListRef = doc(db, 'shortlists', customDocId);

        await setDoc(shortListRef, {
            userId: user.uid,
            itemId: itemId,
            shortListedAt: new Date().toISOString()
        });

        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        btn.classList.add('is-shortlisted');
        btn.disabled = true;

    }catch(error){
        window.alert("Failed to save item to your shorlist.");
    }
    
}