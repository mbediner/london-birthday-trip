const hotelAddress = `Holiday Inn Express London - Victoria
106-110 Belgrave Road
London SW1V 2BJ
United Kingdom
Phone: +44 20 7630 8888`;

const mapQueries = {
  "Hotel": "Holiday Inn Express London - Victoria, 106-110 Belgrave Road, London SW1V 2BJ",
  "RDU Airport": "Raleigh-Durham International Airport",
  "Boston Logan Airport": "Boston Logan International Airport",
  "London Heathrow Airport": "London Heathrow Airport",
  "JFK Airport": "John F. Kennedy International Airport",
  "U.S. Embassy London": "U.S. Embassy London, 33 Nine Elms Lane, London SW11 7US",
  "Tachbrook Street Market": "Tachbrook Street Market, Pimlico",
  "Victoria Station": "Victoria Station Buckingham Palace Road entrance",
  "London Eye": "London Eye, London",
  "Westminster Bridge": "Westminster Bridge, London",
  "Big Ben": "Big Ben, London",
  "Parliament Square": "Parliament Square, London",
  "Westminster Abbey": "Westminster Abbey, London",
  "Southbank Centre": "Southbank Centre Royal Festival Hall, London",
  "Gabriel's Wharf": "Gabriel's Wharf, London",
  "Oxo Tower": "Oxo Tower, London",
  "Pimlico Station": "Pimlico Station, Bessborough Street, London SW1V 2JA",
  "Tower Hill Station": "Tower Hill Station, London",
  "Tower of London": "Tower of London",
  "Tower Bridge": "Tower Bridge, London",
  "Borough Market": "Borough Market, London",
  "London Bridge Station": "London Bridge Underground Station, London",
  "Leicester Square Station": "Leicester Square Station, London",
  "Covent Garden": "Covent Garden, London",
  "Seven Dials": "Seven Dials, London",
  "Neal's Yard": "Neal's Yard, Covent Garden, London",
  "Soho": "Soho, London",
  "Carnaby Street": "Carnaby Street, London",
  "Chinatown": "Chinatown Gate, London",
  "Buckingham Palace": "Buckingham Palace, London",
  "St. James's Park": "St James's Park, London",
  "The Mall": "The Mall, London",
  "Trafalgar Square": "Trafalgar Square, London",
  "Camden Market": "Camden Market, London",
  "Camden Town Station": "Camden Town Station, London",
  "Regent's Canal": "Regent's Canal Camden Lock, London"
};

const routeShortcuts = [
  {
    label: "Heathrow to hotel",
    from: "London Heathrow Airport",
    to: "Hotel",
    mode: "transit",
    note: "Use this after landing. If tired or bags are awkward, switch to Uber/FREENOW/black cab."
  },
  {
    label: "Hotel to Heathrow",
    from: "Hotel",
    to: "London Heathrow Airport",
    mode: "driving",
    note: "Departure morning backup. Leave around 7:00-7:15 AM for the 11:55 AM flight."
  },
  {
    label: "Hotel to Tower Hill",
    from: "Hotel",
    to: "Tower Hill Station",
    mode: "transit",
    note: "Day 2 Tube move for Tower of London and Tower Bridge."
  },
  {
    label: "Tower Bridge to Borough Market",
    from: "Tower Bridge",
    to: "Borough Market",
    mode: "walking",
    note: "Easy Thames-side walk before lunch."
  },
  {
    label: "Borough Market to Covent Garden",
    from: "Borough Market",
    to: "Covent Garden",
    mode: "transit",
    note: "Use after lunch for the West End walk."
  },
  {
    label: "West End back to hotel",
    from: "Chinatown",
    to: "Hotel",
    mode: "driving",
    note: "Use Uber/FREENOW/black cab if tired, late, or unsure."
  },
  {
    label: "Hotel to Camden Market",
    from: "Hotel",
    to: "Camden Market",
    mode: "transit",
    note: "Day 3 route. Keep Camden as a daytime stop."
  },
  {
    label: "Central London to U.S. Embassy",
    from: "Victoria Station",
    to: "U.S. Embassy London",
    mode: "transit",
    note: "Backup resource if official U.S. help is needed."
  }
];

