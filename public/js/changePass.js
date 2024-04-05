// change-password-script.js
const blueParagraph = document.querySelector('.blue-paragraph');

// Function to extract token from the URL
function extractTokenFromUrl() {
  const path = window.location.pathname;
  const pathArray = path.split('/');
  const token = pathArray[pathArray.length - 1];
  return token;
}

document
  .getElementById('changePasswordForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      // Passwords do not match, handle this case (e.g., show an error message)
      console.error('Passwords do not match');
      return;
    }

    const token = extractTokenFromUrl();

    if (!token) {
      console.error('Token not found in the URL');
      return;
    }

    const formData = {
      password: newPassword,
      passwordConfirm: confirmPassword,
    };
    console.log(formData);
    const apiUrl = 'http://127.0.0.1:4001/api/users/resetPassword/';
    console.log(apiUrl + token);
    fetch(apiUrl + token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        blueParagraph.textContent = 'Password change successful:';
      })
      .catch((error) => {
        blueParagraph.textContent = 'something looks wrong';
      });
  });
