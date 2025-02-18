// Generic filter function
function filterItems(container, items) {
    const searchInput = container.querySelector('.search-input input');
    const filters = Array.from(container.querySelectorAll('select'));
    const searchTerm = searchInput.value.toLowerCase().trim();
    let hasResults = false;

    items.forEach(item => {
        // Check search term
        const searchText = getSearchText(item).toLowerCase();
        const matchesSearch = !searchTerm || searchText.includes(searchTerm);

        // Check all filters
        const matchesFilters = filters.every(filter => {
            const filterValue = filter.value;
            if (filterValue.includes('All')) return true;

            switch (filter.id) {
                case 'statusFilter':
                    return item.querySelector('.status-badge').textContent.trim() === filterValue;
                case 'roleFilter':
                    return item.querySelector('.user-role').textContent.trim() === filterValue;
                case 'typeFilter':
                    return item.dataset.type === filterValue;
                default:
                    return true;
            }
        });

        const shouldShow = matchesSearch && matchesFilters;
        item.style.display = shouldShow ? '' : 'none';
        if (shouldShow) hasResults = true;
    });

    // Show/hide not found message
    const notFoundMessage = container.querySelector('.not-found-message');
    if (notFoundMessage) {
        notFoundMessage.style.display = hasResults ? 'none' : 'block';
    }

    // Update search icon
    const searchIcon = searchInput.parentElement.querySelector('i');
    searchIcon.classList.toggle('searching', searchTerm.length > 0);
}

function getSearchText(item) {
    // Get all text content that should be searchable
    const texts = [];
    texts.push(item.querySelector('h3, h4')?.textContent || '');
    texts.push(item.querySelector('.page-excerpt')?.textContent || '');
    texts.push(item.querySelector('.user-role')?.textContent || '');
    texts.push(item.querySelector('.user-details')?.textContent || '');
    texts.push(item.querySelector('.media-info')?.textContent || '');
    return texts.join(' ');
}

function getItemFilterValue(item, filterId) {
    switch (filterId) {
        case 'statusFilter':
            return item.querySelector('.status-badge')?.textContent.trim() || '';
        case 'roleFilter':
            return item.querySelector('.user-role')?.textContent.trim() || '';
        case 'typeFilter':
            return 'Images'; // Since all items are images in our demo
        case 'sortFilter':
            return item.querySelector('.media-info p')?.textContent.trim() || '';
        default:
            return '';
    }
}

// Initialize filters for Pages
function initializePagesFilters() {
    const container = document.querySelector('.pages-container');
    if (!container) return;

    const items = container.querySelectorAll('.page-card');
    const searchInput = container.querySelector('.search-input input');
    const statusFilter = container.querySelector('#statusFilter');
    const sortFilter = container.querySelector('#sortFilter');

    function applyFilters() {
        filterItems(container, items);
    }

    // Add event listeners
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
}

// Initialize filters for Media Library
function initializeMediaFilters() {
    const container = document.querySelector('.media-library-container');
    if (!container) return;

    const items = container.querySelectorAll('.media-card');
    const searchInput = container.querySelector('.search-input input');
    const typeFilter = container.querySelector('#typeFilter');
    const sortFilter = container.querySelector('#sortFilter');

    function applyFilters() {
        filterItems(container, items);
    }

    // Add event listeners
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    // Handle sort filter changes
    sortFilter.addEventListener('change', () => {
        const sortValue = sortFilter.value;
        const itemsArray = Array.from(items);
        
        itemsArray.sort((a, b) => {
            const aText = a.querySelector('.media-info p').textContent;
            const bText = b.querySelector('.media-info p').textContent;
            
            switch(sortValue) {
                case 'Name':
                    const aName = a.querySelector('h4').textContent;
                    const bName = b.querySelector('h4').textContent;
                    return aName.localeCompare(bName);
                case 'Date Added':
                    return bText.localeCompare(aText); // Newest first
                default:
                    return 0;
            }
        });

        // Reappend sorted items
        const grid = container.querySelector('.media-grid');
        const notFoundMessage = grid.querySelector('.not-found-message');
        grid.innerHTML = '';
        grid.appendChild(notFoundMessage);
        itemsArray.forEach(item => grid.appendChild(item));
    });
}

// Initialize filters for User Management
function initializeUserFilters() {
    const container = document.querySelector('.user-management-container');
    if (!container) return;

    const items = container.querySelectorAll('.user-card');
    const searchInput = container.querySelector('.search-input input');
    const roleFilter = container.querySelector('#roleFilter');
    const statusFilter = container.querySelector('#statusFilter');

    function applyFilters() {
        filterItems(container, items);
    }

    // Add event listeners
    searchInput.addEventListener('input', applyFilters);
    roleFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initializePagesFilters();
    initializeMediaFilters();
    initializeUserFilters();
}); 