const days = [
  {
    id: "day-1",
    date: "Friday, June 26",
    title: "Victoria, Westminster and South Bank",
    image: "assets/london_eye.jpg",
    imageWebp: "assets/london_eye.webp",
    area: "Victoria / Westminster / South Bank",
    transport: "Airport transfer + bag drop + walking + Big Bus + Uber home",
    food: "Casual lunch near hotel; casual dinner at Southbank Centre",
    tickets: "Big Bus and London Eye",
    night: "Uber directly back to the hotel",
    steps: [
      ["Arrive and get to the hotel", "Land at Heathrow at 6:30 AM BST. After immigration and bags, go straight to Holiday Inn Express London - Victoria. Check-in is later, so the goal is to drop bags before sightseeing.", ["London Heathrow Airport", "Hotel"]],
      ["Drop bags before check-in", "Ask the front desk to store luggage until check-in. Keep passports, wallets, phones, chargers, tickets, and medication with you.", ["Hotel"]],
      ["Eat near the hotel", "After the bags are stored, walk to Tachbrook Street / Warwick Way for an easy cafe or casual restaurant.", ["Tachbrook Street Market"]],
      ["Start the bus loop", "Walk to Victoria Station / Buckingham Palace Road entrance. Board the Hop-On / Hop-Off Big Bus that matches your ticket.", ["Victoria Station"]],
      ["Sightseeing loop", "Stay on the bus for the main sightseeing loop through Buckingham Palace, Trafalgar Square, Westminster, Big Ben, London Eye, and South Bank.", []],
      ["Westminster photos", "Get off near London Eye / Westminster Bridge. Walk London Eye to Westminster Bridge to Big Ben photos to Parliament Square to Westminster Abbey exterior.", ["London Eye", "Westminster Bridge", "Big Ben", "Parliament Square", "Westminster Abbey"]],
      ["London Eye", "Ride the London Eye. Aim for a timed ticket around 5:30 PM or 6:00 PM.", ["London Eye"]],
      ["Dinner and river walk", "Walk along Queen's Walk. Eat around Southbank Centre / Royal Festival Hall. If energy is good, continue toward Gabriel's Wharf or Oxo Tower.", ["Southbank Centre", "Gabriel's Wharf", "Oxo Tower"]],
      ["Go home", "Take Uber directly back to the hotel. Night 1 return is Uber or black cab, not the Tube.", ["Hotel"]]
    ],
    photo: "Big Ben from Westminster Bridge, London Eye from Westminster Bridge, Queen's Walk river views.",
    tired: "If tired after the London Eye, skip the longer Queen's Walk and eat near Southbank Centre, then Uber directly back.",
    rain: "Still do the London Eye if tickets are booked, then use Southbank Centre / Royal Festival Hall for food and indoor cover."
  },
  {
    id: "day-2",
    date: "Saturday, June 27",
    title: "Tower Bridge, Borough Market and West End",
    image: "assets/tower_bridge.jpg",
    imageWebp: "assets/tower_bridge.webp",
    area: "Tower Hill / Borough Market / Covent Garden / Soho",
    transport: "Tube + walking; Uber or black cab back if tired",
    food: "Borough Market lunch; casual dinner in Soho, Chinatown, or Covent Garden",
    tickets: "No tickets planned in advance",
    night: "Tube if early and comfortable; Uber or black cab if tired",
    steps: [
      ["Breakfast", "Start with breakfast at the hotel.", []],
      ["Tube to Tower Hill", "Walk to Pimlico Station. Take Pimlico to Victoria, change at Victoria, then Victoria to Tower Hill. Confirm the easiest route that morning.", ["Pimlico Station", "Tower Hill Station"]],
      ["Tower area", "Walk around the Tower of London area. No need to buy tickets ahead; enjoy the outside and take photos.", ["Tower of London"]],
      ["Tower Bridge", "Walk to Tower Bridge, take photos outside, and walk across for the views. Only buy tickets if you decide in the moment.", ["Tower Bridge"]],
      ["Borough Market lunch", "Walk along the south side of the Thames toward London Bridge / Borough Market. Saturday will be crowded, so walk around first and pick food casually.", ["Borough Market", "London Bridge Station"]],
      ["West End exploring", "Take the Northern line from London Bridge to Leicester Square. Walk Leicester Square to Covent Garden to Seven Dials to Neal's Yard to Soho to Carnaby Street to Chinatown.", ["Leicester Square Station", "Covent Garden", "Seven Dials", "Neal's Yard", "Soho", "Carnaby Street", "Chinatown"]],
      ["Dinner and return", "Dinner in Soho, Chinatown, or Covent Garden. Use the Tube if it is early and comfortable; use Uber or black cab if tired, late, or pickup is easier.", ["Hotel"]]
    ],
    photo: "Tower Bridge from the south side of the Thames, Neal's Yard, Chinatown gate, Carnaby Street.",
    tired: "If tired after Borough Market, skip the full Soho / Carnaby Street walk and go straight to Covent Garden and Neal's Yard.",
    rain: "Spend more time around Borough Market, Covent Garden, covered shops, cafes, and Chinatown."
  },
  {
    id: "day-3",
    date: "Sunday, June 28",
    title: "Palace Morning and Camden Adventure",
    image: "assets/camden_market.jpg",
    imageWebp: "assets/camden_market.webp",
    area: "Buckingham Palace / St. James's Park / Camden",
    transport: "Walking + Tube; Uber or Tube back depending on energy",
    food: "Camden Market lunch; final dinner in Covent Garden, Soho, or near the hotel",
    tickets: "No fixed tickets",
    night: "Keep Camden as a daytime stop; return central before final dinner",
    steps: [
      ["Breakfast", "Start with breakfast at the hotel.", []],
      ["Palace photos", "Walk or take short transit to Buckingham Palace. See the exterior and gates.", ["Buckingham Palace"]],
      ["Park and Mall walk", "Walk through St. James's Park, then walk The Mall toward Trafalgar Square.", ["St. James's Park", "The Mall", "Trafalgar Square"]],
      ["Tube to Camden", "From central London, take the Tube to Camden Town. Use Google Maps or TfL Go for the best route that morning.", ["Camden Town Station"]],
      ["Camden Market lunch", "Make Camden Market the daytime anchor. Get lunch and explore stalls, shops, signs, and street food.", ["Camden Market"]],
      ["Regent's Canal", "If weather and energy are good, take a short Regent's Canal walk near Camden Lock.", ["Regent's Canal"]],
      ["Final dinner", "Return toward central London for final dinner in Covent Garden, Soho, or near the hotel. Use Uber or the Tube depending on timing and energy.", ["Covent Garden", "Soho", "Hotel"]]
    ],
    photo: "Buckingham Palace gates, Camden Market signs, Regent's Canal near Camden Lock.",
    tired: "Skip Regent's Canal and spend only 1 to 2 hours at Camden Market before returning toward the hotel.",
    rain: "Shorten the park walk and spend more time in Camden Market covered areas, cafes, and shops."
  }
];

const flights = [
  {
    day: "Thursday, June 25",
    dateQuery: "June 25 2026",
    time: "2:34 PM EDT",
    route: "RDU -> BOS",
    number: "2184",
    airline: "JetBlue B6 2184",
    confirmation: "KDHSOU",
    terminal: "Depart Terminal 2",
    arrive: "Arrive 4:34 PM EDT"
  },
  {
    day: "Thursday, June 25",
    dateQuery: "June 25 2026",
    time: "6:39 PM EDT",
    route: "BOS -> LHR",
    number: "1620",
    airline: "JetBlue B6 1620",
    confirmation: "KDHSOU",
    terminal: "Depart Terminal C",
    arrive: "Arrive Friday, June 26 at 6:30 AM BST"
  },
  {
    day: "Monday, June 29",
    dateQuery: "June 29 2026",
    time: "11:55 AM BST",
    route: "LHR -> JFK",
    number: "20",
    airline: "JetBlue B6 20",
    confirmation: "KDHSOU",
    terminal: "Depart Terminal 2",
    arrive: "Arrive 3:25 PM EDT"
  },
  {
    day: "Monday, June 29",
    dateQuery: "June 29 2026",
    time: "6:30 PM EDT",
    route: "JFK -> RDU",
    number: "585",
    airline: "JetBlue B6 585",
    confirmation: "KDHSOU",
    terminal: "Depart Terminal 5",
    arrive: "Arrive 8:33 PM EDT"
  }
];

