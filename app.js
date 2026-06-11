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
  "Big Ben": "Big Ben, London",
  "Borough Market": "Borough Market, London",
  "Boston Logan Airport": "Boston Logan International Airport",
  "Buckingham Palace": "Buckingham Palace, London",
  "Camden Market": "Camden Market, London",
  "Camden Town Station": "Camden Town Station, London",
  "Carnaby Street": "Carnaby Street, London",
  "Chinatown": "Chinatown Gate, London",
  "Covent Garden": "Covent Garden, London",
  "Gabriel's Wharf": "Gabriel's Wharf, London",
  "Hotel": "Holiday Inn Express London - Victoria, 106-110 Belgrave Road, London SW1V 2BJ",
  "JFK Airport": "John F. Kennedy International Airport",
  "Leicester Square Station": "Leicester Square Station, London",
  "London Bridge Station": "London Bridge Underground Station, London",
  "London Eye": "Riverside Building, County Hall, Westminster Bridge Rd, London SE1 7PB",
  "London Heathrow Airport": "London Heathrow Airport",
  "Neal's Yard": "Neal's Yard, Covent Garden, London",
  "Oxo Tower": "Oxo Tower, London",
  "Parliament Square": "Parliament Square, London",
  "Pimlico Station": "Pimlico Station, Bessborough Street, London SW1V 2JA",
  "RDU Airport": "Raleigh-Durham International Airport",
  "Regent's Canal": "Regent's Canal Camden Lock, London",
  "Seven Dials": "Seven Dials, London",
  "Soho": "Soho, London",
  "Southbank Centre": "Southbank Centre Royal Festival Hall, London",
  "St. James's Park": "St James's Park, London",
  "Tachbrook Street Market": "Tachbrook Street Market, Pimlico",
  "The Mall": "The Mall, London",
  "Tower Bridge": "Tower Bridge, London",
  "Tower Hill Station": "Tower Hill Station, London",
  "Tower of London": "Tower of London",
  "Trafalgar Square": "Trafalgar Square, London",
  "U.S. Embassy London": "U.S. Embassy London, 33 Nine Elms Lane, London SW11 7US",
  "Victoria Station": "Victoria Station Buckingham Palace Road entrance",
  "Westminster Abbey": "Westminster Abbey, London",
  "Westminster Bridge": "Westminster Bridge, London"
};

const mapIcons = {
  "Big Ben": "🕰️",
  "Borough Market": "🛒",
  "Boston Logan Airport": "✈️",
  "Buckingham Palace": "👑",
  "Camden Market": "🎨",
  "Camden Town Station": "🚇",
  "Carnaby Street": "🛍️",
  "Chinatown": "🥢",
  "Covent Garden": "🎭",
  "Gabriel's Wharf": "🎨",
  "Hotel": "🏨",
  "JFK Airport": "✈️",
  "Leicester Square Station": "🚇",
  "London Bridge Station": "🚇",
  "London Eye": "🎡",
  "London Heathrow Airport": "✈️",
  "Neal's Yard": "🌿",
  "Oxo Tower": "🏢",
  "Parliament Square": "🏛️",
  "Pimlico Station": "🚇",
  "RDU Airport": "✈️",
  "Regent's Canal": "🚣",
  "Seven Dials": "🕐",
  "Soho": "🎭",
  "Southbank Centre": "🎶",
  "St. James's Park": "🌳",
  "Tachbrook Street Market": "🛒",
  "The Mall": "👑",
  "Tower Bridge": "🌉",
  "Tower Hill Station": "🚇",
  "Tower of London": "🏰",
  "Trafalgar Square": "🦁",
  "U.S. Embassy London": "🇺🇸",
  "Victoria Station": "🚇",
  "Westminster Abbey": "⛪",
  "Westminster Bridge": "🌉"
};

