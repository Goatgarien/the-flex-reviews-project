module.exports = [
  {
    id: 7453,
    type: "host-to-guest",
    status: "published",
    rating: null,
    publicReview: "Shane and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2020-08-21T22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B N1 A - 29 Shoreditch Heights"
  },
  
  // Original mixed review
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    rating: 4.5,
    publicReview: "Great location but the wifi was spotty",
    reviewCategory: [
      { category: "location", rating: 9 },
      { category: "amenities", rating: 6 },
      { category: "value", rating: 8 }
    ],
    submittedAt: "2020-09-15T10:30:00",
    guestName: "Alex Johnson",
    listingName: "1A N2 B - 30 Shoreditch Heights"
  },

  // Negative review (wouldn't approve)
  {
    id: 7455,
    type: "guest-to-host",
    status: "pending",
    rating: 2,
    publicReview: "The apartment was dirty and smelled bad. Would not recommend.",
    reviewCategory: [
      { category: "cleanliness", rating: 1 },
      { category: "comfort", rating: 3 },
      { category: "value", rating: 2 }
    ],
    submittedAt: "2020-10-05T08:15:00",
    guestName: "Taylor Smith",
    listingName: "2B N1 A - 29 Shoreditch Heights" // Same property as first review
  },

  // Positive review for same property
  {
    id: 7456,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Perfect stay! The apartment was spotless and in a great location.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 9 }
    ],
    submittedAt: "2020-10-12T14:20:00",
    guestName: "Jordan Lee",
    listingName: "2B N1 A - 29 Shoreditch Heights"
  },

  // Mixed review with constructive feedback
  {
    id: 7457,
    type: "guest-to-host",
    status: "published",
    rating: 3.5,
    publicReview: "Good overall but the kitchen equipment was lacking basic utensils.",
    reviewCategory: [
      { category: "amenities", rating: 4 },
      { category: "communication", rating: 8 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2020-11-03T09:45:00",
    guestName: "Morgan Taylor",
    listingName: "3C N3 - 45 Brick Lane"
  },

  // Extremely negative review
  {
    id: 7458,
    type: "guest-to-host",
    status: "pending",
    rating: 1,
    publicReview: "Worst experience ever. The heating didn't work and host was unresponsive.",
    reviewCategory: [
      { category: "communication", rating: 1 },
      { category: "amenities", rating: 1 },
      { category: "comfort", rating: 1 }
    ],
    submittedAt: "2020-11-18T19:30:00",
    guestName: "Casey Brown",
    listingName: "1A N2 B - 30 Shoreditch Heights"
  },

  // Short positive review
  {
    id: 7459,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Lovely place, would stay again!",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "location", rating: 9 },
      { category: "value", rating: 9 }
    ],
    submittedAt: "2020-12-01T11:10:00",
    guestName: "Riley Wilson",
    listingName: "4D N4 - 12 Spitalfields"
  },

  // Detailed positive review
  {
    id: 7460,
    type: "guest-to-host",
    status: "published",
    rating: 4.8,
    publicReview: "The apartment had everything we needed for our month-long stay. Comfortable bed, good workspace, and excellent location near transit. Only minor complaint was street noise at night.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "location", rating: 10 },
      { category: "comfort", rating: 8 },
      { category: "amenities", rating: 9 }
    ],
    submittedAt: "2021-01-15T16:45:00",
    guestName: "Jamie Chen",
    listingName: "2B N1 A - 29 Shoreditch Heights"
  }
];