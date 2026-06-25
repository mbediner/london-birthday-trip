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
  "JFK Terminal 5": "JFK Terminal 5, Queens, NY",
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
    note: "Departure morning route. Aim for Terminal 2 around 8:45 AM for the 11:55 AM flight."
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
    snapshot: {
      summary: "Land, drop bags, keep the first day easy, then anchor the evening around the London Eye.",
      path: [
        { label: "Heathrow", map: "London Heathrow Airport" },
        { label: "Passport control eGates", map: "London Heathrow Airport" },
        { label: "Hotel bag drop", map: "Hotel" },
        { label: "Victoria lunch", map: "Tachbrook Street Market" },
        { label: "Big Bus", map: "Victoria Station" },
        { label: "Westminster photos", map: "Westminster Bridge" },
        { label: "London Eye", map: "London Eye" },
        { label: "South Bank dinner", map: "Southbank Centre" },
        { label: "Uber home", map: "Hotel" }
      ]
    },
    steps: [
      ["Arrive and get to the hotel", "Land at Heathrow at 10:40 AM BST on United UA 924. After immigration and bags, go straight to Holiday Inn Express London - Victoria. Check-in is later, so the goal is to drop bags before sightseeing.", ["London Heathrow Airport", "Hotel"]],
      ["Use passport control eGates", "Tiffany and Collin should be able to use the UK eGates with eligible biometric U.S. passports because they are 10 or older and traveling with an adult. Follow eGates signage first. If the gates refer them to an officer, stay together and use the staffed passport-control line.", ["London Heathrow Airport"]],
      ["Drop bags before check-in", "Ask the front desk to store luggage until check-in. Keep passports, wallets, phones, chargers, tickets, and medication with you.", ["Hotel"]],
      ["Eat near the hotel", "After the bags are stored, walk to Tachbrook Street / Warwick Way for an easy cafe or casual restaurant.", ["Tachbrook Street Market"]],
      ["Start the bus loop", "Open the Big Bus Tours app, retrieve booking VVXCH9SM, and activate the ticket only when you are ready to board on Friday, June 26. Walk to Victoria Station / Buckingham Palace Road entrance and board the Hop-On / Hop-Off Big Bus.", ["Victoria Station"]],
      ["Westminster photos", "Get off near London Eye / Westminster Bridge. Walk London Eye to Westminster Bridge to Big Ben photos to Parliament Square to Westminster Abbey exterior.", ["London Eye", "Westminster Bridge", "Big Ben", "Parliament Square", "Westminster Abbey"]],
      ["London Eye at 6:00 PM", "Use the standard tickets for Friday, June 26 at 6:00 PM. Arrival address: Riverside Building, County Hall, Westminster Bridge Rd, London SE1 7PB. Go directly to the London Eye at the selected time slot, join the queue when allowed, and expect about 30 minutes for one rotation.", ["London Eye"]],
      ["Dinner and river walk", "Walk along Queen's Walk. Eat around Southbank Centre / Royal Festival Hall. If energy is good, continue toward Gabriel's Wharf or Oxo Tower.", ["Southbank Centre", "Gabriel's Wharf", "Oxo Tower"]],
      ["Go home", "Take Uber directly back to the hotel. Night 1 return is Uber or black cab, not the Tube.", ["Hotel"]]
    ],
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
    snapshot: {
      summary: "Classic London sights first, food market for lunch, then an easy West End wander.",
      path: [
        { label: "Hotel breakfast", map: "Hotel" },
        { label: "Tower Hill", map: "Tower Hill Station" },
        { label: "Tower of London", map: "Tower of London" },
        { label: "Tower Bridge", map: "Tower Bridge" },
        { label: "Borough Market", map: "Borough Market" },
        { label: "Covent Garden", map: "Covent Garden" },
        { label: "Soho / Chinatown", map: "Chinatown" },
        { label: "Hotel", map: "Hotel" }
      ]
    },
    steps: [
      ["Breakfast", "Start with breakfast at the hotel.", []],
      ["Tube to Tower Hill", "Walk to Pimlico Station. Take Pimlico to Victoria, change at Victoria, then Victoria to Tower Hill. Confirm the easiest route that morning.", ["Pimlico Station", "Tower Hill Station"]],
      ["Tower area", "Walk around the Tower of London area. No need to buy tickets ahead; enjoy the outside and take photos.", ["Tower of London"]],
      ["Tower Bridge", "Walk to Tower Bridge, take photos outside, and walk across for the views. Only buy tickets if you decide in the moment.", ["Tower Bridge"]],
      ["Borough Market lunch", "Walk along the south side of the Thames toward London Bridge / Borough Market. Saturday will be crowded, so walk around first and pick food casually.", ["Borough Market", "London Bridge Station"]],
      ["West End exploring", "Take the Northern line from London Bridge to Leicester Square. Walk Leicester Square to Covent Garden to Seven Dials to Neal's Yard to Soho to Carnaby Street to Chinatown.", ["Leicester Square Station", "Covent Garden", "Seven Dials", "Neal's Yard", "Soho", "Carnaby Street", "Chinatown"]],
      ["Dinner and return", "Dinner in Soho, Chinatown, or Covent Garden. Use the Tube if it is early and comfortable; use Uber or black cab if tired, late, or pickup is easier.", ["Hotel"]]
    ],
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
    snapshot: {
      summary: "Palace photos in the morning, Camden as the fun daytime stop, then return central for dinner.",
      path: [
        { label: "Hotel breakfast", map: "Hotel" },
        { label: "Buckingham Palace", map: "Buckingham Palace" },
        { label: "St. James's Park", map: "St. James's Park" },
        { label: "The Mall", map: "The Mall" },
        { label: "Camden Market", map: "Camden Market" },
        { label: "Regent's Canal", map: "Regent's Canal" },
        { label: "Central dinner", map: "Covent Garden" },
        { label: "Hotel", map: "Hotel" }
      ]
    },
    steps: [
      ["Breakfast", "Start with breakfast at the hotel.", []],
      ["Palace photos", "Walk or take short transit to Buckingham Palace. See the exterior and gates.", ["Buckingham Palace"]],
      ["Park and Mall walk", "Walk through St. James's Park, then walk The Mall toward Trafalgar Square.", ["St. James's Park", "The Mall", "Trafalgar Square"]],
      ["Tube to Camden", "From central London, take the Tube to Camden Town. Use Google Maps or TfL Go for the best route that morning.", ["Camden Town Station"]],
      ["Camden Market lunch", "Make Camden Market the daytime anchor. Get lunch and explore stalls, shops, signs, and street food.", ["Camden Market"]],
      ["Regent's Canal", "If weather and energy are good, take a short Regent's Canal walk near Camden Lock.", ["Regent's Canal"]],
      ["Final dinner", "Return toward central London for final dinner in Covent Garden, Soho, or near the hotel. Use Uber or the Tube depending on timing and energy.", ["Covent Garden", "Soho", "Hotel"]]
    ],
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
    snapshot: {
      summary: "This is a travel-protection day: leave early, get through Heathrow, then protect the JFK connection.",
      path: [
        { label: "Hotel checkout", map: "Hotel" },
        { label: "Uber to Heathrow", map: "London Heathrow Airport" },
        { label: "Terminal 2", map: "London Heathrow Airport" },
        { label: "Fast Track security", map: "London Heathrow Airport" },
        { label: "JetBlue B6 20 to JFK", map: "JFK Terminal 5" },
        { label: "Find RDU gate", map: "JFK Terminal 5" },
        { label: "JetBlue B6 585 to RDU", map: "RDU Airport" },
        { label: "Home", map: "RDU Airport" }
      ]
    },
    steps: [
      ["6:00 AM — wake up and final check", "Set alarms for 6:00 and 6:30 AM BST. Physical check before leaving: passports, wallet, phone, charger, medication, and all bags out of the safe.", ["Hotel"]],
      ["Leave hotel by 7:15 AM", "Book Uber or FREENOW to Heathrow Terminal 2. Plan to arrive around 8:45 AM. Allow extra time because London morning traffic is unpredictable.", ["London Heathrow Airport"]],
      ["Check in at Terminal 2", "JetBlue B6 20 departs from Terminal 2 at 11:55 AM. Use the JetBlue app for boarding passes. Budget 30-45 minutes for check-in, passport verification, and bag drop.", ["London Heathrow Airport"]],
      ["Use Heathrow Fast Track", "Book the Fast Track window for 9:30-10:30 AM. Enter near the beginning of the window. Terminal 2 Fast Track Departures has its own security entrance next to the main security entrances inside the terminal. Follow Fast Track wayfinding or ask airport staff. Booking reference AHA2OC.", ["London Heathrow Airport"]],
      ["Clear security and find the gate", "After Fast Track security, go airside first. The plan leaves roughly 90 minutes or more before departure for food, charging phones, and finding the gate.", []],
      ["Board JetBlue B6 20 LHR → JFK", "JetBlue B6 20 departs 11:55 AM BST. Arrives JFK 3:25 PM EDT. Update the parent group text before boarding.", []],
      ["JFK connection — find gate first", "After landing at JFK, stay airside. Find the Raleigh gate before food or charging. If delayed or confused, talk to a JetBlue gate agent.", ["JFK Terminal 5"]],
      ["Board JetBlue B6 585 JFK → RDU", "JetBlue B6 585 departs 6:30 PM EDT from Terminal 5. Arrives Raleigh 8:33 PM EDT. Keep parent group text updated from JFK.", []]
    ],
  }
];