const airportPlans = [
  {
    title: "Live flight checks",
    bullets: [
      "Free option: tap Google Status on each flight. Google usually shows a flight-status card near departure day.",
      "Use the JetBlue app first because airline status and gate changes are the source of truth.",
      "Use the tracker buttons below for a second opinion when the flight is close to departure.",
      "FlightAware generally shows flights currently flying, recently flown, or scheduled soon.",
      "If trackers disagree, trust JetBlue, airport screens, and gate agents."
    ]
  },
  {
    title: "Arrival: Heathrow to hotel",
    bullets: [
      "Land at Heathrow at 6:30 AM BST on Friday, June 26.",
      "Plan 60-90 minutes for immigration, bathrooms, bags, and getting oriented.",
      "Plan 60-90 minutes from Heathrow to the hotel once you start moving.",
      "Realistic hotel arrival target: about 8:45-10:00 AM.",
      "Check-in is later, so ask the front desk to store luggage."
    ]
  },
  {
    title: "Best arrival route with bags",
    bullets: [
      "Easiest: Uber, FREENOW, or official black cab from Heathrow to the hotel.",
      "Train/taxi option: Elizabeth line to Paddington, then Uber or black cab to the hotel.",
      "TfL lists Elizabeth line Paddington-Heathrow travel at about 28 minutes, but transfers and bags add time.",
      "Avoid planning anything timed before late morning."
    ]
  },
  {
    title: "Departure: hotel to Heathrow",
    bullets: [
      "Flight leaves Heathrow at 11:55 AM BST on Monday, June 29.",
      "Heathrow recommends arriving 3 hours before international flights.",
      "Target airport arrival: 8:55 AM.",
      "Leave the hotel around 7:00-7:15 AM to protect the morning.",
      "Use the JetBlue app that morning to reconfirm terminal and flight status."
    ]
  },
  {
    title: "Departure route",
    bullets: [
      "Easiest: Uber, FREENOW, or official black cab straight to Heathrow Terminal 2.",
      "Train/taxi option: taxi/Uber to Paddington, then Elizabeth line or Heathrow Express to Heathrow.",
      "Eat early or bring breakfast snacks; this is not a slow hotel morning.",
      "Keep passports and flight screenshots out before leaving the hotel."
    ]
  }
];

const departureGuardrails = [
  {
    title: "Outbound: leave Raleigh safely",
    date: "Thursday, June 25",
    anchor: "B6 2184 RDU -> BOS, 2:34 PM EDT",
    bullets: [
      "Set phone alarms for 10:00 AM and 11:00 AM.",
      "Be at RDU by 12:30 PM for the 2:34 PM departure.",
      "JetBlue confirmation is KDHSOU. Check the JetBlue app before leaving home.",
      "Use airport screens and gate agents as the source of truth if the website, Google, and JetBlue disagree."
    ]
  },
  {
    title: "London arrival: bags first",
    date: "Friday, June 26",
    anchor: "B6 1620 BOS -> LHR, arrives 6:30 AM BST",
    bullets: [
      "After immigration and bags, go to the hotel before sightseeing.",
      "Ask Holiday Inn Express London - Victoria to store luggage because check-in is later.",
      "Keep passports, cards, chargers, medicine, and tickets with you.",
      "Do not book a timed London activity before late morning."
    ]
  },
  {
    title: "Return: protect Heathrow morning",
    date: "Monday, June 29",
    anchor: "B6 20 LHR -> JFK, 11:55 AM BST",
    bullets: [
      "Set phone alarms for 6:00 AM and 6:30 AM London time.",
      "Leave the hotel around 7:00-7:15 AM.",
      "Target Heathrow arrival is 8:55 AM.",
      "Use JetBlue app first, then Google Status and the site tracker as backups."
    ]
  },
  {
    title: "Connection: JFK to Raleigh",
    date: "Monday, June 29",
    anchor: "B6 585 JFK -> RDU, 6:30 PM EDT",
    bullets: [
      "After landing at JFK, stay airside unless JetBlue or airport staff says otherwise.",
      "Find the next gate before food.",
      "If delayed or confused, talk to a JetBlue gate agent immediately.",
      "Keep parent group text updated at JFK."
    ]
  }
];

