const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = 3001;
const https = require('https');
let accessToken = null;
let tokenExpiry = null;

const mockReviews = require('./mockReviews');

async function getAccessToken() {
  // Return cached token if still valid
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://api.hostaway.com/v1/accessTokens',
      qs.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.HOSTAWAY_CLIENT_ID,
        client_secret: process.env.HOSTAWAY_CLIENT_SECRET,
        scope: 'general'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Token request failed:', error.response?.data || error.message);
    throw error;
  }
}

app.get('/api/reviews/hostaway', async (req, res) => {
  try {
    // 1. Attempt real API call
    const token = await getAccessToken();
    const apiResponse = await axios.get('https://api.hostaway.com/v1/reviews', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Raw API response:", apiResponse.data);
    
    // 2. Check for empty or invalid response (sandbox case)
    if (!apiResponse.data?.result || apiResponse.data.result.length === 0) {
      console.log('API returned empty result, using mock data');
      const mockResponse = {
        status: "success",
        source: "mock",
        result: normalizeReviews(mockReviews)
      };
      console.log("Sending mock data:", mockResponse);
      return res.json(mockResponse);
    }
    
    // 3. Return actual API data if exists
    const apiData = {
      status: "success",
      source: "api",
      result: normalizeReviews(apiResponse.data.result)
    };
    console.log("Sending API data:", apiData);
    res.json(apiData);
    
  } catch (error) {
    // 4. Handle API failures
    console.error('API request failed, using mock data:', error.message);
    const errorResponse = {
      status: "success",
      source: "mock",
      result: normalizeReviews(mockReviews)
    };
    console.log("Sending error fallback:", errorResponse);
    res.json(errorResponse);
  }
});

// Normalize review data
function normalizeReviews(reviews) {
  // Handle API response format
  if (reviews && reviews.result) {
    reviews = reviews.result;
  }
  
  // Ensure we have an array
  if (!Array.isArray(reviews)) {
    console.warn('Invalid reviews data:', reviews);
    reviews = [];
  }
  
  return reviews.map(review => ({
    id: review.id,
    type: review.type,
    status: review.status,
    rating: calculateAverageRating(review.reviewCategory || review.categories),
    categories: review.reviewCategory || review.categories || [],
    date: review.submittedAt.split('T')[0].replace(/-/g, '/'), // "2020-08-21" → "2020/08/21"
    guest: review.guestName || 'Anonymous',
    property: review.listingName || 'Unknown Property',
    content: review.publicReview || '',
    approved: review.approved || false
  }));
}

function calculateAverageRating(categories) {
  if (!categories || categories.length === 0) return null;
  const sum = categories.reduce((acc, curr) => acc + curr.rating, 0);
  return (sum / categories.length).toFixed(1);
}

// API endpoint
app.get('/api/reviews/hostaway', (req, res) => {
  const normalized = normalizeReviews(mockReviews);
  res.json(normalized);
});

// Endpoint to update approval status
app.post('/api/reviews/approve/:id', express.json(), (req, res) => {
  // In a real app, we'd update a database
  res.json({ success: true, id: req.params.id, approved: req.body.approved });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));