const flights = [
  {
    day: "Thursday, June 25",
    dateQuery: "June 25 2026",
    time: "7:45 PM EDT",
    route: "RDU -> IAD",
    number: "3520",
    carrier: "UA",
    airline: "United UA 3520",
    operator: "Operated by Republic dba United Express",
    confirmation: "I77CEV",
    confirmationLabel: "United confirmation",
    terminal: "Depart Terminal 2",
    gate: "Gate D15",
    arrive: "Arrive 9:06 PM EDT at IAD Concourse C",
    timeline: [
      "5:00 PM: leave home.",
      "5:45-5:55 PM: arrive at RDU Terminal 2.",
      "5:55-6:00 PM: enter terminal and go straight to security.",
      "6:00-6:30 PM: clear standard security.",
      "6:30-6:45 PM: walk to Gate D15.",
      "By 6:45 PM: be at the gate. Boarding is likely around 7:05 PM."
    ]
  },
  {
    day: "Thursday, June 25",
    dateQuery: "June 25 2026",
    time: "10:15 PM EDT",
    route: "IAD -> LHR",
    number: "924",
    carrier: "UA",
    airline: "United UA 924",
    confirmation: "I77CEV",
    confirmationLabel: "United confirmation",
    terminal: "Depart IAD after 1h 9m connection",
    arrive: "Arrive Friday, June 26 at 10:40 AM BST"
  },
  {
    day: "Monday, June 29",
    dateQuery: "June 29 2026",
    time: "11:55 AM BST",
    route: "LHR -> JFK",
    number: "20",
    carrier: "B6",
    airline: "JetBlue B6 20",
    confirmation: "KDHSOU",
    confirmationLabel: "JetBlue confirmation",
    terminal: "Depart Terminal 2",
    arrive: "Arrive 3:25 PM EDT"
  },
  {
    day: "Monday, June 29",
    dateQuery: "June 29 2026",
    time: "6:30 PM EDT",
    route: "JFK -> RDU",
    number: "585",
    carrier: "B6",
    airline: "JetBlue B6 585",
    confirmation: "KDHSOU",
    confirmationLabel: "JetBlue confirmation",
    terminal: "Depart Terminal 5",
    arrive: "Arrive 8:33 PM EDT"
  }
];