const nextMoveTimeline = [
  {
    starts: "2026-06-01T00:00:00-04:00",
    ends: "2026-06-25T10:00:00-04:00",
    label: "Before departure",
    title: "Finish the phone setup",
    message: "Install JetBlue, TfL Go, Uber/FREENOW, ntfy, and save this site to the phone home screen.",
    detail: "Confirm passports, UK ETA, consent letter, hotel screenshot, and JetBlue confirmation KDHSOU are saved on both phones.",
    actions: [
      ["Open checklist", "#wallet"],
      ["Phone alerts", "#phone-push"]
    ]
  },
  {
    starts: "2026-06-25T10:00:00-04:00",
    ends: "2026-06-25T12:30:00-04:00",
    label: "Outbound morning",
    title: "Get to RDU",
    message: "Leave enough margin to be at RDU by 12:30 PM EDT for B6 2184.",
    detail: "Check JetBlue first, then use the site tracker and Google Status as backup.",
    actions: [
      ["RDU map", "map:RDU Airport"],
      ["Flights", "#flights"]
    ]
  },
  {
    starts: "2026-06-25T12:30:00-04:00",
    ends: "2026-06-25T14:34:00-04:00",
    label: "RDU airport",
    title: "Find the gate before food",
    message: "Use the JetBlue app and airport screens. Be at the gate early for B6 2184.",
    detail: "If anything disagrees, ask a JetBlue gate agent and update the parent group text.",
    actions: [
      ["JetBlue", "https://www.jetblue.com/flight-tracker-and-status"],
      ["Flights", "#flights"]
    ]
  },
  {
    starts: "2026-06-25T16:34:00-04:00",
    ends: "2026-06-25T18:39:00-04:00",
    label: "Boston connection",
    title: "Find the London gate first",
    message: "At BOS, find the B6 1620 gate before food or wandering.",
    detail: "The connection is planned at 2h5m. Stay airside unless JetBlue staff tells you otherwise.",
    actions: [
      ["Flight status", "#flights"],
      ["JetBlue", "https://www.jetblue.com/flight-tracker-and-status"]
    ]
  },
  {
    starts: "2026-06-26T06:30:00+01:00",
    ends: "2026-06-26T10:00:00+01:00",
    label: "London arrival",
    title: "Go to the hotel and drop bags",
    message: "After immigration and bags, go straight to Holiday Inn Express London - Victoria.",
    detail: "Check-in is later. Ask the front desk to store luggage, then keep passports, cards, chargers, tickets, and medicine with you.",
    actions: [
      ["Hotel map", "map:Hotel"],
      ["Tube route", "#tube"]
    ]
  },
  {
    starts: "2026-06-26T10:00:00+01:00",
    ends: "2026-06-26T23:00:00+01:00",
    label: "Day 1",
    title: "Victoria, Westminster, South Bank",
    message: "Easy food near the hotel, Big Bus loop, Westminster photos, London Eye, then Uber back.",
    detail: "Night 1 return is Uber or black cab, not the Tube.",
    actions: [
      ["Day 1 plan", "#day-1"],
      ["Hotel map", "map:Hotel"]
    ]
  },
  {
    starts: "2026-06-27T07:00:00+01:00",
    ends: "2026-06-27T23:00:00+01:00",
    label: "Day 2",
    title: "Tower Bridge, Borough Market, West End",
    message: "Tube to Tower Hill, walk Tower Bridge, Borough Market lunch, then West End exploring.",
    detail: "If tired or it is late, use Uber/FREENOW/black cab back to the hotel.",
    actions: [
      ["Day 2 plan", "#day-2"],
      ["Tube routes", "#tube"]
    ]
  },
  {
    starts: "2026-06-28T07:00:00+01:00",
    ends: "2026-06-28T23:00:00+01:00",
    label: "Day 3",
    title: "Palace morning and Camden",
    message: "Buckingham Palace photos, St. James's Park, Camden Market lunch, final dinner central.",
    detail: "Keep Camden as a daytime stop and return central before final dinner.",
    actions: [
      ["Day 3 plan", "#day-3"],
      ["Camden map", "map:Camden Market"]
    ]
  },
  {
    starts: "2026-06-29T06:00:00+01:00",
    ends: "2026-06-29T08:55:00+01:00",
    label: "Departure morning",
    title: "Leave for Heathrow",
    message: "Leave the hotel around 7:00-7:15 AM BST. Target Heathrow arrival is 8:55 AM.",
    detail: "Use JetBlue first. Keep passports and flight screenshots out before leaving the hotel.",
    actions: [
      ["Heathrow map", "map:London Heathrow Airport"],
      ["Flights", "#flights"]
    ]
  },
  {
    starts: "2026-06-29T08:55:00+01:00",
    ends: "2026-06-29T11:55:00+01:00",
    label: "Heathrow airport",
    title: "Gate first, food second",
    message: "Check in, clear security, and find the B6 20 gate before stopping for food.",
    detail: "Use airport screens and JetBlue agents as the source of truth.",
    actions: [
      ["JetBlue", "https://www.jetblue.com/flight-tracker-and-status"],
      ["Flights", "#flights"]
    ]
  },
  {
    starts: "2026-06-29T15:25:00-04:00",
    ends: "2026-06-29T18:30:00-04:00",
    label: "JFK connection",
    title: "Find the Raleigh gate",
    message: "After landing at JFK, find the B6 585 gate before food.",
    detail: "If delayed or confused, talk to a JetBlue gate agent immediately.",
    actions: [
      ["Flight status", "#flights"],
      ["JetBlue", "https://www.jetblue.com/flight-tracker-and-status"]
    ]
  },
  {
    starts: "2026-06-29T20:33:00-04:00",
    ends: "2026-07-01T00:00:00-04:00",
    label: "Back home",
    title: "Trip complete",
    message: "You made it back to Raleigh. Send Mom and Dad the best photos.",
    detail: "Keep passports and important documents in the same safe spot after getting home.",
    actions: [
      ["Photo reminder", "#today"],
      ["Tickets", "#wallet"]
    ]
  }
];

const emergencyContacts = [
  {
    label: "Emergency",
    value: "999 or 112",
    href: "tel:999",
    note: "Police, ambulance, fire, or immediate danger."
  },
  {
    label: "Police non-emergency",
    value: "101",
    href: "tel:101",
    note: "Use for non-urgent police reports."
  },
  {
    label: "NHS urgent advice",
    value: "111",
    href: "tel:111",
    note: "Medical help fast, but not life-threatening."
  },
  {
    label: "U.S. Embassy London",
    value: "+44 20 7499 9000",
    href: "tel:+442074999000",
    note: "U.S. citizen help and lost passport emergencies."
  }
];

const recoveryPlans = [
  {
    title: "Lost passport",
    urgency: "Highest priority",
    steps: [
      "Stop moving and search bags, pockets, hotel safe, and the last place it was used.",
      "Call Mom/Dad and stay with your sibling.",
      "If stolen or tied to a crime, call 101 or report to police online; call 999 only for immediate danger.",
      "Contact the U.S. Embassy London for emergency passport guidance.",
      "Use Travel.State.gov before reporting the passport lost, because a reported lost passport cannot be used for travel even if found later."
    ],
    actions: [
      ["U.S. Embassy map", "map:U.S. Embassy London"],
      ["Travel.State.gov lost passport", "https://travel.state.gov/content/travel/en/international-travel/emergencies/lost-stolen-passport-abroad.html"],
      ["Report lost/stolen passport", "https://travel.state.gov/en/passports/renew-replace/report-passport-lost-stolen.html"]
    ]
  },
  {
    title: "Lost phone",
    urgency: "Stay together",
    steps: [
      "Do not split up to search.",
      "Use the other phone to call it, share location, and message the family group.",
      "Retrace only the last safe stop; if it is on transit, use TfL lost property.",
      "If the phone is gone, get back to the hotel and use Wi-Fi/front desk help."
    ],
    actions: [
      ["Hotel map", "map:Hotel"],
      ["TfL lost property", "https://tfl.gov.uk/help-and-contact/lost-property"]
    ]
  },
  {
    title: "Lost wallet or card",
    urgency: "Freeze cards",
    steps: [
      "Tell Mom/Dad immediately.",
      "If a bank card is missing, ask a parent to freeze or cancel it.",
      "If it was stolen, call 101 or report to police online; call 999 only for immediate danger.",
      "Keep one payment method separate from the other phone/card if possible."
    ],
    actions: [
      ["Police non-emergency", "https://www.gov.uk/contact-police"],
      ["Hotel map", "map:Hotel"]
    ]
  },
  {
    title: "Lost item on Tube, bus, Elizabeth line, or black cab",
    urgency: "Report details",
    steps: [
      "Write down the line, station, stop, vehicle, cab, time, and description.",
      "TfL says credit/debit cards and individual Oyster cards are not kept; contact the bank or replacement service.",
      "Make the TfL lost property enquiry as soon as practical.",
      "If it is not critical, keep the day moving and let parents help with the report."
    ],
    actions: [
      ["TfL lost property", "https://tfl.gov.uk/help-and-contact/lost-property"],
      ["Tube map", "https://content.tfl.gov.uk/standard-tube-map.pdf"]
    ]
  }
];

