import {
  buildDirectionsUrl,
  buildMapsUrl,
  chooseNextMove,
  resolveActionHref,
  resolvePanelFromHash
} from "./site-logic.js";

const hotelAddress = `Holiday Inn Express London - Victoria
106-110 Belgrave Road
London SW1V 2BJ
United Kingdom
Phone: +44 20 7630 8888`;

const panelIds = ["overview", "move", "flights", "wallet", "safety"];

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

const appLinks = {
  ntfyIos: "https://apps.apple.com/us/app/ntfy/id1625396347",
  ntfyAndroid: "https://play.google.com/store/apps/details?id=io.heckel.ntfy",
  tflIos: "https://apps.apple.com/us/app/tfl-go-plan-pay-travel/id1419541638",
  tflAndroid: "https://play.google.com/store/apps/details?id=uk.gov.tfl.gotfl",
  jetBlueIos: "https://apps.apple.com/us/app/jetblue-book-manage-trips/id481370590",
  jetBlueAndroid: "https://play.google.com/store/apps/details?id=com.jetblue.JetBlueAndroid"
};

const routeShortcuts = [
  {
    label: "Walk hotel to Pimlico Station",
    from: "Hotel",
    to: "Pimlico Station",
    mode: "walking",
    note: "Best fast-start move for the nearest Tube."
  },
  {
    label: "Walk hotel to Victoria Station",
    from: "Hotel",
    to: "Victoria Station",
    mode: "walking",
    note: "Use this for bus, rail, and bigger station choices."
  },
  {
    label: "Heathrow to hotel",
    from: "London Heathrow Airport",
    to: "Hotel",
    mode: "transit",
    note: "Use this after landing. If tired or bags are awkward, switch to Uber, FREENOW, or black cab."
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
    note: "Easy riverside walk before lunch."
  },
  {
    label: "Borough Market to Covent Garden",
    from: "Borough Market",
    to: "Covent Garden",
    mode: "transit",
    note: "Use after lunch for the West End segment."
  },
  {
    label: "West End back to hotel",
    from: "Chinatown",
    to: "Hotel",
    mode: "driving",
    note: "Use Uber, FREENOW, or black cab if tired, late, or done for the day."
  },
  {
    label: "Hotel to Camden Market",
    from: "Hotel",
    to: "Camden Market",
    mode: "transit",
    note: "Day 3 route. Keep Camden as a daytime stop."
  }
];

