// Settings Save Changes function
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
});

function initializeSettingsPage() {
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', saveSettings);
    }
}

function saveSettings(event) {
    event.preventDefault();
    const form = event.target;
    const saveButton = form.querySelector('#saveSettingsBtn');
    const formData = new FormData(form);

    // Show loading state
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveButton.disabled = true;

    fetch('/api/settings', {
        method: 'POST',
        body: formData,
        headers: {
            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        showNotification('Settings saved successfully', 'success');
    })
    .catch(error => {
        console.error('Settings error:', error);
        showNotification('Error saving settings', 'error');
    })
    .finally(() => {
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

        const uploadButton = document.querySelector('#uploadMediaBtn');
        const originalText = uploadButton.innerHTML;
        uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        uploadButton.disabled = true;

        fetch('/api/media/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            showNotification('Media uploaded successfully', 'success');
            if (typeof refreshMediaGrid === 'function') {
                refreshMediaGrid();
            }
        })
        .catch(error => {
            showNotification('Error uploading media', 'error');
            console.error('Upload error:', error);
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
            'Content-Type': 'application/json',
            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
        },
        body: JSON.stringify({
            title: 'New Page',
            status: 'draft'
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        window.location.href = `/dashboard/pages/edit/${data.id}`;
    })
    .catch(error => {
        showNotification('Error creating page', 'error');
        console.error('Page creation error:', error);
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

// Helper function for notifications
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}