const flightScreenshot = "assets/flight_itinerary.jpg";
const ntfyTopic = "london-birthday-trip-2026-a9x4m2q7";
const tubeMapUrl = "https://content.tfl.gov.uk/standard-tube-map.pdf";
let flightStatusData = null;
let deferredInstallPrompt = null;

const photoReminderDates = new Set([
  "2026-06-26",
  "2026-06-27",
  "2026-06-28",
  "2026-06-29"
]);

const todo = [
  "Order British pounds from Chase",
  "Download TripIt",
  "Download JetBlue app",
  "Download offline maps for London",
  "Download TfL Go",
  "Download Uber",
  "Download FREENOW",
  "Apply for UK ETA for Tiffany and Collin",
  "Save JetBlue confirmation KDHSOU on both phones",
  "Buy Big Bus London hop-on hop-off tickets",
  "Buy London Eye tickets",
  "Confirm hotel luggage storage for arrival morning before check-in",
  "Save hotel address as favorite in Uber",
  "Save hotel address in Google Maps",
  "Save parent travel consent letter on both phones"
];

const pack = [
  "Passports",
  "International chargers / UK plug adapters",
  "Copies of UK ETA confirmations",
  "Copy of parental travel consent letter",
  "Printed hotel confirmation",
  "Printed return flight confirmation",
  "Portable phone charger",
  "Comfortable shoes",
  "Rain jacket or small umbrella",
  "Small amount of cash",
  "Credit/debit card",
  "Medication, if applicable"
];

const tickets = [
  "JetBlue confirmation KDHSOU",
  "Big Bus ticket",
  "London Eye ticket",
  "Flight confirmation",
  "Hotel confirmation",
  "Booking.com hotel confirmation",
  "UK ETA confirmations",
  "Parent travel consent letter"
];

const booking = {
  status: "Confirmed on Booking.com",
  guest: "Marianna",
  hotel: "Holiday Inn Express London - Victoria",
  address: "106-110 Belgrave Road, London SW1V 2BJ, United Kingdom",
  source: "Booking.com confirmation email / app",
  screenshot: "assets/booking_confirmation.jpg",
  dates: "June 26-29, 2026",
  actionItems: [
    "Save the Booking.com confirmation email on both phones.",
    "Open the Booking.com app before leaving and confirm the reservation appears there.",
    "Confirm the hotel can store bags on arrival day before check-in.",
    "Screenshot the confirmation page, confirmation number, PIN, check-in rules, and payment details.",
    "Add the confirmation number and PIN to the Ticket Wallet once they are copied from the email.",
    "Use the hotel address in this guide for Uber, FREENOW, Google Maps, and emergency help."
  ],
  fillIns: [
    "Booking confirmation number: ____________________",
    "Booking PIN: ____________________",
    "Check-in time: ____________________",
    "Cancellation/payment note: ____________________"
  ]
};

const resources = [
  ["TfL Go", "https://tfl.gov.uk/maps"],
  ["Official TfL Tube map", tubeMapUrl],
  ["Google Maps London", "https://www.google.com/maps/place/London,+UK"],
  ["Uber", "https://www.uber.com/gb/en/"],
  ["FREENOW black cabs", "https://www.free-now.com/uk/"],
  ["Booking.com", "https://www.booking.com/"],
  ["JetBlue", "https://www.jetblue.com/"],
  ["Heathrow check-in guidance", "https://www.heathrow.com/departures/checking-in"],
  ["TfL Heathrow Elizabeth line", "https://rms.tfl.gov.uk/modes/elizabeth-line/getting-to-and-from-heathrow-on-the-elizabeth-line"],
  ["UK ETA", "https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta"],
  ["London weather", "https://www.metoffice.gov.uk/weather/forecast/gcpvj0v07"],
  ["U.S. Embassy London", "https://uk.usembassy.gov/"],
  ["U.S. Embassy map - 33 Nine Elms Lane", mapsUrl("U.S. Embassy London")],
  ["Travel.State.gov lost passport abroad", "https://travel.state.gov/content/travel/en/international-travel/emergencies/lost-stolen-passport-abroad.html"],
  ["GOV.UK emergency numbers 999/112", "https://www.gov.uk/guidance/999-and-112-the-uks-national-emergency-numbers"],
  ["GOV.UK police non-emergency 101", "https://www.gov.uk/contact-police"],
  ["NHS 111", "https://111.nhs.uk/"],
  ["TfL lost property", "https://tfl.gov.uk/help-and-contact/lost-property"],
  ["Add daily photo reminder", "assets/photo-reminder.ics"],
  ["ntfy phone push setup", `https://ntfy.sh/${ntfyTopic}`]
];

const tubeBasics = [
  "Use TfL Go and Google Maps before every Tube move; routes can change because of delays or closures.",
  "Each person taps in and taps out with their own card, phone, or Oyster card.",
  "Use the same device for tap in and tap out. Do not mix phone/watch/card.",
  "Follow the line color and direction, not just the destination. Platform signs show the next train's direction.",
  "If tired, late, carrying bags, or confused, use Uber, FREENOW, or an official black cab."
];