const days = [
  // Marianna still needs to add one more Sunday guide pocket when the extra plan is finalized.
  // Keep new day entries in this same shape so itinerary cards, map buttons, and QA stay predictable.
  {
    id: "day-1",
    date: "Friday, June 26",
    title: "Victoria, Westminster and South Bank",
    image: "assets/london_eye.jpg",
    imageWebp: "assets/london_eye.webp",
    area: "Victoria / Westminster / South Bank",
    transport: "Airport transfer + bag drop + walking + Big Bus + Uber home",
    food: "Casual lunch near hotel; casual dinner at Southbank Centre",
    night: "Uber directly back to the hotel",
    launchRoute: ["Hotel", "Victoria Station", "walking"],
    steps: [
      ["Arrive and get to the hotel", "Land at Heathrow at 6:30 AM BST. After immigration and bags, go straight to Holiday Inn Express London - Victoria. Check-in is later, so the goal is to drop bags before sightseeing.", ["London Heathrow Airport", "Hotel"]],
      ["Drop bags before check-in", "Ask the front desk to store luggage until check-in. Keep passports, wallets, phones, chargers, tickets, and medication with you.", ["Hotel"]],
      ["Eat near the hotel", "After the bags are stored, walk to Tachbrook Street / Warwick Way for an easy cafe or casual restaurant.", ["Tachbrook Street Market"]],
      ["Start the bus loop", "Walk to Victoria Station / Buckingham Palace Road entrance. Board the Hop-On / Hop-Off Big Bus that matches your ticket.", ["Victoria Station"]],
      ["Westminster photos", "Get off near London Eye / Westminster Bridge. Walk London Eye to Westminster Bridge to Big Ben photos to Parliament Square to Westminster Abbey exterior.", ["London Eye", "Westminster Bridge", "Big Ben", "Parliament Square", "Westminster Abbey"]],
      ["London Eye", "Ride the London Eye. Aim for a timed ticket around 5:30 PM or 6:00 PM.", ["London Eye"]],
      ["Dinner and river walk", "Walk along Queen's Walk. Eat around Southbank Centre / Royal Festival Hall. If energy is good, continue toward Gabriel's Wharf or Oxo Tower.", ["Southbank Centre", "Gabriel's Wharf", "Oxo Tower"]],
      ["Go home", "Take Uber directly back to the hotel. Night 1 return is Uber or black cab, not the Tube.", ["Hotel"]]
    ],
    photo: "Big Ben from Westminster Bridge, London Eye from Westminster Bridge, Queen's Walk river views.",
    tired: "If tired after the London Eye, skip the longer Queen's Walk and eat near Southbank Centre, then Uber directly back.",
    rain: "Still do the London Eye if tickets are booked, then use Southbank Centre or Royal Festival Hall for food and indoor cover."
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
    night: "Tube if early and comfortable; Uber or black cab if tired",
    launchRoute: ["Hotel", "Tower Hill Station", "transit"],
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
    night: "Keep Camden as a daytime stop; return central before final dinner",
    launchRoute: ["Hotel", "Buckingham Palace", "transit"],
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

const flightReadiness = {
  "2184": [
    "Passport and JetBlue confirmation KDHSOU are saved and easy to open.",
    "Phone is charged, ntfy and JetBlue alerts are on, and parent group text is updated.",
    "At RDU by 12:30 PM EDT.",
    "Gate is confirmed on JetBlue app and airport screens before food."
  ],
  "1620": [
    "BOS arrival gate and London departure gate are checked before food.",
    "Stay airside unless JetBlue staff says otherwise.",
    "Passport, wallet, phone, charger, and medication are with you.",
    "Parent group text is updated before boarding London flight."
  ],
  "20": [
    "Leave hotel around 7:00-7:15 AM BST.",
    "Passport, phone, charger, wallet, and medication are physically checked before leaving.",
    "JetBlue app confirms Terminal 2 and current flight status.",
    "At Heathrow by 8:55 AM and through security before food."
  ],
  "585": [
    "After landing at JFK, find the Raleigh gate before food.",
    "Stay airside unless JetBlue staff says otherwise.",
    "If delayed or confused, talk to a JetBlue gate agent immediately.",
    "Parent group text is updated from JFK."
  ]
};

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
    message: "Install JetBlue, TfL Go, ntfy, and save this guide to the phone home screen.",
    detail: "Confirm passports, UK ETA, consent letter, and JetBlue confirmation KDHSOU are ready on both phones.",
    actions: [
      ["Open Wallet", "panel:wallet"],
      ["Alerts Setup", "panel:flights"]
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
      ["RDU Map", "map:RDU Airport"],
      ["Flights", "panel:flights"]
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
      ["Hotel Map", "map:Hotel"],
      ["Move Panel", "panel:move"]
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
      ["Open Day 1", "day:day-1"],
      ["Hotel Map", "map:Hotel"]
    ]
  },
  {
    starts: "2026-06-27T07:00:00+01:00",
    ends: "2026-06-27T23:00:00+01:00",
    label: "Day 2",
    title: "Tower Bridge, Borough Market, West End",
    message: "Tube to Tower Hill, walk Tower Bridge, Borough Market lunch, then West End exploring.",
    detail: "If tired or it is late, use Uber, FREENOW, or black cab back to the hotel.",
    actions: [
      ["Open Day 2", "day:day-2"],
      ["Tube Routes", "panel:move"]
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
      ["Open Day 3", "day:day-3"],
      ["Camden Map", "map:Camden Market"]
    ]
  },
  {
    starts: "2026-06-29T06:00:00+01:00",
    ends: "2026-06-29T08:55:00+01:00",
    label: "Departure morning",
    title: "Leave for Heathrow",
    message: "Leave the hotel around 7:00-7:15 AM BST. Target Heathrow arrival is 8:55 AM.",
    detail: "Use JetBlue first. Keep passports and boarding passes accessible before leaving the hotel.",
    actions: [
      ["Heathrow Map", "map:London Heathrow Airport"],
      ["Flights", "panel:flights"]
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
      ["Photo Mission", "panel:overview"],
      ["Wallet", "panel:wallet"]
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
      "Call Mom or Dad and stay with your sibling.",
      "If stolen or tied to a crime, call 101 or report to police online; call 999 only for immediate danger.",
      "Contact the U.S. Embassy London for emergency passport guidance.",
      "Use Travel.State.gov before reporting the passport lost, because a reported lost passport cannot be used for travel even if found later."
    ],
    actions: [
      ["U.S. Embassy Map", "map:U.S. Embassy London"],
      ["Travel.State.gov", "https://travel.state.gov/content/travel/en/international-travel/emergencies/lost-stolen-passport-abroad.html"]
    ]
  },
  {
    title: "Lost phone",
    urgency: "Stay together",
    steps: [
      "Do not split up to search.",
      "Use the other phone to call it, share location, and message the family group.",
      "Retrace only the last safe stop; if it is on transit, use TfL lost property.",
      "If the phone is gone, get back to the hotel and use Wi-Fi or front desk help."
    ],
    actions: [
      ["Hotel Map", "map:Hotel"],
      ["TfL Lost Property", "https://tfl.gov.uk/help-and-contact/lost-property"]
    ]
  },
  {
    title: "Lost wallet or card",
    urgency: "Freeze cards",
    steps: [
      "Tell Mom or Dad immediately.",
      "If a bank card is missing, ask a parent to freeze or cancel it.",
      "If it was stolen, call 101 or report to police online; call 999 only for immediate danger.",
      "Keep one payment method separate from the other phone or card if possible."
    ],
    actions: [
      ["Police Advice", "https://www.gov.uk/contact-police"],
      ["Hotel Map", "map:Hotel"]
    ]
  }
];

