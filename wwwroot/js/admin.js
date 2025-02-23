function handleLogout(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('#logoutButton');
    
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';

    // Submit the form
    fetch(form.action, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/Account/Login';
        } else {
            throw new Error('Logout failed');
        }
    })
    .catch(error => {
        // Reset button state if there's an error
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        console.error('Logout error:', error);
    });

    return false;
} 

// Save button, new page, uplaod button, etc.
// Settings Save Changes function
function saveSettings(event) {
    event.preventDefault();
    const settingsForm = document.querySelector('#settingsForm');
    const formData = new FormData(settingsForm);

    // Show loading state
    const saveButton = event.target;
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveButton.disabled = true;

    fetch('/api/settings', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Show success message
        showNotification('Settings saved successfully', 'success');
    })
    .catch(error => {
        // Show error message
        showNotification('Error saving settings', 'error');
    })
    .finally(() => {
        // Reset button state
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    });
}

// Media Upload function
function uploadMedia(event) {
    event.preventDefault();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,video/*';

    fileInput.onchange = (e) => {
        const files = e.target.files;
        const formData = new FormData();
        
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        // Show loading state
        const uploadButton = document.querySelector('#uploadMediaBtn');
        const originalText = uploadButton.innerHTML;
        uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        uploadButton.disabled = true;

        fetch('/api/media/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showNotification('Media uploaded successfully', 'success');
            refreshMediaGrid(); // Function to refresh the media grid
        })
        .catch(error => {
            showNotification('Error uploading media', 'error');
        })
        .finally(() => {
            uploadButton.innerHTML = originalText;
            uploadButton.disabled = false;
        });
    };

    fileInput.click();
}

// New Page function
function createNewPage(event) {
    event.preventDefault();
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    button.disabled = true;

    fetch('/api/pages/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'New Page',
            status: 'draft'
        })
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = `/dashboard/pages/edit/${data.id}`;
    })
    .catch(error => {
        showNotification('Error creating page', 'error');
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

// Helper function for notifications
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}