const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const CAT_API_KEY = '';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000'
}));
  

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/api/dog', async (req, res) => {
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      if (response.data && response.data.message) {
        res.json({ message: response.data.message });
      } else {
        throw new Error('Invalid dog image data format');
      }
    } catch (error) {
      console.error('Error fetching dog image:', error);
      res.status(500).send('Error fetching dog image');
    }
  });
  
  app.get('/api/cat', async (req, res) => {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
        headers: {
          'x-api-key': CAT_API_KEY
        }
      });
      if (response.data && response.data[0] && response.data[0].url) {
        res.json({ url: response.data[0].url });
      } else {
        throw new Error('Invalid cat image data format');
      }
    } catch (error) {
      console.error('Error fetching cat image:', error);
      res.status(500).send('Error fetching cat image');
    }
  });
      
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});