const appLinks = {
  ntfyIos: "https://apps.apple.com/us/app/ntfy/id1625396347",
  ntfyAndroid: "https://play.google.com/store/apps/details?id=io.heckel.ntfy",
  tflIos: "https://apps.apple.com/us/app/tfl-go-plan-pay-travel/id1419541638",
  tflAndroid: "https://play.google.com/store/apps/details?id=uk.gov.tfl.gotfl",
  jetBlueIos: "https://apps.apple.com/us/app/jetblue-book-manage-trips/id481370590",
  jetBlueAndroid: "https://play.google.com/store/apps/details?id=com.jetblue.JetBlueAndroid",
  bigBusIos: "https://apps.apple.com/us/app/big-bus-tours/id590746945",
  bigBusAndroid: "https://play.google.com/store/apps/details?id=com.bigbustours.bbt",
  uberIos: "https://apps.apple.com/us/app/uber-request-a-ride/id368677368",
  uberAndroid: "https://play.google.com/store/apps/details?id=com.ubercab",
  freenowIos: "https://apps.apple.com/us/app/freenow-by-lyft-taxi-more/id357852748",
  freenowAndroid: "https://play.google.com/store/apps/details?id=taxi.android.client",
  googleMapsIos: "https://apps.apple.com/us/app/google-maps/id585027354",
  googleMapsAndroid: "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
  bookingIos: "https://apps.apple.com/us/app/booking-com-hotels-travel/id367003839",
  bookingAndroid: "https://play.google.com/store/apps/details?id=com.booking"
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
      ["Start the bus loop", "Open the Big Bus Tours app, retrieve booking VVXCH9SM, and activate the ticket only when you are ready to board on Friday, June 26. Walk to Victoria Station / Buckingham Palace Road entrance and board the Hop-On / Hop-Off Big Bus.", ["Victoria Station"]],
      ["Westminster photos", "Get off near London Eye / Westminster Bridge. Walk London Eye to Westminster Bridge to Big Ben photos to Parliament Square to Westminster Abbey exterior.", ["London Eye", "Westminster Bridge", "Big Ben", "Parliament Square", "Westminster Abbey"]],
      ["London Eye at 6:00 PM", "Use the standard tickets for Friday, June 26 at 6:00 PM. Arrival address: Riverside Building, County Hall, Westminster Bridge Rd, London SE1 7PB. Go directly to the London Eye at the selected time slot, join the queue when allowed, and expect about 30 minutes for one rotation.", ["London Eye"]],
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
  },
  {
    id: "day-4",
    date: "Monday, June 29",
    title: "Departure Day — Fly Home",
    image: null,
    imageWebp: null,
    area: "Heathrow Terminal 2",
    transport: "Uber/taxi from hotel to Heathrow; B6 20 LHR→JFK then B6 585 JFK→RDU",
    food: "Hotel breakfast, then airport food at Heathrow before boarding",
    night: "Back home in Raleigh by 8:33 PM EDT",
    launchRoute: ["Hotel", "London Heathrow Airport", "driving"],
    steps: [
      ["6:00 AM — wake up and final check", "Set alarms for 6:00 and 6:30 AM BST. Physical check before leaving: passports, wallet, phone, charger, medication, and all bags out of the safe.", ["Hotel"]],
      ["Leave hotel by 7:15 AM", "Book Uber or FREENOW to Heathrow Terminal 2. Target arrival at Heathrow by 8:55 AM. Allow extra time — London morning traffic is unpredictable.", ["London Heathrow Airport"]],
      ["Check in at Terminal 2", "B6 20 departs from Terminal 2. Use the JetBlue app for boarding passes. Queue for bag drop and security early.", ["London Heathrow Airport"]],
      ["Clear security and find the gate", "Security lines at Heathrow can be long. Go straight to the gate after clearing. Eat and charge phones airside before boarding.", []],
      ["Board B6 20 LHR → JFK", "Flight B6 20 departs 11:55 AM BST. Arrives JFK 3:25 PM EDT. Update the parent group text before boarding.", []],
      ["JFK connection — find gate first", "After landing at JFK, stay airside. Find the Raleigh gate before food or charging. If delayed or confused, talk to a JetBlue gate agent.", ["JFK Terminal 5"]],
      ["Board B6 585 JFK → RDU", "Departs 6:30 PM EDT from Terminal 5. Arrives Raleigh 8:33 PM EDT. Keep parent group text updated from JFK.", []]
    ],
    photo: "Last view of London from the plane if you get a window seat. Take it.",
    tired: "Skip any last-minute airport shopping and go to the gate early to rest before the long flight.",
    rain: "Airport day — weather doesn't change the plan."
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
      ["Download Apps", "panel:wallet"],
      ["Open Docs", "panel:wallet"]
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
    label: "Emergency services",
    value: "999 or 112",
    href: "tel:999",
    note: "Police, ambulance, fire, or immediate danger."
  },
  {
    label: "Police report line",
    value: "101",
    href: "tel:101",
    note: "Non-urgent police reports, theft, or missing property."
  },
  {
    label: "Medical advice",
    value: "111",
    href: "tel:111",
    note: "Medical help fast, but not life-threatening."
  }
];

const embassyHelp = {
  label: "U.S. Embassy London",
  phone: "+44 20 7499 9000",
  address: "33 Nine Elms Lane, London SW11 7US",
  note: "U.S. citizen help, emergency passports, and serious travel document problems.",
  actions: [
    ["Call Embassy", "tel:+442074999000"],
    ["Embassy Map", "map:U.S. Embassy London"],
    ["Travel.State.gov", "https://travel.state.gov/content/travel/en/international-travel/emergencies/lost-stolen-passport-abroad.html"]
  ]
};

