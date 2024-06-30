const stripe = Stripe(
  'pk_test_51PV4TxCsRNq51OBYsPPUj8NdhOA5Lzh8dUSq5v1HgGroIK5z2e4YqJFmSzjUgnwztBcYooQHeBLW5bxtXG1taU3500EtibMkom'
); // Replace with your Stripe publishable key
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

const donationForm = document.getElementById('donation-form');

function getQueryParams() {
  const params = {};
  window.location.search
    .substring(1)
    .split('&')
    .forEach(function (param) {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value);
    });
  return params;
}

const queryParams = getQueryParams();
const jwtToken = queryParams['token'];
const campaignId = queryParams['campaignId'];

document.getElementById('campaignId').value = campaignId;

donationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const amount = document.getElementById('amount').value;

  try {
    const { token, error } = await stripe.createToken(card);

    if (error) {
      console.error('Stripe createToken error:', error);
      return;
    }

    console.log('Token created:', token);

    const response = await fetch(
      'https://social-api-trlr.onrender.com/api/payments/payment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`, // Add JWT token to the headers
        },
        body: JSON.stringify({
          campaignId,
          amount,
          token: token.id,
        }),
      }
    );

    console.log('Server response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Network response was not ok:', errorText);
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (responseData.success) {
      alert('Donation successful!');
    } else {
      alert('Donation failed: ' + responseData.error);
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    alert('Donation failed: ' + error.message);
  }
});
