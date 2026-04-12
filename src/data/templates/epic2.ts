import type { DayTemplate } from "../../types";

export const epic2: DayTemplate = {
  "id": "epic2",
  "label": "Epic Universe — Afternoon",
  "park": "epic",
  "openingHours": "16h-21h",
  "skipPass": "Express Pass (EP)",
  "zones": [
    {
      "number": 1,
      "label": "SUPER NINTENDO WORLD (return)",
      "entries": [
        {
          "id": "epic2-z1-000",
          "time": "16:05",
          "name": "Arrive Epic Universe + register EP",
          "type": "logistics",
          "land": "Celestial Park",
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z1-001",
          "time": "16:30",
          "name": "Mario Kart: Bowser's Challenge (2nd ride)",
          "type": "ride",
          "land": "Super Nintendo World",
          "duration": 5,
          "rideType": "AR ride",
          "skipPass": "EP",
          "popularity": 9.5,
          "estimatedWait": 0,
          "rating": 4.9,
          "score": 9.5,
          "isNew": true,
          "isReride": true,
          "isMustSee": true,
          "priority": 1,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z1-002",
          "time": "17:05",
          "name": "Power-Up Band mini-games SNW",
          "type": "explore",
          "land": "Super Nintendo World",
          "duration": 35,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": true,
          "isRopeDrop": false
        }
      ]
    },
    {
      "number": 2,
      "label": "MINISTRY OF MAGIC (return)",
      "entries": [
        {
          "id": "epic2-z2-000",
          "name": "Walk Super Nintendo World → Ministry of Magic",
          "type": "walk",
          "duration": 8,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z2-001",
          "time": "17:40",
          "name": "Harry Potter and the Battle at the Ministry (2nd)",
          "type": "ride",
          "land": "Ministry of Magic",
          "duration": 18,
          "rideType": "trackless",
          "skipPass": "EP",
          "popularity": 10.0,
          "estimatedWait": 0,
          "rating": 4.9,
          "score": 10.0,
          "isNew": true,
          "isReride": true,
          "isMustSee": true,
          "priority": 1,
          "isOptional": false,
          "isRopeDrop": false
        }
      ]
    },
    {
      "number": 3,
      "label": "ISLE OF BERK + CELESTIAL PARK (evening)",
      "entries": [
        {
          "id": "epic2-z3-000",
          "name": "Walk Ministry of Magic → Isle of Berk",
          "type": "walk",
          "duration": 8,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z3-001",
          "time": "18:35",
          "name": "Hiccup's Wing Gliders (2nd ride)",
          "type": "ride",
          "land": "Isle of Berk",
          "duration": 2,
          "rideType": "coaster",
          "skipPass": "EP",
          "popularity": 6.5,
          "estimatedWait": 0,
          "rating": 4.6,
          "score": 6.5,
          "isNew": true,
          "isReride": true,
          "isMustSee": false,
          "priority": 2,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z3-002",
          "name": "Walk Isle of Berk → Celestial Park",
          "type": "walk",
          "duration": 8,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z3-003",
          "time": "19:15",
          "name": "Final dinner — Celestial Park",
          "type": "meal",
          "land": "Celestial Park",
          "duration": 40,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z3-004",
          "time": "19:55",
          "name": "Stardust Racers (2nd ride)",
          "type": "ride",
          "land": "Celestial Park",
          "duration": 3,
          "rideType": "dual coaster",
          "skipPass": "EP",
          "popularity": 9.0,
          "estimatedWait": 0,
          "rating": 4.9,
          "score": 9.0,
          "heightReq": "52\"",
          "isNew": true,
          "isReride": true,
          "isMustSee": true,
          "priority": 1,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z3-005",
          "time": "20:25",
          "name": "Final photos + free exploration",
          "type": "explore",
          "land": "Celestial Park",
          "duration": 25,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": true,
          "isRopeDrop": false
        },
        {
          "id": "epic2-z3-006",
          "time": "20:50",
          "name": "Exit Epic Universe — End of trip",
          "type": "logistics",
          "land": "Celestial Park",
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        }
      ]
    }
  ],
  "alerts": [
    "Register EP at Guest Services upon arrival (afternoon session)"
  ]
};
