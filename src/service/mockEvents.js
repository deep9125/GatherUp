const initialEvents = [
  { 
    id: 1, 
    name: "Annual Tech Conference", 
    date: '2025-09-08T12:00:00Z', 
    description: "A gathering of innovators, developers, and tech leaders to discuss the future of technology.",
    managerId: "mng12", 
    capacity: 500,
    ticketsSold: 412,
    ticketPrice: 99
  },
  { 
    id: 2, 
    name: "Global Music Festival 2025", 
    date: "2025-10-05", 
    description: "A 3-day live music event featuring artists from around the world.",
    managerId: "other-mgr-456",
    capacity: 10000,
    ticketsSold: 8500,
    ticketPrice: 250
  },
  { 
    id: 3, 
    name: "Startup Pitch Day", 
    date: "2025-11-18", 
    description: "Upcoming startups showcase their business ideas to investors.",
    managerId: "mgr123",
    capacity: 150,
    ticketsSold: 145,
    ticketPrice: 25
  },
  { 
    id: 4, 
    name: "City Food & Wine Fair", 
    date: "2025-08-22", 
    description: "Taste the best gourmet food and wine from local and international chefs.",
    managerId: "mgr123",
    capacity: 2000,
    ticketsSold: 1745,
    ticketPrice: 35
  },
  { 
    id: 5, 
    name: "International Art Expo", 
    date: "2025-09-30", 
    description: "An exhibition of contemporary art, sculpture, and installations from over 40 countries.",
    managerId: "other-mgr-789",
    capacity: 1500,
    ticketsSold: 1380,
    ticketPrice: 75
  },
  { 
    id: 6, 
    name: "Marathon for Charity", 
    date: "2025-10-15", 
    description: "A city-wide marathon to raise funds for children's education.",
    managerId: "mgr123",
    capacity: 5000,
    ticketsSold: 4810,
    ticketPrice: 40
  },
  { 
    id: 7, 
    name: "AI & Robotics Summit", 
    date: "2025-11-02", 
    description: "Experts and researchers gather to discuss the latest in AI and robotics.",
    managerId: "other-mgr-456",
    capacity: 750,
    ticketsSold: 650,
    ticketPrice: 150
  },
  { 
    id: 8, 
    name: "Winter Wonderland Market", 
    date: "2025-12-05", 
    description: "Holiday-themed shopping experience with gifts, crafts, and food stalls.",
    managerId: "mgr123",
    capacity: 3000,
    ticketsSold: 2950,
    ticketPrice: 10
  },
  { 
    id: 9, 
    name: "Film Premiere: Future Vision", 
    date: "2025-09-25", 
    description: "Exclusive red-carpet premiere of the sci-fi blockbuster 'Future Vision'.",
    managerId: "other-mgr-789",
    capacity: 300,
    ticketsSold: 300,
    ticketPrice: 120
  },
  { 
    id: 10, 
    name: "Blockchain & Crypto Forum", 
    date: "2025-10-28", 
    description: "Industry leaders discuss the impact and future of blockchain technology.",
    managerId: "mgr123",
    capacity: 400,
    ticketsSold: 320,
    ticketPrice: 200
  },
  { 
    id: 11, 
    name: "Science & Space Exploration Expo", 
    date: "2025-11-12", 
    description: "NASA scientists and space engineers showcase the latest in space travel tech.",
    managerId: "other-mgr-456",
    capacity: 2500,
    ticketsSold: 1800,
    ticketPrice: 50
  },
  { 
    id: 12, 
    name: "Spring Fashion Week", 
    date: "2025-09-18", 
    description: "Runway shows featuring designers from Paris, Milan, and New York.",
    managerId: "other-mgr-789",
    capacity: 1000,
    ticketsSold: 950,
    ticketPrice: 300
  },
  { 
    id: 13, 
    name: "International Jazz Festival", 
    date: "2025-08-30", 
    description: "Enjoy smooth jazz performances from renowned international artists.",
    managerId: "mgr123",
    capacity: 1200,
    ticketsSold: 1100,
    ticketPrice: 60
  },
  { 
    id: 14, 
    name: "Environmental Sustainability Conference", 
    date: "2025-10-20", 
    description: "Discussions on climate change, renewable energy, and green technologies.",
    managerId: "mgr123",
    capacity: 300,
    ticketsSold: 250,
    ticketPrice: 80
  },
  { 
    id: 15, 
    name: "Literature & Poetry Gathering", 
    date: "2025-09-10", 
    description: "Writers and poets come together to share and celebrate their work.",
    managerId: "other-mgr-456",
    capacity: 200,
    ticketsSold: 180,
    ticketPrice: 15
  },
  { 
    id: 16, 
    name: "Gourmet Chocolate Expo", 
    date: "2025-11-05", 
    description: "Taste and learn about the finest chocolates from around the world.",
    managerId: "mgr123",
    capacity: 800,
    ticketsSold: 780,
    ticketPrice: 45
  },
  { 
    id: 17, 
    name: "International Film Festival", 
    date: "2025-12-10", 
    description: "A showcase of independent films and documentaries from various countries.",
    managerId: "other-mgr-789",
    capacity: 5000,
    ticketsSold: 4500,
    ticketPrice: 30
  },
  { 
    id: 18, 
    name: "Tech Startup Bootcamp", 
    date: "2025-08-15", 
    description: "An intensive program for early-stage startups to accelerate growth.",
    managerId: "mgr123",
    capacity: 50,
    ticketsSold: 48,
    ticketPrice: 500
  },
  { 
    id: 19, 
    name: "Comic-Con 2025", 
    date: "2025-09-28", 
    description: "Celebrating comics, movies, and pop culture with cosplay and panels.",
    managerId: "other-mgr-456",
    capacity: 20000,
    ticketsSold: 19850,
    ticketPrice: 85
  },
  { 
    id: 20, 
    name: "Classical Music Concert", 
    date: "2025-10-08", 
    description: "A night of beautiful orchestral and chamber music performances.",
    managerId: "mgr123",
    capacity: 600,
    ticketsSold: 540,
    ticketPrice: 70
  },
  { 
    id: 21, 
    name: "International Dance Festival", 
    date: "2025-11-22", 
    description: "Featuring traditional and contemporary dance troupes from around the globe.",
    managerId: "other-mgr-789",
    capacity: 1500,
    ticketsSold: 1200,
    ticketPrice: 55
  },
  { 
    id: 22, 
    name: "Virtual Reality Expo", 
    date: "2025-09-14", 
    description: "Explore the latest VR technologies, games, and immersive experiences.",
    managerId: "mgr123",
    capacity: 1000,
    ticketsSold: 880,
    ticketPrice: 65
  },
  { 
    id: 23, 
    name: "Food Truck Carnival", 
    date: "2025-08-27", 
    description: "A fun day with delicious street food from a variety of vendors.",
    managerId: "other-mgr-456",
    capacity: 5000,
    ticketsSold: 4900,
    ticketPrice: 5
  },
  { 
    id: 24, 
    name: "Entrepreneurship Workshop", 
    date: "2025-10-12", 
    description: "Learn key business skills and strategies from successful entrepreneurs.",
    managerId: "mgr123",
    capacity: 100,
    ticketsSold: 95,
    ticketPrice: 250
  },
  { 
    id: 25, 
    name: "Photography Exhibition", 
    date: "2025-11-30", 
    description: "A display of stunning photographs capturing moments from around the world.",
    managerId: "other-mgr-789",
    capacity: 500,
    ticketsSold: 400,
    ticketPrice: 20
  }
];

export default initialEvents;