const flightScreenshot = "assets/flight_itinerary.jpg";
const ntfyTopic = "london-birthday-trip-2026-a9x4m2q7";
const tubeMapUrl = "https://content.tfl.gov.uk/standard-tube-map.pdf";

const todo = [
  "Order British pounds from Chase",
  "Download JetBlue app and confirm KDHSOU booking appears",
  "Download TfL Go for Tube routes",
  "Download ntfy and subscribe to the trip alert topic",
  "Download offline Google Maps for London",
  "Download Uber and FREENOW — set up payment before leaving",
  "Apply for UK ETA for Tiffany and Collin at gov.uk",
  "Buy Big Bus London hop-on hop-off tickets and add confirmation here",
  "Buy London Eye tickets and add confirmation here",
  "Confirm hotel can store bags on arrival morning before check-in",
  "Save hotel address in Uber and Google Maps before leaving home",
  "Save parent travel consent letter as PDF on both phones"
];

const pack = [
  "Passports",
  "International chargers and UK plug adapters",
  "Copies of UK ETA confirmations",
  "Copy of parental travel consent letter",
  "Printed hotel confirmation",
  "Printed return flight confirmation",
  "Portable phone charger",
  "Comfortable shoes",
  "Rain jacket or small umbrella",
  "Small amount of cash",
  "Credit or debit card",
  "Medication, if applicable"
];

const tickets = [
  {
    label: "JetBlue — All 4 flights",
    detail: "Confirmation KDHSOU",
    sub: "RDU→BOS→LHR · LHR→JFK→RDU return",
    href: "https://www.jetblue.com/manage-trips/",
    status: "confirmed"
  },
  {
    label: "Hotel — Holiday Inn Express Victoria",
    detail: "June 26-29, 2026 · 106-110 Belgrave Road, SW1V 2BJ",
    sub: "Phone: +44 20 7630 8888 · Guest: Marianna · Booked on Booking.com",
    href: "https://www.booking.com/",
    status: "confirmed"
  },
  {
    label: "Big Bus London hop-on hop-off",
    detail: "Confirmation number needed — add when Marianna books",
    status: "pending"
  },
  {
    label: "London Eye",
    detail: "Confirmation number needed — add when Marianna books",
    status: "pending"
  },
  {
    label: "UK ETA — Tiffany",
    detail: "Electronic Travel Authorisation required for US citizens entering UK — authorisation number needed",
    href: "https://www.gov.uk/apply-uk-visa",
    status: "pending"
  },
  {
    label: "UK ETA — Collin",
    detail: "Electronic Travel Authorisation required for US citizens entering UK — authorisation number needed",
    href: "https://www.gov.uk/apply-uk-visa",
    status: "pending"
  },
  {
    label: "Parent travel consent letter",
    detail: "Signed letter from parents authorising Tiffany and Collin to travel — Google Doc link needed",
    status: "action"
  }
];

const booking = {
  status: "Confirmed on Booking.com",
  guest: "Marianna",
  hotel: "Holiday Inn Express London - Victoria",
  address: "106-110 Belgrave Road, London SW1V 2BJ, United Kingdom",
  phone: "+44 20 7630 8888",
  dates: "June 26-29, 2026",
  actionItems: [
    "Open the Booking.com app before leaving and confirm the reservation is visible there.",
    "Ask the front desk to store bags on arrival morning — check-in may not be until afternoon."
  ],
  fillIns: [
    "Booking confirmation number: ____________________",
    "Booking PIN: ____________________",
    "Check-in time: ____________________"
  ]
};

const resourceGroups = [
  { label: "TfL Go — iPhone", href: appLinks.tflIos, why: "Plan every Tube move and see live departures and delays" },
  { label: "TfL Go — Android", href: appLinks.tflAndroid, why: "Plan every Tube move and see live departures and delays" },
  { label: "JetBlue app", href: appLinks.jetBlueIos, why: "Check in, see boarding passes, and track flight status" },
  { label: "Uber", href: "https://www.uber.com/gb/en/", why: "Best way home when tired — works exactly like in the US" },
  { label: "FREENOW — black cabs", href: "https://www.free-now.com/uk/", why: "Book official London black cabs as a backup to Uber" },
  { label: "Official Tube map (PDF)", href: tubeMapUrl, why: "Offline backup — works without signal" },
  { label: "TfL Journey Planner", href: "https://tfl.gov.uk/plan-a-journey/", why: "Live route planning with disruption alerts direct from TfL" },
  { label: "Google Maps London", href: "https://www.google.com/maps/place/London,+UK", why: "Download offline so it works on weak signal" },
  { label: "U.S. Embassy London", href: "https://uk.usembassy.gov/", why: "Lost passport, emergency consular help for US citizens" },
  { label: "TfL lost property", href: "https://tfl.gov.uk/help-and-contact/lost-property", why: "Report and recover anything left on the Tube or bus" }
];