const recoveryPlans = [
  {
    title: "Passport problem",
    urgency: "U.S. Embassy",
    steps: [
      "Use the embassy block above before reporting it lost. A passport reported lost cannot be used for travel even if found later.",
      "If it was stolen, file a police report and keep the report reference."
    ],
    actions: [
      ["File Police Report", "https://www.met.police.uk/ro/report/"]
    ]
  },
  {
    title: "Phone missing",
    urgency: "Find or lock",
    steps: [
      "Use Find My iPhone or Google Find My Device from the other phone.",
      "If it was left on the Tube, bus, Elizabeth line, or station, use Transport for London lost property.",
      "If it is gone, lock it remotely and use hotel Wi-Fi or the front desk."
    ],
    actions: [
      ["Find My iPhone", "https://www.icloud.com/find"],
      ["Find Android", "https://www.google.com/android/find/"],
      ["Transport Lost Property", "https://tfl.gov.uk/help-and-contact/lost-property"]
    ]
  },
  {
    title: "Wallet or card missing",
    urgency: "Freeze cards",
    steps: [
      "Open the bank app first and freeze the missing card if possible.",
      "Use the number on the back of the card or in the bank app first. Use the numbers below if that is not available.",
      "If the wallet was stolen, file a police report and keep the report reference."
    ],
    actions: [
      ["Chase Cards", "tel:+13025948200"],
      ["American Express", "tel:+13363931111"],
      ["File Police Report", "https://www.met.police.uk/ro/report/"]
    ],
    detail: "Chase card services outside the U.S.: +1 302 594 8200. American Express overseas collect: +1 336 393 1111."
  },
  {
    title: "Transit or venue lost property",
    urgency: "Official forms",
    steps: [
      "Use this for items left on the Tube, buses, Elizabeth line, stations, or major London venues.",
      "Include the route, stop, time, and a clear item description.",
      "Keep the hotel map handy as the practical meeting point if a pickup is needed."
    ],
    actions: [
      ["Transport for London Lost Property", "https://tfl.gov.uk/help-and-contact/lost-property"],
      ["Hotel Map", "map:Hotel"]
    ]
  }
];

const flightScreenshot = "assets/flight_itinerary.jpg";
const ntfyTopic = "london-birthday-trip-2026-a9x4m2q7";
const tubeMapUrl = "https://content.tfl.gov.uk/standard-tube-map.pdf";

const todo = [
  {
    section: "Marianna",
    items: [
      "Order British pounds from Chase",
      "Apply for UK ETA for Tiffany at gov.uk",
      "Collin's UK ETA is approved, reference 2021-2606-1009-0807, linked to passport ending 1892",
      "Confirm Big Bus booking VVXCH9SM appears in the Big Bus Tours app; activate only on Friday, June 26 when ready to board",
      "London Eye order 605056784 is confirmed for Friday, June 26 at 6:00 PM",
      "Buy portable chargers for Tiffany and Collin's phones",
      "Confirm hotel can store bags on arrival morning before check-in"
    ]
  },
  {
    section: "Tiffany & Collin",
    items: [
      "Use the Download Apps section to install JetBlue, Big Bus, TfL Go, ntfy, Google Maps, Uber, FREENOW, and Booking.com",
      "Confirm JetBlue booking KDHSOU appears in the JetBlue app",
      "Confirm Big Bus booking VVXCH9SM appears in the Big Bus Tours app",
      "Subscribe to the ntfy trip alert topic",
      "Save offline Google Maps for London",
      "Set up Uber and FREENOW payment before leaving",
      "Save parent travel consent letter as PDF on both phones"
    ]
  }
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
    label: "Hotel — Holiday Inn Express Victoria",
    detail: "June 26-29, 2026 · Booking.com confirmation 6945.109.446",
    sub: "PIN 4412 · Lodging confirmation 88897847 · Tap for the Booking.com PDF",
    href: "assets/hotel-booking-confirmation.pdf",
    actionLabel: "PDF",
    status: "confirmed"
  },
  {
    label: "JetBlue — All 4 flights",
    detail: "RDU→BOS→LHR outbound · LHR→JFK→RDU return",
    sub: "Open JetBlue app to check in and get boarding passes",
    copyCode: "KDHSOU",
    codeColor: "red",
    codeLabel: "Confirmation",
    status: "confirmed"
  },
  {
    label: "Big Bus London hop-on hop-off",
    detail: "Friday, June 26 · 1 Day Hop-On Hop-Off Bus Only · 1 adult and 1 child",
    copyCode: "VVXCH9SM",
    codeColor: "amber",
    codeLabel: "Booking ref",
    instructions: ["Download the Big Bus Tours app (see App Setup below)", "Tap \"Add Booking\" → enter VVXCH9SM", "Activate only on the day when ready to board — not before"],
    href: "https://www.bigbustours.com/retrieve-booking/VVXCH9SM/Bediner",
    status: "confirmed"
  },
  {
    label: "London Eye",
    detail: "Friday, June 26 at 6:00 PM · London Eye excursion · 2 standard tickets",
    sub: "Order ID: 605056784 · 1 adult and 1 child · £55.00 total · This is order info, not the scannable ticket",
    href: "https://www.google.com/maps/search/?api=1&query=Riverside+Building,+County+Hall,+Westminster+Bridge+Rd,+London+SE1+7PB",
    status: "confirmed"
  },
  {
    label: "UK ETA — Tiffany",
    detail: "Electronic Travel Authorisation required for US citizens entering UK — authorisation number needed",
    href: "https://www.gov.uk/apply-uk-visa",
    status: "pending"
  },
  {
    label: "UK ETA — Collin",
    detail: "Approved · Reference: 2021-2606-1009-0807 · Valid until March 7, 2028",
    sub: "Linked to passport ending 1892. This is an ETA approval, not a printed visa; passport is what he needs at travel.",
    href: "https://www.gov.uk/check-eta",
    status: "confirmed"
  },
  {
    label: "Parent travel consent letter",
    detail: "Signed PDF authorising Tiffany and Collin to travel",
    sub: "Tap to open the parental travel consent letter on this phone",
    href: "assets/parental-travel-consent-letter.pdf",
    actionLabel: "PDF",
    status: "confirmed"
  }
];

