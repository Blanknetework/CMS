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