const tubeBasics = [
  "Use TfL Go and Google Maps before every Tube move; routes can change because of delays or closures.",
  "Each person taps in and taps out with their own card, phone, or Oyster card.",
  "Use the same device for tap in and tap out. Do not mix phone, watch, and card.",
  "Follow the line color and direction, not just the destination.",
  "If tired, late, carrying bags, or confused, use Uber, FREENOW, or an official black cab."
];

const tubeRoutes = [
  {
    title: "Heathrow to hotel with bags",
    steps: [
      "Easiest low-stress route: Heathrow Elizabeth line toward central London.",
      "Get off at Paddington.",
      "Use Uber, FREENOW, or an official black cab from Paddington to Holiday Inn Express London - Victoria.",
      "Goal is low-stress bag drop before check-in, not speed."
    ],
    backup: "All-cab option: official black cab, Uber, or FREENOW straight from Heathrow to the hotel."
  },
  {
    title: "Hotel to Tower Hill",
    steps: [
      "Walk to Pimlico Station.",
      "Take Victoria line one stop to Victoria.",
      "Change to District or Circle line eastbound.",
      "Get off at Tower Hill.",
      "Walk to Tower of London or Tower Bridge."
    ],
    backup: "If the change feels annoying, use Uber or black cab from hotel to Tower Hill."
  },
  {
    title: "West End back to hotel",
    steps: [
      "From Leicester Square, take Piccadilly line westbound to Green Park.",
      "Change to Victoria line southbound.",
      "Get off at Pimlico or Victoria, whichever Google Maps says is easier.",
      "If it is late or you are tired, skip the Tube and take Uber, FREENOW, or a black cab."
    ],
    backup: "Night 1 rule still applies: Uber or black cab directly to the hotel."
  }
];

let flightStatusData = null;
let deferredInstallPrompt = null;

function mapsUrl(name) {
  return buildMapsUrl(mapQueries, name);
}

function directionsUrl(from, to, mode = "transit") {
  return buildDirectionsUrl(mapQueries, from, to, mode);
}

function flightTrackers(flight) {
  const googleQuery = encodeURIComponent(`B6 ${flight.number} ${flight.dateQuery} flight status`);
  return [
    ["Live status", `https://www.google.com/search?q=${googleQuery}`],
    ["FlightAware", `https://www.flightaware.com/live/flight/JBU${flight.number}`]
  ];
}

