const axios = require('axios');
exports.speechPrediction = async (content) => {
  try {
    const response = await axios.post(
      'https://ibrahimahmed.pythonanywhere.com/predict',
      {
        text: content,
      }
    );
    if (!response.data || response.data.prediction === undefined) {
      throw new Error('Invalid response from hate speech detection API');
    }

    const { prediction } = response.data;
    return prediction;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};