const booking = {
  status: "Confirmed on Booking.com",
  guest: "Tiffany Bediner",
  hotel: "Holiday Inn Express London - Victoria",
  address: "106-110 Belgrave Road, London SW1V 2BJ, United Kingdom",
  phone: "+44 20 7630 8888",
  dates: "June 26-29, 2026",
  confirmation: "6945.109.446",
  lodgingConfirmation: "88897847",
  pin: "4412",
  checkIn: "Friday, June 26 · 2:00 PM-12:00 AM",
  checkOut: "Monday, June 29 · 5:00-11:00 AM",
  room: "Standard Room with Free Hot Breakfast · 1 adult, 1 child",
  pdf: "assets/hotel-booking-confirmation.pdf",
  actionItems: [
    "Approximate arrival request is 9:00-10:00 AM; ask the front desk to store bags until check-in.",
    "Breakfast is included in the final price.",
    "Bring photo ID and credit card for check-in."
  ],
  fillIns: []
};

const appDownloads = [
  {
    label: "JetBlue",
    why: "Check in, boarding passes, gate changes, and flight status for KDHSOU.",
    ios: appLinks.jetBlueIos,
    android: appLinks.jetBlueAndroid
  },
  {
    label: "Big Bus Tours",
    why: "Add booking VVXCH9SM, routes, stops, and live bus arrivals.",
    ios: appLinks.bigBusIos,
    android: appLinks.bigBusAndroid
  },
  {
    label: "TfL Go",
    why: "Tube routes, live departures, disruption alerts, and station details.",
    ios: appLinks.tflIos,
    android: appLinks.tflAndroid
  },
  {
    label: "ntfy",
    why: "Trip reminders and flight push alerts from this guide.",
    ios: appLinks.ntfyIos,
    android: appLinks.ntfyAndroid
  },
  {
    label: "Google Maps",
    why: "Save offline London maps and open every trip destination.",
    ios: appLinks.googleMapsIos,
    android: appLinks.googleMapsAndroid
  },
  {
    label: "Uber",
    why: "Best tired or late fallback for getting back to the hotel.",
    ios: appLinks.uberIos,
    android: appLinks.uberAndroid
  },
  {
    label: "FREENOW",
    why: "Official London black cabs as a backup to Uber.",
    ios: appLinks.freenowIos,
    android: appLinks.freenowAndroid
  },
  {
    label: "Booking.com",
    why: "Open and manage the hotel reservation from the phone.",
    ios: appLinks.bookingIos,
    android: appLinks.bookingAndroid
  }
];

const resourceGroups = [
  { label: "Uber — London", href: "https://www.uber.com/gb/en/", why: "Best backup when tired — works exactly like in the US" },
  { label: "FREENOW — black cabs", href: "https://www.free-now.com/uk/", why: "Book official London black cabs from your phone" },
  { label: "TfL Journey Planner", href: "https://tfl.gov.uk/plan-a-journey/", why: "Live route planning with real-time disruption alerts" },
  { label: "Google Maps London", href: "https://www.google.com/maps/place/London,+UK", why: "Download offline before leaving — works without signal" },
  { label: "Tube map (PDF)", href: tubeMapUrl, why: "Full network map — no signal or app needed" }
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
    ["Live status", `https://www.google.com/search?q=${googleQuery}`]
  ];
}

function sameTabTravelLink(href, label, className = "button") {
  return `<a class="${className}" href="${href}">${label}</a>`;
}

// "Friday, June 26" → { abbr: "FRI", short: "Jun 26" }
function parseDayBadge(dateStr) {
  const comma = dateStr.indexOf(",");
  const abbr = dateStr.substring(0, 3).toUpperCase();
  const rest = dateStr.substring(comma + 2); // "June 26"
  const spaceIdx = rest.indexOf(" ");
  const short = rest.substring(0, 3) + " " + rest.substring(spaceIdx + 1);
  return { abbr, short };
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
    <article class="hero-card">
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
      <span>Push alerts</span>
      <strong>Install ntfy before travel</strong>
      <p>Trip reminders and flight alerts use phone push. Set it up before anyone is on airport Wi-Fi.</p>
      <div class="button-row">
        <button class="button button--secondary" type="button" data-open-push-setup>Set up alerts →</button>
      </div>
    </article>
  `;
}

function renderItinerary() {
  document.querySelector("#itineraryList").innerHTML = days.map((day, index) => `
    <details class="pocket-card itinerary-pocket" id="${day.id}" data-day="${index + 1}">
      <summary class="pocket-card__summary itinerary-summary">
        <div class="day-badge day-badge--${index + 1}">
          <span class="day-badge__num">${parseDayBadge(day.date).abbr}</span>
          <span class="day-badge__label">${parseDayBadge(day.date).short}</span>
        </div>
        <div class="itinerary-summary__text">
          <span class="itinerary-summary__date">${day.date}</span>
          <strong>${day.title}</strong>
          <p class="itinerary-summary__area">${day.area}</p>
        </div>
      </summary>
      ${day.image ? `<div class="itinerary-pocket__media">
        <picture>
          <source srcset="${day.imageWebp}" type="image/webp">
          <img src="${day.image}" alt="${escapeHtml(day.title)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
        </picture>
      </div>` : ""}
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
  const modeIcon = { walking: "🚶", transit: "🚇", driving: "🚗" };
  document.querySelector("#routeShortcutList").innerHTML = routeShortcuts.map(route => `
    <article class="route-pocket">
      <div>
        <span>${modeIcon[route.mode] || ""} ${route.mode}</span>
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
      <strong>${mapIcons[name] ? `<span aria-hidden="true">${mapIcons[name]}</span> ` : ""}${name}</strong>
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
      <span style="flex:0 0 auto;font-size:0.8rem;color:var(--accent);font-weight:700">Open →</span>
    </a>
  `).join("");
}