function sameTabTravelLink(href, label, className = "button") {
  return `<a class="${className}" href="${href}">${label}</a>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function formatDateTime(value) {
  if (!value) return "Not updated yet";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function renderActionButton(action, className = "button button--secondary") {
  const target = action[1];

  if (target.startsWith("panel:")) {
    return `<button class="${className}" type="button" data-target="${target.slice(6)}">${action[0]}</button>`;
  }

  if (target.startsWith("day:")) {
    return `<button class="${className}" type="button" data-open-day="${target.slice(4)}">${action[0]}</button>`;
  }

  return `<a class="${className}" href="${resolveActionHref(mapQueries, action)}" target="_blank" rel="noopener">${action[0]}</a>`;
}

function renderTodaySummary(date = new Date()) {
  const nextMove = chooseNextMove(nextMoveTimeline, date);

  document.querySelector("#todaySummary").innerHTML = `
    <article class="hero-card hero-card--primary">
      <span>${nextMove.label}</span>
      <strong>${nextMove.title}</strong>
      <p>${nextMove.message}</p>
      <p>${nextMove.detail}</p>
      <div class="button-row">
        ${nextMove.actions.map(action => renderActionButton(action, "button")).join("")}
      </div>
    </article>
    <article class="info-card">
      <span>Hotel pocket</span>
      <strong>Holiday Inn Express London - Victoria</strong>
      <p>106-110 Belgrave Road, London SW1V 2BJ</p>
      <div class="button-row">
        <a class="button button--secondary" href="${mapsUrl("Hotel")}" target="_blank" rel="noopener">Open hotel</a>
        <button class="button button--secondary" type="button" data-copy-hotel>Copy address</button>
      </div>
    </article>
    <article class="info-card">
      <span>Nearest tube</span>
      <strong>Pimlico Station</strong>
      <p>Use walking directions from the hotel instead of guessing the street.</p>
      <div class="button-row">
        <a class="button button--secondary" href="${directionsUrl("Hotel", "Pimlico Station", "walking")}" target="_blank" rel="noopener">Walk there</a>
        <a class="button button--secondary" href="${directionsUrl("Hotel", "Victoria Station", "walking")}" target="_blank" rel="noopener">Walk to Victoria</a>
      </div>
    </article>
    <article class="info-card">
      <span>Guide setup</span>
      <strong>Install ntfy before travel</strong>
      <p>Trip reminders and flight alerts use phone push, so set it up before anyone is tired or on airport Wi-Fi.</p>
      <div class="button-row">
        <button class="button button--secondary" type="button" data-target="flights">Open setup</button>
      </div>
    </article>
  `;
}

function renderItinerary() {
  document.querySelector("#itineraryList").innerHTML = days.map((day, index) => `
    <details class="pocket-card itinerary-pocket" id="${day.id}">
      <summary class="pocket-card__summary">
        <div>
          <span>${day.date}</span>
          <strong>${day.title}</strong>
          <p>${day.area}</p>
        </div>
        <span class="summary-pill">Day ${index + 1}</span>
      </summary>
      <div class="itinerary-pocket__media">
        <picture>
          <source srcset="${day.imageWebp}" type="image/webp">
          <img src="${day.image}" alt="${escapeHtml(day.title)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
        </picture>
      </div>
      <div class="itinerary-pocket__body">
        <section class="day-command-card">
          <div>
            <span>Best next tap</span>
            <strong>Start with directions, not reading</strong>
            <p>${day.transport}</p>
          </div>
          <div class="button-row">
            ${sameTabTravelLink(directionsUrl(day.launchRoute[0], day.launchRoute[1], day.launchRoute[2]), `Directions → ${day.launchRoute[1]}`)}
            <a class="button button--secondary" href="${mapsUrl("Hotel")}" target="_blank" rel="noopener">Hotel map</a>
          </div>
        </section>
        <div class="trip-facts">
          <article><span>Main area</span><strong>${day.area}</strong></article>
          <article><span>Food</span><strong>${day.food}</strong></article>
          <article><span>Night return</span><strong>${day.night}</strong></article>
        </div>
        <details class="sub-pocket">
          <summary class="sub-pocket__summary">
            <strong>Step-by-step route</strong>
            <span>${day.steps.length} stops</span>
          </summary>
          <ol class="step-list">
            ${day.steps.map((step, stepIndex) => `
              <li>
                <div class="step-count">${stepIndex + 1}</div>
                <div class="step-copy">
                  <h3>${step[0]}</h3>
                  <p>${step[1]}</p>
                  <div class="chip-row">
                    ${step[2].map(name => `<a class="map-chip" href="${mapsUrl(name)}" target="_blank" rel="noopener">${name}</a>`).join("")}
                  </div>
                </div>
              </li>
            `).join("")}
          </ol>
        </details>
        <details class="sub-pocket">
          <summary class="sub-pocket__summary">
            <strong>Photos and fallbacks</strong>
            <span>Open only when useful</span>
          </summary>
          <div class="callout-grid">
            <article class="callout-card"><span>Photos</span><strong>Capture this</strong><p>${day.photo}</p></article>
            <article class="callout-card"><span>If tired</span><strong>Shorten it</strong><p>${day.tired}</p></article>
            <article class="callout-card"><span>If it rains</span><strong>Pivot cleanly</strong><p>${day.rain}</p></article>
          </div>
        </details>
      </div>
    </details>
  `).join("");
}

function renderHotelActions() {
  document.querySelector("#hotelActionPanel").innerHTML = `
    <article class="info-card">
      <span>Hotel to Tube</span>
      <strong>Walk to Pimlico Station</strong>
      <p>Use this instead of relying on memory or vague “closest station” notes.</p>
      <div class="button-row">
        <a class="button" href="${directionsUrl("Hotel", "Pimlico Station", "walking")}" target="_blank" rel="noopener">Walking directions</a>
      </div>
    </article>
    <article class="info-card">
      <span>Hotel to major hub</span>
      <strong>Walk to Victoria Station</strong>
      <p>Best for buses, trains, and route fallbacks when the simple route changes.</p>
      <div class="button-row">
        <a class="button" href="${directionsUrl("Hotel", "Victoria Station", "walking")}" target="_blank" rel="noopener">Directions</a>
      </div>
    </article>
    <article class="info-card">
      <span>Airport transfer</span>
      <strong>Hotel to Heathrow</strong>
      <p>Keep this one-tap route ready for departure morning.</p>
      <div class="button-row">
        <a class="button" href="${directionsUrl("Hotel", "London Heathrow Airport", "driving")}" target="_blank" rel="noopener">Airport route</a>
      </div>
    </article>
    <article class="info-card">
      <span>Official map</span>
      <strong>Tube map and planner</strong>
      <p>When the route gets weird, use TfL’s map and journey planner instead of guessing transfers.</p>
      <div class="button-row">
        <a class="button" href="${tubeMapUrl}" target="_blank" rel="noopener">Tube map</a>
        <a class="button button--secondary" href="https://tfl.gov.uk/plan-a-journey/" target="_blank" rel="noopener">Journey planner</a>
      </div>
    </article>
  `;
}

function renderRouteShortcuts() {
  document.querySelector("#routeShortcutList").innerHTML = routeShortcuts.map(route => `
    <article class="route-pocket">
      <div>
        <span>${route.mode}</span>
        <strong>${route.label}</strong>
        <p>${route.note}</p>
      </div>
      ${sameTabTravelLink(directionsUrl(route.from, route.to, route.mode), "Open directions")}
    </article>
  `).join("");
}

function renderTubePockets() {
  document.querySelector("#tubePocketList").innerHTML = `
    <details class="pocket-card" open>
      <summary class="pocket-card__summary">
        <div>
          <span>Tube rules</span>
          <strong>What to remember before tapping in</strong>
          <p>Keep these out of the way until you need them.</p>
        </div>
      </summary>
      <ul class="bullet-list">${tubeBasics.map(item => `<li>${item}</li>`).join("")}</ul>
    </details>
    ${tubeRoutes.map(route => `
      <details class="pocket-card">
        <summary class="pocket-card__summary">
          <div>
            <span>Route pocket</span>
            <strong>${route.title}</strong>
            <p>${route.backup}</p>
          </div>
        </summary>
        <ol class="bullet-list">${route.steps.map(step => `<li>${step}</li>`).join("")}</ol>
      </details>
    `).join("")}
  `;
}

function renderMaps(filter = "") {
  const query = filter.trim().toLowerCase();
  const entries = Object.keys(mapQueries).filter(name => name.toLowerCase().includes(query));
  document.querySelector("#mapList").innerHTML = entries.map(name => `
    <a class="list-link" href="${mapsUrl(name)}" target="_blank" rel="noopener">
      <strong>${name}</strong>
      <span>Open map</span>
    </a>
  `).join("");
}

function renderResources() {
  document.querySelector("#resourceList").innerHTML = resourceGroups.map(r => `
    <a class="list-link" href="${r.href}" target="_blank" rel="noopener">
      <div class="ticket-card__body">
        <strong>${r.label}</strong>
        <span>${r.why}</span>
      </div>
      <span style="flex:0 0 auto;font-size:0.8rem;color:var(--forest);font-weight:700">Open →</span>
    </a>
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

function renderInlineChecklist(items, key) {
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  return items.map((item, index) => `
    <label class="check-item check-item--compact">
      <input type="checkbox" data-key="${key}" data-index="${index}" ${saved[index] ? "checked" : ""}>
      <span>${item}</span>
    </label>
  `).join("");
}

function renderTickets() {
  document.querySelector("#ticketList").innerHTML = tickets.map(ticket => {
    const tag = ticket.href ? "a" : "div";
    const attrs = ticket.href
      ? `href="${ticket.href}" target="_blank" rel="noopener"`
      : "";
    const badge = ticket.status === "confirmed"
      ? `<span class="ticket-badge ticket-badge--confirmed">✓ Set</span>`
      : ticket.status === "pending"
      ? `<span class="ticket-badge ticket-badge--pending">Needed</span>`
      : `<span class="ticket-badge ticket-badge--action">To do</span>`;
    return `
    <${tag} class="list-link ticket-card" ${attrs}>
      <div class="ticket-card__body">
        <strong>${ticket.label}</strong>
        <span>${ticket.detail}</span>
        ${ticket.sub ? `<span class="ticket-card__sub">${ticket.sub}</span>` : ""}
      </div>
      ${badge}
    </${tag}>`;
  }).join("");
}

function statusForFlight(flight) {
  return flightStatusData?.flights?.find(item => item.id === `b6-${flight.number}`) || null;
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

function renderFlights() {
  document.querySelector("#flightPanel").innerHTML = flights.map(flight => `
    <details class="pocket-card" ${flight.number === "2184" ? "open" : ""}>
      <summary class="pocket-card__summary">
        <div>
          <span>${flight.time}</span>
          <strong>${flight.route}</strong>
          <p>${flight.day} | ${flight.airline} | Conf. ${flight.confirmation}</p>
        </div>
        <span class="summary-pill">${flight.number}</span>
      </summary>
      <div class="flight-pocket__body">
        <p><strong>${flight.terminal}</strong></p>
        <p>${flight.arrive}</p>
        ${renderFlightStatusBox(statusForFlight(flight))}
        <section class="flight-pocket__checklist">
          <strong>Before this leg</strong>
          <div class="checklist">
            ${renderInlineChecklist(flightReadiness[flight.number] || [], `flightReady:b6-${flight.number}`)}
          </div>
        </section>
        <div class="button-row">
          ${flightTrackers(flight).map(([label, url]) => `<a class="button button--secondary" href="${url}" target="_blank" rel="noopener">${label}</a>`).join("")}
        </div>
        <p class="flight-pocket__note">Use the JetBlue app on the phone for the most direct airline updates. The public JetBlue website does not deep-link cleanly into these exact flights, so this page now keeps the backup links short and practical.</p>
      </div>
    </details>
  `).join("");
}

function renderDepartureGuard() {
  document.querySelector("#departureGuardPanel").innerHTML = departureGuardrails.map(item => `
    <article class="info-card info-card--dark">
      <span>${item.date}</span>
      <strong>${item.title}</strong>
      <p>${item.anchor}</p>
      <ul class="bullet-list">${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderPhonePush() {
  document.querySelector("#phonePushPanel").innerHTML = `
    <article class="hero-card">
      <span>Guide reminders</span>
      <strong>Install ntfy on each phone</strong>
      <p>This is the phone push app for trip reminders, photo missions, departure nudges, and flight alerts. Install it first, then subscribe once.</p>
      <code class="topic-code">${ntfyTopic}</code>
      <div class="button-row">
        <a class="button" href="${appLinks.ntfyIos}" target="_blank" rel="noopener">Download for iPhone</a>
        <a class="button" href="${appLinks.ntfyAndroid}" target="_blank" rel="noopener">Download for Android</a>
        <a class="button button--secondary" href="https://ntfy.sh/${ntfyTopic}" target="_blank" rel="noopener">Open topic</a>
      </div>
    </article>
    <details class="pocket-card" open>
      <summary class="pocket-card__summary">
        <div>
          <span>iPhone setup</span>
          <strong>How to get guide reminders on iPhone</strong>
          <p>Keep this tight and practical.</p>
        </div>
      </summary>
      <ol class="bullet-list">
        <li>Install ntfy from the App Store.</li>
        <li>Open ntfy and allow notifications.</li>
        <li>Tap Add subscription and enter <code style="font-size:0.85em;background:#eee;padding:2px 6px;border-radius:4px">${ntfyTopic}</code></li>
        <li>Open JetBlue from the iPhone App Store too, then allow JetBlue notifications.</li>
        <li>Save this trip site to the home screen with Safari Share -> Add to Home Screen.</li>
      </ol>
      <div class="button-row">
        <a class="button button--secondary" href="${appLinks.jetBlueIos}" target="_blank" rel="noopener">JetBlue for iPhone</a>
        <a class="button button--secondary" href="${appLinks.tflIos}" target="_blank" rel="noopener">TfL Go for iPhone</a>
      </div>
    </details>
    <details class="pocket-card">
      <summary class="pocket-card__summary">
        <div>
          <span>Android setup</span>
          <strong>How to get guide reminders on Android</strong>
          <p>Same idea, just with Google Play.</p>
        </div>
      </summary>
      <ol class="bullet-list">
        <li>Install ntfy from Google Play.</li>
        <li>Open ntfy and allow notifications.</li>
        <li>Add the topic <code style="font-size:0.85em;background:#eee;padding:2px 6px;border-radius:4px">${ntfyTopic}</code></li>
        <li>Install JetBlue and TfL Go from Google Play and allow notifications.</li>
        <li>Add this trip site to the home screen from the browser menu if desired.</li>
      </ol>
      <div class="button-row">
        <a class="button button--secondary" href="${appLinks.jetBlueAndroid}" target="_blank" rel="noopener">JetBlue for Android</a>
        <a class="button button--secondary" href="${appLinks.tflAndroid}" target="_blank" rel="noopener">TfL Go for Android</a>
      </div>
    </details>
    <details class="pocket-card">
      <summary class="pocket-card__summary">
        <div>
          <span>Install the trip app</span>
          <strong>Save this guide to the home screen</strong>
          <p>Use the built-in install flow when the browser allows it.</p>
        </div>
      </summary>
      <ol class="bullet-list">
        <li>Tap the Install Trip App button when it appears.</li>
        <li>If no install button appears, use the browser menu and add the site to the home screen manually.</li>
        <li>All trip reminders and flight alerts use ntfy phone push. The website no longer asks for browser notification permission.</li>
      </ol>
      <div class="button-row">
        <button class="button button--secondary install-button" type="button" data-install-app hidden>Install Trip App</button>
      </div>
    </details>
  `;
}

function renderBooking() {
  document.querySelector("#bookingPanel").innerHTML = `
    <details class="pocket-card" open>
      <summary class="pocket-card__summary">
        <div>
          <span>${booking.status}</span>
          <strong>${booking.hotel}</strong>
          <p>${booking.dates}</p>
        </div>
      </summary>
      <div class="trip-facts">
        <article><span>Guest</span><strong>${booking.guest}</strong></article>
        <article><span>Address</span><strong>${booking.address}</strong></article>
        <article><span>Phone</span><strong>${booking.phone}</strong></article>
      </div>
      <div class="button-row">
        <a class="button" href="${mapsUrl("Hotel")}" target="_blank" rel="noopener">Hotel map</a>
        <a class="button button--secondary" href="https://www.booking.com/" target="_blank" rel="noopener">Booking.com</a>
      </div>
      <ul class="bullet-list">${booking.actionItems.map(item => `<li>${item}</li>`).join("")}</ul>
      <ul class="bullet-list">${booking.fillIns.map(item => `<li>${item}</li>`).join("")}</ul>
    </details>
  `;
}

function renderEmergencyContacts() {
  document.querySelector("#emergencyPanel").innerHTML = emergencyContacts.map(contact => `
    <a class="info-card emergency-card" href="${contact.href}">
      <span>${contact.label}</span>
      <strong>${contact.value}</strong>
      <p>${contact.note}</p>
    </a>
  `).join("");
}

function renderRecovery() {
  document.querySelector("#recoveryPanel").innerHTML = recoveryPlans.map((plan, index) => `
    <details class="pocket-card" ${index === 0 ? "open" : ""}>
      <summary class="pocket-card__summary">
        <div>
          <span>${plan.urgency}</span>
          <strong>${plan.title}</strong>
          <p>Open only when needed.</p>
        </div>
      </summary>
      <ol class="bullet-list">${plan.steps.map(step => `<li>${step}</li>`).join("")}</ol>
      <div class="button-row">
        ${plan.actions.map(action => renderActionButton(action, "button button--secondary")).join("")}
      </div>
    </details>
  `).join("");
}

async function loadFlightStatus({ force = false } = {}) {
  const summary = document.querySelector("#flightStatusSummary");
  summary.textContent = force ? "Checking latest site data..." : "Loading status...";

  try {
    const response = await fetch(`data/flight-status.json?ts=${Date.now()}`);
    if (!response.ok) throw new Error(`Status file ${response.status}`);
    flightStatusData = await response.json();
    summary.textContent = `Last updated: ${formatDateTime(flightStatusData.updatedAt)}`;
    renderFlights();
    if (force) showToast("Flight status refreshed from latest site data");
  } catch (error) {
    summary.textContent = "Status cache unavailable. Use tracker links.";
    if (force) showToast("Could not refresh cached status");
  }
}

// Keep the app as a true compartment interface instead of an infinite scroll page.
function setActivePanel(panelId, { pushHash = true } = {}) {
  for (const panel of document.querySelectorAll("[data-panel]")) {
    const isActive = panel.id === panelId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  }

  for (const button of document.querySelectorAll(".tab-button")) {
    const isActive = button.dataset.target === panelId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  if (pushHash) history.replaceState(null, "", `#${panelId}`);
}

function openDayPocket(dayId) {
  setActivePanel("overview");
  const pocket = document.getElementById(dayId);
  if (!pocket) return;
  document.querySelectorAll(".itinerary-pocket").forEach(dayPocket => {
    if (dayPocket !== pocket) dayPocket.open = false;
  });
  pocket.open = true;
  pocket.scrollIntoView({ behavior: "smooth", block: "start" });
}

function syncPanelFromLocation() {
  const panelFromQuery = new URLSearchParams(window.location.search).get("panel");
  const panelId = panelIds.includes(panelFromQuery)
    ? panelFromQuery
    : resolvePanelFromHash(window.location.hash, panelIds, "overview");
  setActivePanel(panelId, { pushHash: false });
}

function wireEvents() {
  document.querySelectorAll("[data-map]").forEach(link => {
    link.href = mapsUrl(link.dataset.map);
  });

  document.querySelector("#heroTubeDirections").href = directionsUrl("Hotel", "Pimlico Station", "walking");

  document.addEventListener("click", async event => {
    const targetButton = event.target.closest("[data-target]");
    if (targetButton) {
      setActivePanel(targetButton.dataset.target);
      return;
    }

    const dayButton = event.target.closest("[data-open-day]");
    if (dayButton) {
      openDayPocket(dayButton.dataset.openDay);
      return;
    }

    const copyButton = event.target.closest("[data-copy-hotel]");
    if (copyButton) {
      await navigator.clipboard.writeText(hotelAddress);
      showToast("Hotel address copied");
      return;
    }

  });

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    document.querySelectorAll("[data-install-app]").forEach(button => {
      button.hidden = false;
    });
  });

  document.addEventListener("click", async event => {
    const installButton = event.target.closest("[data-install-app]");
    if (!installButton) return;

    if (!deferredInstallPrompt) {
      showToast("Use your browser menu to add this guide to the home screen");
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    document.querySelectorAll("[data-install-app]").forEach(button => {
      button.hidden = true;
    });
  });

  document.addEventListener("change", event => {
    if (!event.target.matches("input[type='checkbox'][data-key]")) return;
    const key = event.target.dataset.key;
    const index = event.target.dataset.index;
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    saved[index] = event.target.checked;
    localStorage.setItem(key, JSON.stringify(saved));
  });

  document.querySelector("#mapSearch").addEventListener("input", event => {
    renderMaps(event.target.value);
  });

  document.querySelector("[data-refresh-flight-status]").addEventListener("click", async () => {
    await loadFlightStatus({ force: true });
  });

  window.addEventListener("hashchange", syncPanelFromLocation);
}

renderTodaySummary();
renderItinerary();
renderHotelActions();
renderRouteShortcuts();
renderTubePockets();
renderMaps();
renderResources();
renderTickets();
renderChecklist("#todoList", todo, "londonTripTodo");
renderChecklist("#packList", pack, "londonTripPack");
renderBooking();
renderEmergencyContacts();
renderRecovery();
renderDepartureGuard();
renderPhonePush();
renderFlights();
wireEvents();
syncPanelFromLocation();
loadFlightStatus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      showToast("Offline mode could not start on this browser");
    });
  });
}