const tubeRoutes = [
  {
    title: "Heathrow to hotel with bags",
    tags: ["Elizabeth", "Taxi"],
    steps: [
      "Easiest free-planning route: Heathrow Elizabeth line toward central London.",
      "Get off at Paddington.",
      "Use Uber, FREENOW, or an official black cab from Paddington to Holiday Inn Express London - Victoria.",
      "Goal is not speed; goal is low-stress bag drop before check-in."
    ],
    backup: "All-cab option: official black cab, Uber, or FREENOW straight from Heathrow to the hotel."
  },
  {
    title: "Hotel to Tower Hill",
    tags: ["Victoria", "District", "Circle"],
    steps: [
      "Walk to Pimlico Station.",
      "Take Victoria line one stop to Victoria.",
      "Change to District or Circle line eastbound.",
      "Get off at Tower Hill.",
      "Walk to Tower of London / Tower Bridge."
    ],
    backup: "If the change feels annoying, use Uber or black cab from hotel to Tower Hill."
  },
  {
    title: "Borough Market to West End",
    tags: ["Northern"],
    steps: [
      "Walk to London Bridge Underground Station.",
      "Take Northern line northbound via the Charing Cross branch.",
      "Get off at Leicester Square.",
      "Walk Leicester Square -> Covent Garden -> Seven Dials -> Neal's Yard -> Soho -> Chinatown."
    ],
    backup: "If crowded, stay around Borough Market longer or use Uber to Covent Garden."
  },
  {
    title: "West End back to hotel",
    tags: ["Piccadilly", "Victoria"],
    steps: [
      "From Leicester Square, take Piccadilly line westbound to Green Park.",
      "Change to Victoria line southbound.",
      "Get off at Pimlico or Victoria, whichever Google Maps says is easier.",
      "If it is late or you are tired, skip the Tube and take Uber/FREENOW/black cab."
    ],
    backup: "Night 1 rule still applies: Uber or black cab directly to the hotel."
  },
  {
    title: "Central London to Camden",
    tags: ["Northern"],
    steps: [
      "Use Google Maps/TfL Go from your exact location.",
      "Aim for Camden Town Station on the Northern line.",
      "At Camden Town, follow signs for Camden Market / Camden Lock.",
      "Keep Camden as a daytime stop and return central before final dinner."
    ],
    backup: "If Camden Town is crowded, use Mornington Crescent or Chalk Farm if TfL/Google suggests it."
  },
  {
    title: "Hotel to Heathrow for departure",
    tags: ["Elizabeth", "Taxi"],
    steps: [
      "Leave hotel around 7:00-7:15 AM.",
      "Easiest: Uber, FREENOW, or official black cab straight to Heathrow Terminal 2.",
      "Train/taxi option: taxi or Uber to Paddington, then Elizabeth line or Heathrow Express to Heathrow.",
      "Target Heathrow arrival is 8:55 AM for the 11:55 AM flight."
    ],
    backup: "Use JetBlue app that morning to reconfirm Terminal 2 and flight status."
  }
];

