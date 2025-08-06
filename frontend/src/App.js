import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  Paper, 
  Switch, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('All');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetch('https://the-flex-reviews-project-backend.onrender.com/api/reviews/hostaway')
      .then(res => res.json())
      .then(data => {
        // The backend always returns properly formatted data
        // Whether from real API or its own mock data
        console.log('API Response:', data);
        setReviews(data.result || []);
      })
      .catch(error => {
        console.error('Failed to fetch reviews:', error);
        setReviews([]);
      });
  }, []);

  const handleApprovalChange = async (id, approved) => {
    const response = await fetch(`https://the-flex-reviews-project-backend.onrender.com/api/reviews/approve/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved })
    });
    if (response.ok) {
      setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r));
    }
  };

  const filteredReviews = Array.isArray(reviews)
    ? (selectedProperty === 'All'
        ? reviews
        : reviews.filter(r => r?.property === selectedProperty))
    : [];

  const properties = ['All', ...new Set(
    (Array.isArray(reviews) ? reviews : [])
      .map(r => r?.property)
      .filter(Boolean)
  )];

  const chartData = (() => {
  // First calculate ratingData with proper safeguards
  const ratingData = (Array.isArray(filteredReviews) ? 
    filteredReviews.reduce((acc, review) => {
      if (!review?.rating) return acc;
      const prop = review.property || 'Unknown';
      if (!acc[prop]) acc[prop] = { sum: 0, count: 0 };
      acc[prop].sum += parseFloat(review.rating) || 0;
      acc[prop].count++;
      return acc;
    }, {}) : {});

    // Then safely convert to chart format
    return Object.entries(ratingData).map(([property, data]) => ({
      property,
      averageRating: data.count > 0 ? (data.sum / data.count).toFixed(1) : 0
    }));
  })();

  const columns = [
    { 
      field: 'property', 
      headerName: 'Property', 
      width: 200 
    },
    { 
      field: 'guest', 
      headerName: 'Guest', 
      width: 150 
    },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      width: 100,
      sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2) // Numeric sorting
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
    },
    { 
      field: 'approved', 
      headerName: 'Approved', 
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.row.approved}
          onChange={(e) => handleApprovalChange(params.row.id, e.target.checked)}
        />
      )
    },
    { 
      field: 'content', 
      headerName: 'Review', 
      width: 400 
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Reviews Dashboard</Typography>
      
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Dashboard" />
        <Tab label="Public View" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Property</InputLabel>
              <Select
                value={selectedProperty}
                label="Property"
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                {properties.map(prop => (
                  <MenuItem key={prop} value={prop}>{prop}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          <Paper sx={{ p: 2, mb: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Average Ratings</Typography>
            <BarChart width={800} height={250} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="property" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageRating" fill="#8884d8" />
            </BarChart>
          </Paper>

          <Paper sx={{ p: 2, height: 500 }}>
            <DataGrid
              rows={Array.isArray(filteredReviews) ? filteredReviews : []}
              columns={columns}
              loading={!reviews || !Array.isArray(reviews)}
              pageSize={10}
              rowsPerPageOptions={[10]}
              getRowId={(row) => row.id || Math.random().toString()}
            />
          </Paper>
        </>
      )}

      {tabValue === 1 && (
        <Paper sx={{ 
          p: 6, 
          mb: 4, 
          bgcolor: 'background.paper',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          border: 0
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              fontWeight: 600,
              color: '#333333',
              fontSize: '1.5rem'
            }}
          >
            Guest Reviews
          </Typography>
          
          {reviews.filter(r => r.approved).length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {reviews.filter(r => r.approved).map(review => (
                <Paper 
                  key={review.id} 
                  sx={{ 
                    p: 4,
                    borderRadius: '12px',
                    bgcolor: '#F1F3EE'
                  }}
                >
                  {/* Review Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      bgcolor: '#284E4C', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#FFFFFF" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 600,
                        color: '#333333',
                        fontSize: '1.125rem'
                      }}
                    >
                      {review.guest}
                    </Typography>
                  </Box>
                  
                  {/* Rating and Property */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: '6px'
                    }}>
                      <Typography sx={{ fontWeight: 600, color: '#284E4C' }}>
                        {review.rating}/10
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#5C5C5A', fontSize: '0.875rem' }}>
                      {review.property}
                    </Typography>
                  </Box>
                  
                  {/* Review Content */}
                  <Typography sx={{ 
                    mb: 2, 
                    color: '#333333',
                    lineHeight: 1.6
                  }}>
                    {review.content}
                  </Typography>
                  
                  {/* Date */}
                  <Typography sx={{ 
                    color: '#5C5C5A',
                    fontSize: '0.875rem'
                  }}>
                    Reviewed on {review.date}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: '#5C5C5A', fontStyle: 'italic' }}>
              No approved reviews to display yet.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default Dashboard;