const flightEssentials = {
  etas: [
    {
      person: "Tiffany",
      reference: "2021-2606-1655-7845",
      passport: "1893",
      validUntil: "June 17, 2028"
    },
    {
      person: "Collin",
      reference: "2021-2606-1009-0807",
      passport: "1892",
      validUntil: "March 7, 2028"
    }
  ],
  arrival: {
    title: "Heathrow arrival passport control",
    note: "Use the passport control eGates / biometric line if available. Eligible biometric U.S. passports can use eGates for travelers age 10 and older when accompanied by an adult."
  },
  fastTrack: {
    title: "Heathrow Fast Track Departures",
    reference: "AHA2OC",
    pdf: "assets/heathrow-fast-track-confirmation.pdf",
    window: "Book the Fast Track window for 9:30-10:30 AM.",
    arrival: "Plan to arrive at Terminal 2 around 8:45 AM.",
    location: "Terminal 2 Fast Track Departures passengers have their own security entrance next to the main security entrances inside the terminal. Follow Fast Track wayfinding or ask airport staff.",
    reason: "That gives 30-45 minutes for check-in, passport verification, and bag drop; entry near the beginning of the window; buffer if the JetBlue counter moves slowly; and roughly 90 minutes or more airside before the 11:55 AM departure."
  }
};

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