function mapsUrl(name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueries[name] || name)}`;
}

function directionsUrl(from, to, mode = "transit") {
  return [
    "https://www.google.com/maps/dir/?api=1",
    `origin=${encodeURIComponent(mapQueries[from] || from)}`,
    `destination=${encodeURIComponent(mapQueries[to] || to)}`,
    `travelmode=${encodeURIComponent(mode)}`
  ].join("&");
}

function flightTrackers(flight) {
  const googleQuery = encodeURIComponent(`B6 ${flight.number} ${flight.dateQuery} flight status`);
  return [
    ["Google Status", `https://www.google.com/search?q=${googleQuery}`],
    ["JetBlue", `https://www.jetblue.com/flight-tracker-and-status`],
    ["FlightStats", `https://www.flightstats.com/v2/flight-tracker/B6/${flight.number}`],
    ["FlightAware", `https://www.flightaware.com/live/flight/JBU${flight.number}`]
  ];
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function formatDateTime(value) {
  if (!value) return "Not updated yet";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function chooseNextMove(date = new Date()) {
  const now = date.getTime();
  const active = nextMoveTimeline.find(item => now >= new Date(item.starts).getTime() && now <= new Date(item.ends).getTime());
  if (active) return { ...active, state: "active" };
  const upcoming = nextMoveTimeline.find(item => now < new Date(item.starts).getTime());
  if (upcoming) return { ...upcoming, state: "upcoming" };
  return { ...nextMoveTimeline[nextMoveTimeline.length - 1], state: "complete" };
}

function actionHref(action) {
  const target = action[1];
  return target.startsWith("map:") ? mapsUrl(target.slice(4)) : target;
}

function renderNextMove(date = new Date()) {
  const move = chooseNextMove(date);
  const starts = formatDateTime(move.starts);
  document.querySelector("#nextMovePanel").innerHTML = `
    <article class="next-move-card next-move-card--${move.state}">
      <span>${move.label}</span>
      <strong>${move.title}</strong>
      <p>${move.message}</p>
      <p>${move.detail}</p>
      <small>${move.state === "active" ? "Current window" : "Starts"}: ${starts}</small>
      <div class="button-row">
        ${move.actions.map(action => `<a class="button ${action[1].startsWith("#") ? "button--secondary" : ""}" href="${actionHref(action)}" ${action[1].startsWith("#") ? "" : "target=\"_blank\" rel=\"noopener\""}>${action[0]}</a>`).join("")}
      </div>
    </article>
  `;
}

function statusForFlight(flight) {
  return flightStatusData?.flights?.find(item => item.id === `b6-${flight.number}`) || null;
}

function maybeNotifyFlightStatus(data) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const previous = JSON.parse(localStorage.getItem("flightStatusSnapshot") || "{}");
  const next = {};
  for (const flight of data.flights || []) {
    next[flight.id] = `${flight.statusKind}:${flight.status}:${flight.lastCheckedAt || ""}`;
    if (
      previous[flight.id] &&
      previous[flight.id] !== next[flight.id] &&
      ["delayed", "cancelled", "alert"].includes(flight.statusKind)
    ) {
      new Notification(`Flight ${flight.number}: ${flight.status}`, {
        body: flight.message || "Check JetBlue and airport screens before acting."
      });
    }
  }
  localStorage.setItem("flightStatusSnapshot", JSON.stringify(next));
}

async function loadFlightStatus({ force = false } = {}) {
  const summary = document.querySelector("#flightStatusSummary");
  summary.textContent = force ? "Checking latest site data..." : "Loading status...";
  try {
    const response = await fetch(`data/flight-status.json?ts=${Date.now()}`);
    if (!response.ok) throw new Error(`Status file ${response.status}`);
    flightStatusData = await response.json();
    summary.textContent = `Last updated: ${formatDateTime(flightStatusData.updatedAt)}`;
    maybeNotifyFlightStatus(flightStatusData);
    renderFlights();
    if (force) showToast("Flight status refreshed from latest site data");
  } catch (error) {
    summary.textContent = "Status cache unavailable. Use tracker links.";
    if (force) showToast("Could not refresh cached status");
  }
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function openPhotoReminder(force = false) {
  const today = localDateKey();
  const storageKey = `photoMission:${today}`;
  if (!force && (!photoReminderDates.has(today) || localStorage.getItem(storageKey))) return;
  document.querySelector("#photoModal").hidden = false;
}

function closePhotoReminder(markDone = false) {
  if (markDone) localStorage.setItem(`photoMission:${localDateKey()}`, "done");
  document.querySelector("#photoModal").hidden = true;
}

function renderDays() {
  document.querySelector("#dayCards").innerHTML = days.map((day, index) => `
    <article class="day-card" id="${day.id}">
      <picture>
        <source srcset="${day.imageWebp}" type="image/webp">
        <img src="${day.image}" alt="${escapeHtml(day.title)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
      </picture>
      <div class="day-body">
        <p class="eyebrow">Day ${index + 1} - ${day.date}</p>
        <h2>${day.title}</h2>
        <div class="day-meta">
          <div><span>Main area</span><strong>${day.area}</strong></div>
          <div><span>Transportation</span><strong>${day.transport}</strong></div>
          <div><span>Food</span><strong>${day.food}</strong></div>
          <div><span>Night return</span><strong>${day.night}</strong></div>
        </div>
        <ol class="steps">
          ${day.steps.map((step, stepIndex) => `
            <li>
              <div class="step-num">${stepIndex + 1}</div>
              <div>
                <h3>${step[0]}</h3>
                <p>${step[1]}</p>
                <div class="map-chips">
                  ${step[2].map(name => `<a class="map-chip" href="${mapsUrl(name)}" target="_blank" rel="noopener">${name}</a>`).join("")}
                </div>
              </div>
            </li>
          `).join("")}
        </ol>
        <div class="callouts">
          <div class="callout callout--photo"><strong>Photos</strong><p>${day.photo}</p></div>
          <div class="callout callout--tired"><strong>If tired</strong><p>${day.tired}</p></div>
          <div class="callout callout--rain"><strong>Rain plan</strong><p>${day.rain}</p></div>
        </div>
      </div>
    </article>
  `).join("");
}

function renderChecklist(selector, items, key) {
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  document.querySelector(selector).innerHTML = items.map((item, index) => `
    <label class="check-item">
      <input type="checkbox" data-key="${key}" data-index="${index}" ${saved[index] ? "checked" : ""}>
      <span>${item}</span>
    </label>
  `).join("");
}

function renderTickets() {
  document.querySelector("#ticketList").innerHTML = tickets.map(ticket => `
    <div class="wallet-item">
      <div><strong>${ticket}</strong><span>Save screenshot, confirmation number, or QR code location.</span></div>
    </div>
  `).join("");
}

function renderFlights() {
  document.querySelector("#flightPanel").innerHTML = `
    <div class="button-row">
      <a class="button" href="${flightScreenshot}" target="_blank" rel="noopener">Open Flight Screenshot</a>
      <a class="button button--secondary" href="https://www.heathrow.com/departures/checking-in" target="_blank" rel="noopener">Heathrow Check-In</a>
      <a class="button button--secondary" href="https://rms.tfl.gov.uk/modes/elizabeth-line/getting-to-and-from-heathrow-on-the-elizabeth-line" target="_blank" rel="noopener">TfL Heathrow</a>
    </div>
    <div class="flight-route">
      ${flights.map(flight => `
        <article class="flight-card">
          <time>${flight.time}</time>
          <div>
            <strong>${flight.route}</strong>
            <p>${flight.day} | ${flight.airline} | Conf. ${flight.confirmation}</p>
            <p>${flight.terminal} | ${flight.arrive}</p>
            ${renderFlightStatusBox(statusForFlight(flight))}
            <div class="tracker-links">
              ${flightTrackers(flight).map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`).join("")}
            </div>
          </div>
        </article>
      `).join("")}
    </div>
    <div class="airport-plan">
      ${airportPlans.map(plan => `
        <article>
          <h3>${plan.title}</h3>
          <ul>${plan.bullets.map(item => `<li>${item}</li>`).join("")}</ul>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDepartureGuard() {
  document.querySelector("#departureGuardPanel").innerHTML = departureGuardrails.map(item => `
    <article class="departure-card">
      <span>${item.date}</span>
      <strong>${item.title}</strong>
      <p>${item.anchor}</p>
      <ul>${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderPhonePush() {
  document.querySelector("#phonePushPanel").innerHTML = `
    <article class="push-card">
      <strong>Subscribe on each phone</strong>
      <p>Install the free ntfy app, then subscribe to this topic:</p>
      <code class="topic-code">${ntfyTopic}</code>
      <div class="button-row">
        <a class="button" href="https://ntfy.sh/${ntfyTopic}" target="_blank" rel="noopener">Open Topic</a>
        <a class="button button--secondary" href="https://ntfy.sh/app" target="_blank" rel="noopener">Open ntfy Web</a>
      </div>
    </article>
    <article class="push-card">
      <strong>How alerts work</strong>
      <ol>
        <li>Download ntfy from the App Store or Google Play.</li>
        <li>Add the topic above.</li>
        <li>Keep notifications allowed for ntfy.</li>
        <li>Flight status checks run every 30 minutes inside each flight's monitoring window.</li>
        <li>If the first active check or a status change happens, GitHub sends a phone push to this topic.</li>
      </ol>
      <p>JetBlue app alerts are still the source of truth; this is the free backup notifier.</p>
    </article>
  `;
}

function renderRecovery() {
  document.querySelector("#recoveryPanel").innerHTML = `
    <div class="emergency-strip">
      ${emergencyContacts.map(contact => `
        <a href="${contact.href}">
          <span>${contact.label}</span>
          <strong>${contact.value}</strong>
          <small>${contact.note}</small>
        </a>
      `).join("")}
    </div>
    ${recoveryPlans.map(plan => `
      <article class="recovery-card">
        <span>${plan.urgency}</span>
        <strong>${plan.title}</strong>
        <ol>${plan.steps.map(step => `<li>${step}</li>`).join("")}</ol>
        <div class="button-row">
          ${plan.actions.map(action => `<a class="button ${action[1].startsWith("map:") ? "" : "button--secondary"}" href="${actionHref(action)}" target="_blank" rel="noopener">${action[0]}</a>`).join("")}
        </div>
      </article>
    `).join("")}
  `;
}

function routeClass(tag) {
  return `route-pill route-pill--${tag.toLowerCase().replace(/[^a-z]+/g, "")}`;
}

function renderTube() {
  document.querySelector("#tubePanel").innerHTML = `
    <article class="tube-card">
      <strong>Official Tube map</strong>
      <p>Use the official TfL Tube map and always check TfL Go before moving.</p>
      <div class="button-row">
        <a class="button" href="${tubeMapUrl}" target="_blank" rel="noopener">Open TfL Tube Map</a>
        <a class="button button--secondary" href="https://tfl.gov.uk/plan-a-journey/" target="_blank" rel="noopener">TfL Journey Planner</a>
      </div>
      <iframe class="tube-map-frame" src="${tubeMapUrl}" title="Official TfL Tube map"></iframe>
    </article>
    <article class="tube-card">
      <strong>Tube rules</strong>
      <ul>${tubeBasics.map(item => `<li>${item}</li>`).join("")}</ul>
    </article>
    <div class="tube-routes">
      ${tubeRoutes.map(route => `
        <article class="tube-card">
          <strong>${route.title}</strong>
          <div>${route.tags.map(tag => `<span class="${routeClass(tag)}">${tag}</span>`).join("")}</div>
          <ol>${route.steps.map(step => `<li>${step}</li>`).join("")}</ol>
          <p><b>Backup:</b> ${route.backup}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderFlightStatusBox(status) {
  if (!status) {
    return `
      <div class="status-box status-box--unknown">
        <strong>Status loading</strong>
        <p>Use tracker links if this does not update.</p>
      </div>
    `;
  }
  return `
    <div class="status-box status-box--${status.statusKind || "unknown"}">
      <strong>${status.status}</strong>
      <p>${status.message || ""}</p>
      <dl>
        <dt>Last checked</dt><dd>${formatDateTime(status.lastCheckedAt)}</dd>
        <dt>Departure</dt><dd>${status.departure?.estimated || status.departure?.scheduled || "Not available"}</dd>
        <dt>Arrival</dt><dd>${status.arrival?.estimated || status.arrival?.scheduled || "Not available"}</dd>
        <dt>Gate</dt><dd>${status.departure?.gate || "Not available"}</dd>
      </dl>
    </div>
  `;
}

function renderBooking() {
  document.querySelector("#bookingPanel").innerHTML = `
    <article class="booking-card">
      <strong>${booking.status}</strong>
      <p><b>Guest:</b> ${booking.guest}</p>
      <p><b>Hotel:</b> ${booking.hotel}</p>
      <p><b>Dates:</b> ${booking.dates}</p>
      <p><b>Address:</b> ${booking.address}</p>
      <p><b>Where to verify:</b> ${booking.source}</p>
      <div class="button-row">
        <a class="button" href="${mapsUrl("Hotel")}" target="_blank" rel="noopener">Open Hotel Map</a>
        <a class="button button--secondary" href="https://www.booking.com/" target="_blank" rel="noopener">Open Booking.com</a>
        <a class="button button--secondary" href="${booking.screenshot}" target="_blank" rel="noopener">Open Screenshot</a>
      </div>
    </article>
    <article class="booking-card">
      <strong>Before travel</strong>
      <ul>${booking.actionItems.map(item => `<li>${item}</li>`).join("")}</ul>
      <ul>${booking.fillIns.map(item => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="booking-card booking-card--image">
      <strong>Confirmation screenshot</strong>
      <a href="${booking.screenshot}" target="_blank" rel="noopener">
        <img src="${booking.screenshot}" alt="Booking.com hotel confirmation screenshot" loading="lazy" decoding="async">
      </a>
    </article>
  `;
}

function renderResources() {
  document.querySelector("#resourceList").innerHTML = resources.map(([label, url]) => `
    <a href="${url}" target="_blank" rel="noopener">${label}</a>
  `).join("");
}

function renderRouteShortcuts() {
  document.querySelector("#routeShortcutList").innerHTML = routeShortcuts.map(route => `
    <article class="route-shortcut">
      <div>
        <span>${route.mode}</span>
        <strong>${route.label}</strong>
        <p>${route.from} -> ${route.to}</p>
        <p>${route.note}</p>
      </div>
      <a class="button" href="${directionsUrl(route.from, route.to, route.mode)}" target="_blank" rel="noopener">Directions</a>
    </article>
  `).join("");
}

function renderMaps(filter = "") {
  const query = filter.trim().toLowerCase();
  const entries = Object.keys(mapQueries).filter(name => name.toLowerCase().includes(query));
  document.querySelector("#mapList").innerHTML = entries.map(name => `
    <a href="${mapsUrl(name)}" target="_blank" rel="noopener"><strong>${name}</strong></a>
  `).join("");
}

function wireEvents() {
  document.querySelectorAll("[data-map]").forEach(link => {
    link.href = mapsUrl(link.dataset.map);
  });

  document.querySelectorAll("[data-copy-hotel]").forEach(button => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(hotelAddress);
      showToast("Hotel address copied");
    });
  });

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    document.querySelector("[data-install-app]").hidden = false;
  });

  document.querySelector("[data-install-app]").addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      showToast("Use your browser menu to add this guide to the home screen");
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    document.querySelector("[data-install-app]").hidden = true;
  });

  document.addEventListener("change", event => {
    if (!event.target.matches("input[type='checkbox'][data-key]")) return;
    const key = event.target.dataset.key;
    const index = event.target.dataset.index;
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    saved[index] = event.target.checked;
    localStorage.setItem(key, JSON.stringify(saved));
  });

  document.querySelector("#mapSearch").addEventListener("input", event => renderMaps(event.target.value));

  document.querySelector("[data-refresh-flight-status]").addEventListener("click", async () => {
    await loadFlightStatus({ force: true });
  });
  document.querySelector("[data-enable-flight-alerts]").addEventListener("click", async () => {
    if (!("Notification" in window)) {
      showToast("Browser notifications are not supported here");
      return;
    }
    const permission = await Notification.requestPermission();
    showToast(permission === "granted" ? "Flight alerts enabled while this site is open" : "Flight alerts were not enabled");
  });

  document.querySelectorAll("[data-photo-reminder]").forEach(button => {
    button.addEventListener("click", () => openPhotoReminder(true));
  });
  document.querySelectorAll("[data-photo-close]").forEach(button => {
    button.addEventListener("click", () => closePhotoReminder(false));
  });
  document.querySelector("[data-photo-done]").addEventListener("click", () => {
    closePhotoReminder(true);
    showToast("Photo mission checked off for today");
  });
}

renderDays();
renderChecklist("#todoList", todo, "londonTripTodo");
renderChecklist("#packList", pack, "londonTripPack");
renderTickets();
renderNextMove();
renderFlights();
renderDepartureGuard();
renderPhonePush();
renderRecovery();
renderTube();
renderBooking();
renderResources();
renderRouteShortcuts();
renderMaps();
wireEvents();
loadFlightStatus();
window.setTimeout(() => openPhotoReminder(false), 900);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      showToast("Offline mode could not start on this browser");
    });
  });
}
