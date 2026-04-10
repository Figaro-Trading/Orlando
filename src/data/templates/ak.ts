import type { DayTemplate } from "../../types";

export const ak: DayTemplate = {
  "id": "ak",
  "label": "Animal Kingdom",
  "park": "ak",
  "openingHours": "",
  "coupefile": "Parcours : Pandora → Africa → Asia → Sortie 13h50",
  "zones": [
    {
      "number": 1,
      "label": "ANIMAL KINGDOM (9h-13h50)",
      "entries": [
        {
          "id": "ak-z1-000",
          "time": "08:00",
          "name": "Départ hébergement (arriver avant ouverture!)",
          "type": "logistics",
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        }
      ]
    },
    {
      "number": 2,
      "label": "PANDORA (rope drop!)",
      "entries": [
        {
          "id": "ak-z2-000",
          "time": "09:00",
          "name": "OUVERTURE → Sprint Pandora!",
          "type": "logistics",
          "land": "Oasis",
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z2-001",
          "time": "09:05",
          "name": "Flight of Passage",
          "type": "ride",
          "land": "Pandora",
          "duration": 5,
          "rideType": "simulator",
          "coupefile": "LL SP",
          "popularity": 10,
          "estimatedWait": 78,
          "rating": 4.9,
          "score": 6.4,
          "isNew": false,
          "isReride": false,
          "isMustSee": true,
          "priority": 1,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z2-002",
          "time": "09:55",
          "name": "Na'vi River Journey",
          "type": "ride",
          "land": "Pandora",
          "duration": 5,
          "rideType": "boat ride",
          "coupefile": "LL MP",
          "popularity": 7.65,
          "estimatedWait": 52,
          "rating": 4.9,
          "score": 5,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        }
      ]
    },
    {
      "number": 3,
      "label": "AFRICA",
      "entries": [
        {
          "id": "ak-z3-000",
          "time": "10:20",
          "name": "Marche Pandora → Africa",
          "type": "walk",
          "duration": 5,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z3-001",
          "time": "10:25",
          "name": "Kilimanjaro Safaris (animaux actifs!)",
          "type": "ride",
          "land": "Africa",
          "duration": 22,
          "rideType": "safari",
          "coupefile": "LL MP",
          "popularity": 6.55,
          "estimatedWait": 41,
          "rating": 4.9,
          "score": 4.3,
          "isNew": false,
          "isReride": false,
          "isMustSee": true,
          "priority": 2,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z3-002",
          "time": "10:50",
          "name": "Gorilla Falls Exploration Trail",
          "type": "explore",
          "land": "Africa",
          "duration": 15,
          "rideType": "walkthrough",
          "isNew": true,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z3-003",
          "time": "11:10",
          "name": "Festival of the Lion King",
          "type": "show",
          "land": "Africa",
          "duration": 30,
          "rideType": "show",
          "coupefile": "—",
          "popularity": 4.09,
          "estimatedWait": 19,
          "rating": 4.38,
          "score": 2.8,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        }
      ]
    },
    {
      "number": 4,
      "label": "ASIA",
      "entries": [
        {
          "id": "ak-z4-000",
          "time": "11:45",
          "name": "Marche Africa → Asia",
          "type": "walk",
          "duration": 5,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z4-001",
          "time": "11:50",
          "name": "Expedition Everest",
          "type": "ride",
          "land": "Asia",
          "duration": 3,
          "rideType": "coaster",
          "coupefile": "LL MP",
          "popularity": 5.66,
          "estimatedWait": 33,
          "rating": 4.72,
          "score": 3.8,
          "isNew": false,
          "isReride": false,
          "isMustSee": true,
          "priority": 2,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z4-002",
          "time": "12:05",
          "name": "Maharajah Jungle Trek (trail Asia, tigres!)",
          "type": "explore",
          "land": "Asia",
          "duration": 15,
          "rideType": "walkthrough",
          "isNew": true,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z4-003",
          "time": "12:25",
          "name": "Kali River Rapids⚠ on se mouille!",
          "type": "ride",
          "land": "Asia",
          "duration": 5,
          "rideType": "rapids",
          "coupefile": "—",
          "popularity": 4.99,
          "estimatedWait": 27,
          "rating": 4.58,
          "score": 3.3,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        }
      ]
    },
    {
      "number": 5,
      "label": "DISCOVERY ISLAND (sortie)",
      "entries": [
        {
          "id": "ak-z5-000",
          "time": "12:55",
          "name": "Marche Asia → Discovery Island",
          "type": "walk",
          "land": "Discovery Isl.",
          "duration": 5,
          "rideType": "show 3D",
          "isNew": true,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z5-001",
          "time": "13:00",
          "name": "Zootopia: Better Zoogether! (nouveau show 3D!)",
          "type": "experience",
          "land": "Discovery Isl.",
          "duration": 20,
          "rideType": "show 3D",
          "isNew": true,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z5-002",
          "time": "13:25",
          "name": "Déjeuner Flame Tree BBQ",
          "type": "meal",
          "land": "Discovery Isl.",
          "duration": 20,
          "isNew": false,
          "isReride": false,
          "isMustSee": false,
          "priority": 3,
          "isOptional": false,
          "isRopeDrop": false
        },
        {
          "id": "ak-z5-003",
          "time": "13:50",
          "name": "Sortie AK",
          "type": "logistics",
          "duration": 25,
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
    "⚠️ Achats 20/04 à 7h00 : SP Flight of Passage | MP réservé 17/04 : Na'vi + Kilimanjaro + Everest"
  ]
};