const tickets = [
  {
    label: "Hotel — Holiday Inn Express Victoria",
    detail: "June 26-29, 2026 · Booking.com confirmation 6945.109.446",
    sub: "PIN 4412 · Lodging confirmation 88897847 · Tap for the Booking.com PDF",
    href: "assets/hotel-booking-confirmation.pdf",
    buttonLabel: "Open Hotel PDF",
    status: "confirmed"
  },
  {
    label: "Big Bus London hop-on hop-off",
    detail: "Friday, June 26 · 1 Day Hop-On Hop-Off Bus Only · 1 adult and 1 child",
    copyCode: "VVXCH9SM",
    codeColor: "amber",
    codeLabel: "Booking ref",
    instructions: [
      "Open the Big Bus Tours app → tap 'Add Booking' → enter VVXCH9SM",
      "On the morning of travel: open the app, tap your ticket, press 'Activate' — ticket countdown starts",
      "Show the activated screen to the driver to board"
    ],
    href: "assets/big-bus-ticket.pdf",
    buttonLabel: "Open Bus Ticket",
    status: "confirmed"
  },
  {
    label: "London Eye",
    detail: "Friday, June 26 at 6:00 PM · London Eye excursion · 2 standard tickets",
    sub: "Order ID: 605056784 · Adult barcode 150018675054750217 · Child barcode 150018553500106457 · Go directly to the London Eye at 6:00 PM to join the queue.",
    barcodes: [
      { label: "Adult", value: "150018675054750217" },
      { label: "Child", value: "150018553500106457" }
    ],
    status: "confirmed"
  },
  {
    label: "Parent travel consent letter",
    detail: "Signed PDF authorising Tiffany and Collin to travel",
    sub: "Open this if border control or airline staff ask for it",
    href: "assets/parental-travel-consent-letter.pdf",
    buttonLabel: "Open Letter",
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

const resourceGroups = [
  { label: "Uber — London", href: "https://www.uber.com/gb/en/", why: "Best backup when tired — works exactly like in the US" },
  { label: "FREENOW / FreeNow — black cabs", href: "https://www.free-now.com/uk/", why: "Book official London black cabs from your phone" },
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

function mapsUrl(name) {
  return buildMapsUrl(mapQueries, name);
}

function directionsUrl(from, to, mode = "transit") {
  return buildDirectionsUrl(mapQueries, from, to, mode);
}

function flightTrackers(flight) {
  const carrier = flight.carrier || "B6";
  const googleQuery = encodeURIComponent(`${carrier} ${flight.number} ${flight.dateQuery} flight status`);
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

function snapshotStopLabel(stop) {
  return typeof stop === "string" ? stop : stop.label;
}

function renderSnapshotStop(stop) {
  const label = snapshotStopLabel(stop);
  const mapTarget = typeof stop === "string" ? stop : stop.map;
  const content = `<span>${label}</span><small>Map</small>`;

  if (mapTarget && mapQueries[mapTarget]) {
    return `<li><a href="${mapsUrl(mapTarget)}" target="_blank" rel="noopener" aria-label="Open map for ${label}">${content}</a></li>`;
  }

  return `<li><span class="day-path__plain">${label}</span></li>`;
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
          <p class="itinerary-summary__path">${day.snapshot.path.slice(0, 5).map(snapshotStopLabel).join(" → ")}</p>
        </div>
      </summary>
      ${day.image ? `<div class="itinerary-pocket__media">
        <picture>
          <source srcset="${day.imageWebp}" type="image/webp">
          <img src="${day.image}" alt="${escapeHtml(day.title)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
        </picture>
      </div>` : ""}
      <div class="itinerary-pocket__body">
        <section class="day-snapshot">
          <span>Day snapshot</span>
          <strong>How the day should flow</strong>
          <p>${day.snapshot.summary}</p>
          <ol class="day-path">
            ${day.snapshot.path.map(renderSnapshotStop).join("")}
          </ol>
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
      </div>
    </details>
  `).join("");
}

function renderHotelActions() {
  document.querySelector("#hotelActionPanel").innerHTML = `
    <article class="info-card">
      <span>Hotel confirmation</span>
      <strong>${booking.hotel}</strong>
      <p>Booking.com confirmation ${booking.confirmation} · PIN ${booking.pin}</p>
      <div class="button-row">
        <a class="button" href="${booking.pdf}" target="_blank" rel="noopener">Open confirmation PDF</a>
        <a class="button button--secondary" href="${mapsUrl("Hotel")}" target="_blank" rel="noopener">Hotel map</a>
      </div>
    </article>
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
  document.querySelector("#tubePocketList").innerHTML = tubeRoutes.map(route => `
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
  `).join("");
  document.querySelector("#tubeBasicsPanel").innerHTML = `
    <details class="pocket-card">
      <summary class="pocket-card__summary">
        <div>
          <span>Tube rules</span>
          <strong>What to remember before tapping in</strong>
          <p>Keep these out of the way until you need them.</p>
        </div>
      </summary>
      <ul class="bullet-list">${tubeBasics.map(item => `<li>${item}</li>`).join("")}</ul>
    </details>
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

const code128Patterns = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

function renderCode128Barcode(value, label) {
  const pairs = value.match(/\d{2}/g);
  if (!pairs || pairs.join("") !== value) return "";

  const values = pairs.map(pair => Number(pair));
  const codes = [105, ...values];
  const checksum = codes.reduce((sum, code, index) => sum + (index === 0 ? code : code * index), 0) % 103;
  codes.push(checksum, 106);

  const quiet = 10;
  const height = 70;
  let x = quiet;
  const bars = codes.map(code => {
    const pattern = code128Patterns[code];
    let isBar = true;
    let rects = "";
    for (const widthChar of pattern) {
      const width = Number(widthChar);
      if (isBar) {
        rects += `<rect x="${x}" y="0" width="${width}" height="${height}"></rect>`;
      }
      x += width;
      isBar = !isBar;
    }
    return rects;
  }).join("");
  const totalWidth = x + quiet;

  return `
    <div class="barcode-card">
      <div class="barcode-card__label">${label}</div>
      <svg class="ticket-barcode" viewBox="0 0 ${totalWidth} ${height}" role="img" aria-label="${label} barcode ${value}" preserveAspectRatio="none">
        ${bars}
      </svg>
      <div class="barcode-card__number">${value}</div>
    </div>`;
}

function renderTickets() {
  document.querySelector("#ticketList").innerHTML = tickets.map(ticket => {
    const badge = "";

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

    const barcodes = ticket.barcodes ? `
      <div class="ticket-barcodes">
        ${ticket.barcodes.map(barcode => renderCode128Barcode(barcode.value, barcode.label)).join("")}
      </div>` : "";

    const linkEl = ticket.buttonLabel && ticket.href
      ? `<a class="button ticket-item__btn" href="${ticket.href}" target="_blank" rel="noopener">${ticket.buttonLabel}</a>`
      : ticket.href
      ? `<a class="ticket-item__link" href="${ticket.href}" target="_blank" rel="noopener">${ticket.actionLabel ? `${ticket.actionLabel} →` : "Open →"}</a>`
      : "";

    return `
    <div class="ticket-item">
      <div class="ticket-item__header">
        <span class="ticket-item__label">${ticket.label}</span>
        ${badge}
      </div>
      <p class="ticket-item__detail">${ticket.detail}</p>
      ${ticket.sub ? `<p class="ticket-item__sub">${ticket.sub}</p>` : ""}
      ${refChip}
      ${barcodes}
      ${steps}
      ${linkEl}
    </div>`;
  }).join("");
}

function statusForFlight(flight) {
  const carrier = (flight.carrier || "B6").toLowerCase();
  return flightStatusData?.flights?.find(item => item.id === `${carrier}-${flight.number}`) || null;
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

function renderFlightReference(label, value) {
  // Keep critical travel numbers visually consistent and copyable across the flight pocket.
  return `
    <div class="ref-row">
      <span class="ref-chip ref-chip--amber">${value}</span>
      <button class="copy-btn" type="button" data-copy-ref="${value}" aria-label="Copy ${label}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy
      </button>
    </div>`;
}

function renderFlightEssentials() {
  const etaCards = flightEssentials.etas.map(eta => `
    <article class="flight-doc-card">
      <span>UK ETA — ${eta.person}</span>
      <strong>Passport ending ${eta.passport}</strong>
      ${renderFlightReference(`${eta.person} ETA reference`, eta.reference)}
      <p>ETA is passport-linked and should be automated at travel. No printed email or separate display should be needed.</p>
      <small>Approved · valid until ${eta.validUntil}</small>
    </article>
  `).join("");

  return `
    <details class="pocket-card flight-docs-pocket" open>
      <summary class="pocket-card__summary">
        <div>
          <span>Flight documents</span>
          <strong>Confirmations, ETAs, Fast Track</strong>
          <p>Open this first for flight-day numbers and Heathrow instructions.</p>
        </div>
      </summary>
      <div class="flight-docs-grid">
        ${etaCards}
        <article class="flight-doc-card">
          <span>${flightEssentials.arrival.title}</span>
          <strong>Use eGates / biometric line if available</strong>
          <p>${flightEssentials.arrival.note}</p>
        </article>
        <article class="flight-doc-card flight-doc-card--fast-track">
          <span>${flightEssentials.fastTrack.title}</span>
          <strong>9:30-10:30 AM window · arrive around 8:45 AM</strong>
          ${renderFlightReference("Heathrow Fast Track reference", flightEssentials.fastTrack.reference)}
          <p>${flightEssentials.fastTrack.window} ${flightEssentials.fastTrack.arrival}</p>
          <p>${flightEssentials.fastTrack.location}</p>
          <p>${flightEssentials.fastTrack.reason}</p>
          <a class="button ticket-item__btn" href="${flightEssentials.fastTrack.pdf}" target="_blank" rel="noopener">Open Fast Track PDF</a>
        </article>
      </div>
    </details>`;
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
  document.querySelector("#flightDocumentsPanel").innerHTML = renderFlightEssentials();
  document.querySelector("#flightPanel").innerHTML = `
    ${flights.map(flight => {
      const confirmationLabel = flight.confirmationLabel || "Flight confirmation";
      const carrier = flight.carrier || "B6";
      const appNote = carrier === "UA"
        ? "Use the United app for boarding passes, gate changes, and status. The Live Status link above opens a Google search for real-time status."
        : `Use the <a href="${appLinks.jetBlueIos}" target="_blank" rel="noopener" style="color:var(--accent)">JetBlue app (iPhone)</a> or <a href="${appLinks.jetBlueAndroid}" target="_blank" rel="noopener" style="color:var(--accent)">JetBlue app (Android)</a> for the most direct airline updates. The Live Status link above opens a Google search for real-time status.`;

      return `
    <details class="pocket-card" id="flight-${flight.number}" ${flight.number === "3520" ? "open" : ""}>
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
        ${flight.operator ? `<p>${flight.operator}</p>` : ""}
        ${flight.gate ? `<p><strong>${flight.gate}</strong></p>` : ""}
        <p>${flight.arrive}</p>
        ${renderFlightStatusBox(statusForFlight(flight))}
        <div class="flight-confirmation">
          <span>${confirmationLabel}</span>
          ${renderFlightReference(`${confirmationLabel} for ${carrier} ${flight.number}`, flight.confirmation)}
        </div>
        ${flight.timeline ? `<ul class="bullet-list flight-timeline">${flight.timeline.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}
        <div class="button-row">
          ${flightTrackers(flight).map(([label, url]) => `<a class="button button--secondary" href="${url}" target="_blank" rel="noopener">${label}</a>`).join("")}
        </div>
        <p class="flight-pocket__note">${appNote}</p>
      </div>
    </details>
  `;
    }).join("")}`;
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

  document.querySelector("#heroTubeDirections").href = "https://www.google.com/maps/search/?api=1&query=Tube%20station%20near%20me";

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

  document.querySelector("#mapSearch").addEventListener("input", event => {
    renderMaps(event.target.value);
  });

  document.querySelector("[data-refresh-flight-status]").addEventListener("click", async () => {
    await loadFlightStatus({ force: true });
  });

  // popstate fires on browser back/forward — lets swipe-back navigate panels instead of exiting
  window.addEventListener("popstate", syncPanelFromLocation);
}

renderItinerary();
renderHotelActions();
renderRouteShortcuts();
renderTubePockets();
renderMaps();
renderResources();
renderTickets();
renderEmergencyContacts();
renderRecovery();
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
