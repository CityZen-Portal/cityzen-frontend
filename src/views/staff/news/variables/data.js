export const newsData = [
  {
    id: 1,
    title: 'Road Closure on Main Street',
    content: 'Main Street will be closed for maintenance from July 20 to July 25.',
    date: '2023-07-14',
    isBreaking: true,
    isTrending: false,
    author: 'City Works Department',
    votes: 24,
    comments: [
      { id: 1, author: 'John Doe', content: 'Will there be alternative routes?', date: '2023-07-15', votes: 5 },
      { id: 2, author: 'Jane Smith', content: 'Thanks for the heads up!', date: '2023-07-16', votes: 3 }
    ]
  },
  {
    id: 2,
    title: 'New Community Center Opening',
    content: 'The new community center will open its doors next month with free activities for all residents.',
    date: '2023-07-10',
    isBreaking: false,
    isTrending: true,
    author: 'Parks & Recreation',
    votes: 42,
    comments: [
      { id: 1, author: 'Alice Johnson', content: 'Looking forward to the yoga classes!', date: '2023-07-11', votes: 7 }
    ]
  },
  {
    id: 3,
    title: 'Water Conservation Notice',
    content: 'Due to drought conditions, residents are asked to limit water usage for the next 30 days.',
    date: '2023-07-05',
    isBreaking: false,
    isTrending: false,
    author: 'Water Department',
    votes: 18,
    comments: []
  },
  {
    id: 4,
    title: 'New Traffic Light Installation',
    content: 'A new traffic light will be installed at the intersection of Oak Avenue and Pine Street to improve safety.',
    date: '2023-07-18',
    isBreaking: false,
    isTrending: true,
    author: 'Traffic Engineering',
    votes: 31,
    comments: [
      { id: 1, author: 'Mike Wilson', content: 'Finally! That intersection was dangerous.', date: '2023-07-18', votes: 8 },
      { id: 2, author: 'Sarah Chen', content: 'When will construction begin?', date: '2023-07-19', votes: 2 },
      { id: 3, author: 'David Brown', content: 'Great news for pedestrian safety!', date: '2023-07-19', votes: 4 }
    ]
  },
  {
    id: 5,
    title: 'Summer Festival Cancelled',
    content: 'The annual Summer Music Festival has been cancelled due to severe weather warnings and safety concerns.',
    date: '2023-07-20',
    isBreaking: true,
    isTrending: true,
    author: 'Event Management',
    votes: 67,
    comments: [
      { id: 1, author: 'Emma Davis', content: 'So disappointed! Will there be refunds?', date: '2023-07-20', votes: 12 },
      { id: 2, author: 'Tom Miller', content: 'Safety first, good decision.', date: '2023-07-20', votes: 9 },
      { id: 3, author: 'Lisa Garcia', content: 'Any chance of rescheduling?', date: '2023-07-21', votes: 6 }
    ]
  },
  {
    id: 6,
    title: 'Public Library Extended Hours',
    content: 'The Central Library will now be open until 9 PM on weekdays and 6 PM on weekends starting August 1st.',
    date: '2023-07-12',
    isBreaking: false,
    isTrending: false,
    author: 'Library Services',
    votes: 29,
    comments: [
      { id: 1, author: 'Rachel Kim', content: 'Perfect for students like me!', date: '2023-07-13', votes: 5 },
      { id: 2, author: 'George Taylor', content: 'More study space availability too?', date: '2023-07-14', votes: 3 }
    ]
  },
  {
    id: 7,
    title: 'Emergency Services Drill',
    content: 'A city-wide emergency response drill will take place tomorrow at 10 AM. Residents may hear sirens and see emergency vehicles.',
    date: '2023-07-21',
    isBreaking: true,
    isTrending: false,
    author: 'Emergency Management',
    votes: 15,
    comments: [
      { id: 1, author: 'Chris Anderson', content: 'Thanks for the warning!', date: '2023-07-21', votes: 2 }
    ]
  },
  {
    id: 8,
    title: 'Free WiFi in Downtown Area',
    content: 'The city has launched free public WiFi service in the downtown core, available 24/7 for all residents and visitors.',
    date: '2023-07-08',
    isBreaking: false,
    isTrending: true,
    author: 'IT Department',
    votes: 38,
    comments: [
      { id: 1, author: 'Kevin Lee', content: 'Great for remote workers!', date: '2023-07-09', votes: 6 },
      { id: 2, author: 'Nicole White', content: 'What about data security?', date: '2023-07-10', votes: 4 },
      { id: 3, author: 'Mark Thompson', content: 'Connection speed is pretty good so far.', date: '2023-07-11', votes: 3 }
    ]
  },
  {
    id: 9,
    title: 'Parking Meter Rate Increase',
    content: 'Downtown parking meter rates will increase from $2 to $3 per hour starting September 1st to fund street maintenance.',
    date: '2023-07-17',
    isBreaking: false,
    isTrending: false,
    author: 'Parking Authority',
    votes: 8,
    comments: [
      { id: 1, author: 'Janet Rodriguez', content: 'Another tax on working people!', date: '2023-07-17', votes: 7 },
      { id: 2, author: 'Paul Johnson', content: 'Streets do need better maintenance though.', date: '2023-07-18', votes: 1 }
    ]
  },
  {
    id: 10,
    title: 'Dog Park Grand Opening',
    content: 'The new Riverside Dog Park will officially open this Saturday with a ribbon-cutting ceremony at 11 AM.',
    date: '2023-07-19',
    isBreaking: false,
    isTrending: true,
    author: 'Parks & Recreation',
    votes: 45,
    comments: [
      { id: 1, author: 'Michelle Clark', content: 'My golden retriever will love this!', date: '2023-07-19', votes: 8 },
      { id: 2, author: 'Ryan Murphy', content: 'Are there separate areas for small and large dogs?', date: '2023-07-20', votes: 5 },
      { id: 3, author: 'Sandra Lewis', content: 'Finally! Been waiting for this for years.', date: '2023-07-20', votes: 6 }
    ]
  },
  {
    id: 11,
    title: 'School Zone Speed Limit Reduced',
    content: 'Speed limits in all school zones have been reduced from 25 mph to 20 mph to enhance student safety.',
    date: '2023-07-16',
    isBreaking: false,
    isTrending: false,
    author: 'School District',
    votes: 33,
    comments: [
      { id: 1, author: 'Maria Gonzalez', content: 'Good move for our kids safety!', date: '2023-07-16', votes: 9 },
      { id: 2, author: 'Steve Adams', content: 'Will there be more enforcement?', date: '2023-07-17', votes: 4 }
    ]
  },
  {
    id: 12,
    title: 'Power Outage Scheduled Maintenance',
    content: 'Rolling power outages will occur between 2 AM and 6 AM on July 25th for grid maintenance. Affected areas will be notified separately.',
    date: '2023-07-22',
    isBreaking: true,
    isTrending: false,
    author: 'Utility Company',
    votes: 19,
    comments: [
      { id: 1, author: 'Amy Foster', content: 'Will this affect the hospital district?', date: '2023-07-22', votes: 3 },
      { id: 2, author: 'Brian Scott', content: 'Good thing its during low usage hours.', date: '2023-07-22', votes: 2 }
    ]
  }
];