import type { ParkConfig, ParkKey } from "../types";

export const PARKS: Record<ParkKey, ParkConfig> = {
  mk: {
    id: "75ea578a-adc8-4116-a54d-dccb60765ef9",
    name: "Magic Kingdom",
    short: "MK",
    center: { lat: 28.4177, lon: -81.5812 },
  },
  epcot: {
    id: "47f90d2c-e191-4239-a466-5892ef59a88b",
    name: "EPCOT",
    short: "EPCOT",
    center: { lat: 28.3747, lon: -81.5494 },
  },
  hs: {
    id: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
    name: "Hollywood Studios",
    short: "HS",
    center: { lat: 28.3575, lon: -81.5583 },
  },
  ak: {
    id: "1c84a229-8862-4648-9c71-378ddd2c7693",
    name: "Animal Kingdom",
    short: "AK",
    center: { lat: 28.3553, lon: -81.5901 },
  },
  usf: {
    id: "eb3f4560-2383-4a36-9152-6b3e5ed6bc57",
    name: "Universal Studios",
    short: "USF",
    center: { lat: 28.4747, lon: -81.4664 },
  },
  ioa: {
    id: "267615cc-8943-4c2a-ae2c-5da728ca591f",
    name: "Islands of Adventure",
    short: "IOA",
    center: { lat: 28.4712, lon: -81.4713 },
  },
  epic: {
    id: "12dbb85b-265f-44e6-bccf-f1faa17211fc",
    name: "Epic Universe",
    short: "EPIC",
    center: { lat: 28.4730, lon: -81.4430 },
  },
};

export const PARK_KEYS: ParkKey[] = ["mk", "epcot", "hs", "ak", "usf", "ioa", "epic"];
