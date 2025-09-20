// Main JavaScript for Pharmacy Inventory System

// Load inventory data
function loadInventory() {
    $.ajax({
        url: '/api/inventory',
        method: 'GET',
        success: function(data) {
            displayInventory(data);
        },
        error: function(xhr, status, error) {
            console.error('Error loading inventory:', error);
            $('#inventoryTable').html('<tr><td colspan="8" class="text-center text-danger">Error loading inventory data</td></tr>');
        }
    });
}

// Display inventory in table
function displayInventory(items) {
    const tableBody = $('#inventoryTable');
    tableBody.empty();
    
    if (items.length === 0) {
        tableBody.append('<tr><td colspan="8" class="text-center">No inventory items found</td></tr>');
        return;
    }
    
    items.forEach(function(item) {
        const row = `
            <tr data-id="${item.id}">
                <td>${item.name}</td>
                <td>${item.description || ''}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>$${parseFloat(item.unit_price).toFixed(2)}</td>
                <td>${item.supplier || ''}</td>
                <td>${item.expiry_date || ''}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editItem(${item.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });
}

// Load dashboard data
function loadDashboardData() {
    $.ajax({
        url: '/api/inventory',
        method: 'GET',
        success: function(data) {
            // Total items
            $('#total-items').text(data.length);
            
            // Total value
            let totalValue = 0;
            data.forEach(function(item) {
                totalValue += item.quantity * parseFloat(item.unit_price);
            });
            $('#total-value').text('$' + totalValue.toFixed(2));
            
            // Low stock items (less than 100)
            const lowStockItems = data.filter(item => item.quantity < 100);
            $('#low-stock').text(lowStockItems.length);
            
            // Recent inventory (first 5 items)
            const recentItems = data.slice(0, 5);
            const recentTable = $('#recent-inventory');
            recentTable.empty();
            
            if (recentItems.length === 0) {
                recentTable.append('<tr><td colspan="5" class="text-center">No inventory items found</td></tr>');
                return;
            }
            
            recentItems.forEach(function(item) {
                const row = `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>$${parseFloat(item.unit_price).toFixed(2)}</td>
                        <td>${item.supplier || ''}</td>
                    </tr>
                `;
                recentTable.append(row);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error loading dashboard data:', error);
            $('#total-items').text('Error');
            $('#total-value').text('Error');
            $('#low-stock').text('Error');
            $('#recent-inventory').html('<tr><td colspan="5" class="text-center text-danger">Error loading data</td></tr>');
        }
    });
}

// Open add item modal
function openAddModal() {
    $('#itemModalLabel').text('Add Inventory Item');
    $('#itemId').val('');
    $('#itemForm')[0].reset();
}

// Edit item
function editItem(id) {
    $.ajax({
        url: '/api/inventory',
        method: 'GET',
        success: function(data) {
            const item = data.find(i => i.id == id);
            if (item) {
                $('#itemModalLabel').text('Edit Inventory Item');
                $('#itemId').val(item.id);
                $('#name').val(item.name);
                $('#description').val(item.description || '');
                $('#category').val(item.category);
                $('#quantity').val(item.quantity);
                $('#unit_price').val(parseFloat(item.unit_price).toFixed(2));
                $('#supplier').val(item.supplier || '');
                $('#expiry_date').val(item.expiry_date || '');
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('itemModal'));
                modal.show();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading item:', error);
            alert('Error loading item data');
        }
    });
}

// Save item (add or update)
function saveItem() {
    const id = $('#itemId').val();
    const itemData = {
        name: $('#name').val(),
        description: $('#description').val(),
        category: $('#category').val(),
        quantity: parseInt($('#quantity').val()) || 0,
        unit_price: parseFloat($('#unit_price').val()) || 0,
        supplier: $('#supplier').val(),
        expiry_date: $('#expiry_date').val()
    };
    
    // Validate required fields
    if (!itemData.name || !itemData.category || itemData.quantity < 0 || itemData.unit_price < 0) {
        alert('Please fill in all required fields with valid values');
        return;
    }
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/inventory/${id}` : '/api/inventory';
    
    $.ajax({
        url: url,
        method: method,
        contentType: 'application/json',
        data: JSON.stringify(itemData),
        success: function(response) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
            modal.hide();
            
            // Reload inventory
            loadInventory();
            
            // Show success message
            alert(response.message || (id ? 'Item updated successfully' : 'Item added successfully'));
        },
        error: function(xhr, status, error) {
            console.error('Error saving item:', error);
            alert('Error saving item: ' + (xhr.responseJSON?.error || 'Unknown error'));
        }
    });
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        $.ajax({
            url: `/api/inventory/${id}`,
            method: 'DELETE',
            success: function(response) {
                // Reload inventory
                loadInventory();
                
                // Show success message
                alert(response.message || 'Item deleted successfully');
            },
            error: function(xhr, status, error) {
                console.error('Error deleting item:', error);
                alert('Error deleting item: ' + (xhr.responseJSON?.error || 'Unknown error'));
            }
        });
    }
}

// Filter inventory based on search and category
function filterInventory() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    const categoryFilter = $('#categoryFilter').val();
    
    $('#inventoryTable tr').each(function() {
        const row = $(this);
        if (row.hasClass('header-row')) return; // Skip header row
        
        const name = row.find('td:eq(0)').text().toLowerCase();
        const category = row.find('td:eq(2)').text().toLowerCase();
        
        const matchesSearch = searchTerm === '' || name.includes(searchTerm) || category.includes(searchTerm);
        const matchesCategory = categoryFilter === '' || category === categoryFilter.toLowerCase();
        
        if (matchesSearch && matchesCategory) {
            row.show();
        } else {
            row.hide();
        }
    });
}

// Clear filters
function clearFilters() {
    $('#searchInput').val('');
    $('#categoryFilter').val('');
    filterInventory();
}