function renderAppDownloads() {
  document.querySelector("#appDownloadList").innerHTML = appDownloads.map(app => `
    <article class="app-download-card">
      <div class="ticket-card__body">
        <strong>${app.label}</strong>
        <span>${app.why}</span>
      </div>
      <div class="app-download-card__actions">
        <a class="button button--secondary" href="${app.ios}" target="_blank" rel="noopener">iPhone</a>
        <a class="button button--secondary" href="${app.android}" target="_blank" rel="noopener">Android</a>
      </div>
    </article>
  `).join("");
}

function renderChecklist(selector, items, key) {
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  // Support both flat string arrays and sectioned arrays [{section, items}]
  if (items.length && typeof items[0] === "object" && items[0].section) {
    let html = "";
    let idx = 0;
    for (const group of items) {
      html += `<p class="checklist-section__label">${group.section}</p>`;
      for (const item of group.items) {
        html += `<label class="check-item">
          <input type="checkbox" data-key="${key}" data-index="${idx}" ${saved[idx] ? "checked" : ""}>
          <span>${item}</span>
        </label>`;
        idx++;
      }
    }
    document.querySelector(selector).innerHTML = html;
  } else {
    document.querySelector(selector).innerHTML = items.map((item, index) => `
      <label class="check-item">
        <input type="checkbox" data-key="${key}" data-index="${index}" ${saved[index] ? "checked" : ""}>
        <span>${item}</span>
      </label>
    `).join("");
  }
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
    const badge = ticket.status === "confirmed"
      ? `<span class="ticket-badge ticket-badge--confirmed">✓ Set</span>`
      : ticket.status === "pending"
      ? `<span class="ticket-badge ticket-badge--pending">Needed</span>`
      : `<span class="ticket-badge ticket-badge--action">To do</span>`;

    const refChip = ticket.copyCode ? `
      <div class="ref-row">
        <span class="ref-chip ref-chip--${ticket.codeColor}">${ticket.copyCode}</span>
        <button class="copy-btn" type="button" data-copy-ref="${ticket.copyCode}" aria-label="Copy ${ticket.codeLabel}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </button>
      </div>` : "";

    const steps = ticket.instructions ? `
      <ol class="ticket-steps">${ticket.instructions.map(s => `<li>${s}</li>`).join("")}</ol>` : "";

    const linkEl = ticket.href ? `
      <a class="ticket-item__link" href="${ticket.href}" target="_blank" rel="noopener">${ticket.actionLabel ? `${ticket.actionLabel} →` : "Open →"}</a>` : "";

    return `
    <div class="ticket-item">
      <div class="ticket-item__header">
        <span class="ticket-item__label">${ticket.label}</span>
        ${badge}
      </div>
      <p class="ticket-item__detail">${ticket.detail}</p>
      ${ticket.sub ? `<p class="ticket-item__sub">${ticket.sub}</p>` : ""}
      ${refChip}
      ${steps}
      ${linkEl}
    </div>`;
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

function renderFlightStatusOverview() {
  const el = document.querySelector("#flightStatusOverview");
  if (!el) return;
  const statusDotClass = (flight) => {
    const s = statusForFlight(flight);
    if (!s) return "status-dot--upcoming";
    const kind = (s.statusKind || "").toLowerCase();
    if (kind === "ok") return "status-dot--on-time";
    if (kind === "delayed" || kind === "cancelled" || kind === "alert") return "status-dot--delayed";
    return "status-dot--upcoming";
  };
  const statusLabel = (flight) => {
    const s = statusForFlight(flight);
    if (!s) return "Upcoming";
    return s.status || "Upcoming";
  };
  el.innerHTML = `
    <div class="flight-status-overview">
      <div class="flight-status-overview__header">
        All 4 Legs
        <span class="flight-status-overview__updated" id="overviewUpdated"></span>
      </div>
      ${flights.map(f => `
        <div class="flight-status-leg flight-status-leg--clickable" data-scroll-to-flight="${f.number}" role="button" tabindex="0" title="Tap to see details for B6 ${f.number}">
          <span class="status-dot ${statusDotClass(f)}"></span>
          <div class="flight-status-leg__route">
            <span class="flight-leg-code">${f.route.replace(" → ", "").split(" ").slice(0,1)[0] || f.route}</span>
            <span class="flight-leg-arrow">→</span>
            <span class="flight-leg-code">${f.route.split(" → ")[1] || ""}</span>
          </div>
          <span class="flight-status-leg__date">${f.day.split(",")[0]}</span>
          <span class="flight-status-leg__label" style="color:${
            (statusForFlight(f)?.statusKind || "") === "ok" ? "var(--success)" :
            ["delayed","cancelled","alert"].includes((statusForFlight(f)?.statusKind || "").toLowerCase()) ? "var(--warning)" :
            "var(--text-secondary)"
          }">${statusLabel(f)}</span>
          <span class="flight-status-leg__cta">Details ›</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDocsProgressBar() {
  const el = document.querySelector("#docsProgressBar");
  if (!el) return;
  const total = tickets.length;
  const confirmed = tickets.filter(t => t.status === "confirmed").length;
  const needed = tickets.filter(t => t.status === "pending" || t.status === "action");
  const pct = Math.round((confirmed / total) * 100);
  const neededNames = needed.map(t => t.label.split(" — ")[0].split(" hop")[0]);
  el.innerHTML = `
    <div class="docs-progress">
      <div class="docs-progress__text">
        <span>Documents ready</span>
        <strong>${confirmed} of ${total} confirmed</strong>
      </div>
      <div class="docs-progress__track">
        <div class="docs-progress__fill" style="width:${pct}%"></div>
      </div>
    </div>
    ${needed.length > 0 ? `
    <div class="needed-alert">
      <div class="needed-alert__label">Still needed</div>
      <div class="needed-alert__title">${needed.length} item${needed.length !== 1 ? "s" : ""} missing</div>
      <div class="needed-alert__items">
        ${neededNames.map(name => `
          <div class="needed-alert__item">
            <span class="needed-dot"></span>${name}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""}
  `;
}

function renderDayIndicator() {
  const el = document.querySelector("#dayIndicator");
  const textEl = document.querySelector("#dayIndicatorText");
  if (!el || !textEl) return;
  const now = new Date();
  const tripDays = [
    { id: "day-1", date: new Date("2026-06-26T00:00:00+01:00") },
    { id: "day-2", date: new Date("2026-06-27T00:00:00+01:00") },
    { id: "day-3", date: new Date("2026-06-28T00:00:00+01:00") }
  ];
  const today = tripDays.find(d => {
    const start = new Date(d.date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return now >= start && now < end;
  });
  if (today) {
    textEl.textContent = `Day ${tripDays.indexOf(today) + 1} of 3`;
    el.hidden = false;
  } else if (now >= new Date("2026-06-26T00:00:00+01:00") && now < new Date("2026-06-30T00:00:00+01:00")) {
    textEl.textContent = "Trip in progress";
    el.hidden = false;
  }
}

function renderFlights() {
  renderFlightStatusOverview();
  document.querySelector("#flightPanel").innerHTML = flights.map(flight => `
    <details class="pocket-card" id="flight-${flight.number}" ${flight.number === "2184" ? "open" : ""}>
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
        <p class="flight-pocket__note">Use the <a href="${appLinks.jetBlueIos}" target="_blank" rel="noopener" style="color:var(--accent)">JetBlue app (iPhone)</a> or <a href="${appLinks.jetBlueAndroid}" target="_blank" rel="noopener" style="color:var(--accent)">JetBlue app (Android)</a> for the most direct airline updates. The Live Status link above opens a Google search for real-time status.</p>
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
      <span>Push Alerts — Do this before the trip</span>
      <strong>Install ntfy on each phone</strong>
      <p>Trip reminders, departure nudges, and flight alerts all come through ntfy. Install it, subscribe to the topic below, done.</p>

      <div class="topic-row">
        <code class="topic-code">${ntfyTopic}</code>
        <button class="copy-btn" type="button" data-copy-topic aria-label="Copy topic">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </button>
      </div>

      <div class="button-row">
        <a class="button" href="${appLinks.ntfyIos}" target="_blank" rel="noopener">📱 App Store — iPhone</a>
        <a class="button" href="${appLinks.ntfyAndroid}" target="_blank" rel="noopener">📱 Google Play — Android</a>
        <a class="button button--secondary" href="https://ntfy.sh/${ntfyTopic}" target="_blank" rel="noopener">Open topic on web</a>
      </div>

      <ol class="bullet-list" style="margin-top:14px">
        <li>Install ntfy from the Download Apps section</li>
        <li>Open ntfy → tap "+ Add topic" → paste the topic above → tap Save</li>
        <li>Allow notifications when prompted</li>
        <li>Also install <a href="${appLinks.jetBlueIos}" target="_blank" rel="noopener" style="color:var(--accent)">JetBlue (iPhone)</a> or <a href="${appLinks.jetBlueAndroid}" target="_blank" rel="noopener" style="color:var(--accent)">JetBlue (Android)</a> and allow its notifications too</li>
      </ol>
    </article>

    <details class="pocket-card">
      <summary class="pocket-card__summary">
        <div>
          <span>Save this guide</span>
          <strong>Add to home screen (works offline)</strong>
          <p>Install on iPhone or Android via Chrome — works without Wi-Fi once saved.</p>
        </div>
      </summary>
      <ol class="bullet-list">
        <li><strong>iPhone — Chrome:</strong> Tap the share button (⊡) at the bottom → "Add to Home Screen"</li>
        <li><strong>Android — Chrome:</strong> Tap ⋮ (three dots) → "Add to Home Screen" or "Install App"</li>
        <li>The guide works offline once installed — no signal required to read routes and plans</li>
      </ol>
      <div class="button-row">
        <button class="button install-button" type="button" data-install-app hidden>📲 Install App (tap here)</button>
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
      <div class="trip-facts trip-facts--single">
        <article><span>Guest</span><strong>${booking.guest}</strong></article>
        <article><span>Booking.com confirmation</span><strong>${booking.confirmation}</strong></article>
        <article><span>Lodging confirmation</span><strong>${booking.lodgingConfirmation}</strong></article>
        <article><span>PIN</span><strong>${booking.pin}</strong></article>
        <article><span>Check-in</span><strong>${booking.checkIn}</strong></article>
        <article><span>Check-out</span><strong>${booking.checkOut}</strong></article>
        <article><span>Room</span><strong>${booking.room}</strong></article>
        <article><span>Address</span><strong>${booking.address}</strong></article>
        <article><span>Phone</span><strong><a href="tel:${booking.phone.replace(/\s/g,'')}" style="color:inherit;text-decoration:none">${booking.phone}</a></strong></article>
      </div>
      <div class="button-row">
        <a class="button" href="${mapsUrl("Hotel")}" target="_blank" rel="noopener">Hotel map</a>
        <a class="button button--secondary" href="${booking.pdf}" target="_blank" rel="noopener">Open confirmation PDF</a>
      </div>
      <ul class="bullet-list">${booking.actionItems.map(item => `<li>${item}</li>`).join("")}</ul>
    </details>
  `;
}

function renderAppSetup() {
  document.querySelector("#appSetupPanel").innerHTML = `
    <div class="setup-section">
      <p class="setup-label">Flight alerts — ntfy</p>
      <p class="setup-note">Trip reminders, departure nudges, and flight alerts come through ntfy.</p>
      <div class="topic-row" style="margin-top:4px">
        <code class="topic-code">${ntfyTopic}</code>
        <button class="copy-btn" type="button" data-copy-topic aria-label="Copy topic">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </button>
      </div>
      <div class="button-row" style="margin-top:8px">
        <a class="button" href="${appLinks.ntfyIos}" target="_blank" rel="noopener">App Store — iPhone</a>
        <a class="button" href="${appLinks.ntfyAndroid}" target="_blank" rel="noopener">Google Play — Android</a>
      </div>
      <ol class="ticket-steps" style="margin-top:8px">
        <li>Install ntfy using the links above</li>
        <li>Open ntfy → tap "+ Add topic" → paste the topic above → tap Save</li>
        <li>Allow notifications when prompted</li>
      </ol>
    </div>

    <div class="setup-section">
      <p class="setup-label">JetBlue app</p>
      <p class="setup-note">Check in, see boarding passes, and track flight status. Confirmation: <strong>KDHSOU</strong></p>
      <div class="button-row" style="margin-top:8px">
        <a class="button" href="${appLinks.jetBlueIos}" target="_blank" rel="noopener">App Store — iPhone</a>
        <a class="button" href="${appLinks.jetBlueAndroid}" target="_blank" rel="noopener">Google Play — Android</a>
      </div>
    </div>

    <div class="setup-section">
      <p class="setup-label">TfL Go</p>
      <p class="setup-note">Transport for London — plan every Tube move and see live departures.</p>
      <div class="button-row" style="margin-top:8px">
        <a class="button" href="${appLinks.tflIos}" target="_blank" rel="noopener">App Store — iPhone</a>
        <a class="button" href="${appLinks.tflAndroid}" target="_blank" rel="noopener">Google Play — Android</a>
      </div>
    </div>

    <div class="setup-section">
      <p class="setup-label">Big Bus Tours app</p>
      <p class="setup-note">Store hop-on hop-off tickets and route maps. Booking ref: <strong>VVXCH9SM</strong></p>
      <div class="button-row" style="margin-top:8px">
        <a class="button" href="${appLinks.bigBusIos}" target="_blank" rel="noopener">App Store — iPhone</a>
        <a class="button" href="${appLinks.bigBusAndroid}" target="_blank" rel="noopener">Google Play — Android</a>
      </div>
    </div>

    <div class="setup-section">
      <p class="setup-label">Install this guide</p>
      <p class="setup-note">Add to home screen — works offline once saved.</p>
      <ol class="ticket-steps" style="margin-top:4px">
        <li><strong>iPhone — Chrome:</strong> Tap share (⊡) → "Add to Home Screen"</li>
        <li><strong>Android — Chrome:</strong> Tap ⋮ → "Add to Home Screen" or "Install App"</li>
      </ol>
      <div class="button-row" style="margin-top:8px">
        <button class="button install-button" type="button" data-install-app hidden>📲 Install App</button>
      </div>
    </div>
  `;
}

function renderEmergencyContacts() {
  const [emergency, police, nhs] = emergencyContacts;
  document.querySelector("#emergencyPanel").innerHTML = `
    <div class="emergency-grid">
      <a class="emergency-card emergency-card--critical" href="${emergency.href}">
        <div class="emergency-card__content">
          <span class="emergency-card__type">${emergency.label}</span>
          <span class="emergency-card__number">${emergency.value}</span>
          <span class="emergency-card__desc">${emergency.note}</span>
        </div>
        <span class="call-btn call-btn--primary">Call 999</span>
      </a>
      <a class="emergency-card" href="${police.href}">
        <span class="emergency-card__type">${police.label}</span>
        <span class="emergency-card__number">${police.value}</span>
        <span class="emergency-card__desc">${police.note}</span>
        <span class="call-btn call-btn--secondary">Call 101</span>
      </a>
      <a class="emergency-card" href="${nhs.href}">
        <span class="emergency-card__type">${nhs.label}</span>
        <span class="emergency-card__number">${nhs.value}</span>
        <span class="emergency-card__desc">${nhs.note}</span>
        <span class="call-btn call-btn--secondary">Call 111</span>
      </a>
    </div>
    <section class="panel-card emergency-card--embassy-detail">
      <div class="emergency-card__content">
        <span class="emergency-card__type">${embassyHelp.label}</span>
        <strong>${embassyHelp.address}</strong>
        <span class="emergency-card__number">${embassyHelp.phone}</span>
        <span class="emergency-card__desc">${embassyHelp.note}</span>
      </div>
      <div class="button-row">
        ${embassyHelp.actions.map(action => renderActionButton(action, "button button--secondary")).join("")}
      </div>
    </section>
  `;
}

function renderRecovery() {
  document.querySelector("#recoveryPanel").innerHTML = recoveryPlans.map((plan, index) => `
    <details class="pocket-card" ${index === 0 ? "open" : ""}>
      <summary class="pocket-card__summary">
        <div class="emergency-card__content">
          <span>${plan.urgency}</span>
          <strong>${plan.title}</strong>
          <p>${plan.detail || "Open only when needed."}</p>
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

  for (const button of document.querySelectorAll(".nav-item[data-target]")) {
    const isActive = button.dataset.target === panelId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  if (pushHash) history.pushState(null, "", `#${panelId}`);
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

  // Support #day-N deep links — e.g. share a URL like index.html#day-1 to open Day 1
  const hash = window.location.hash.slice(1);
  if (/^day-[1-4]$/.test(hash)) {
    setActivePanel("overview", { pushHash: false });
    setTimeout(() => openDayPocket(hash), 100);
    return;
  }

  const panelId = panelIds.includes(panelFromQuery)
    ? panelFromQuery
    : resolvePanelFromHash(window.location.hash, panelIds, "overview");
  setActivePanel(panelId, { pushHash: false });
}

function wireEvents() {
  document.querySelectorAll("[data-map]").forEach(link => {
    link.href = mapsUrl(link.dataset.map);
  });

  document.querySelector("#heroTubeDirections").href = "https://www.google.com/maps/dir/?api=1&destination=nearest%20London%20Underground%20station&travelmode=walking";

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

    const copyHotelButton = event.target.closest("[data-copy-hotel]");
    if (copyHotelButton) {
      await navigator.clipboard.writeText(hotelAddress);
      showToast("Hotel address copied");
      return;
    }

    const copyTopicButton = event.target.closest("[data-copy-topic]");
    if (copyTopicButton) {
      await navigator.clipboard.writeText(ntfyTopic);
      showToast("Topic copied — paste into ntfy");
      return;
    }

    const copyRefButton = event.target.closest("[data-copy-ref]");
    if (copyRefButton) {
      await navigator.clipboard.writeText(copyRefButton.dataset.copyRef);
      showToast("Copied");
      return;
    }

    const pushSetupButton = event.target.closest("[data-open-push-setup]");
    if (pushSetupButton) {
      setActivePanel("wallet");
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => {
        document.querySelector("#appSetupPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return;
    }

    const flightLeg = event.target.closest("[data-scroll-to-flight]");
    if (flightLeg) {
      const pocket = document.querySelector(`#flight-${flightLeg.dataset.scrollToFlight}`);
      if (pocket) {
        pocket.open = true;
        pocket.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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

  // popstate fires on browser back/forward — lets swipe-back navigate panels instead of exiting
  window.addEventListener("popstate", syncPanelFromLocation);
}

renderTodaySummary();
renderItinerary();
renderHotelActions();
renderRouteShortcuts();
renderTubePockets();
renderMaps();
renderResources();
renderDocsProgressBar();
renderTickets();
renderAppSetup();
renderChecklist("#todoList", todo, "londonTripTodo");
renderChecklist("#packList", pack, "londonTripPack");
renderEmergencyContacts();
renderRecovery();
renderDepartureGuard();
renderFlights();
renderDayIndicator();
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
