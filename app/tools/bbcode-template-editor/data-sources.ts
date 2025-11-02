import { DataSource } from './types';

// Import JSON files directly
import locationsData from '@/data/gtaw_locations.json';
import penalCodeData from '@/data/gtaw_penal_code.json';
import vehiclesData from '@/data/gtaw_vehicles.json';

export const loadDataSource = async (source: keyof DataSource): Promise<string[]> => {
  // Simulate API delay for better UX
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    switch (source) {
      case 'locations':
        return transformLocationsData(locationsData);
      case 'penal_code':
        return transformPenalCodeData(penalCodeData);
      case 'vehicles':
        return transformVehiclesData(vehiclesData);
      case 'custom':
        return [];
      default:
        console.warn(`Unknown data source: ${source}`);
        return [];
    }
  } catch (error) {
    console.error(`Error loading data source ${source}:`, error);
    // Fallback to mock data
    return getMockData(source);
  }
};

// Data transformation functions
const transformLocationsData = (data: any): string[] => {
  // Handle different possible data structures
  if (Array.isArray(data)) {
    return data.map((item: any) => {
      if (typeof item === 'string') return item;
      if (item.name) return item.name;
      if (item.title) return item.title;
      if (item.id) return String(item.id);
      return JSON.stringify(item);
    });
  }
  return [];
};

const transformPenalCodeData = (data: any): string[] => {
  if (Array.isArray(data)) {
    return data.map((item: any) => {
      if (typeof item === 'string') return item;
      if (item.code && item.title) return `${item.code} - ${item.title}`;
      if (item.name) return item.name;
      if (item.title) return item.title;
      return JSON.stringify(item);
    });
  }
  return [];
};

const transformVehiclesData = (data: any): string[] => {
  if (Array.isArray(data)) {
    return data.map((item: any) => {
      if (typeof item === 'string') return item;
      if (item.name) return item.name;
      if (item.model) return item.model;
      if (item.title) return item.title;
      return JSON.stringify(item);
    });
  }
  return [];
};

// Mock data as fallback
const getMockData = (source: keyof DataSource): string[] => {
  const mockData: DataSource = {
    locations: [
      "Los Santos Police Department - Mission Row",
      "Los Santos Police Department - Vespucci",
      "Los Santos Police Department - Davis",
      "Sandy Shores Sheriff's Station",
      "Paleto Bay Sheriff's Station",
      "Bolingbroke Penitentiary",
      "Pillbox Hill Medical Center",
      "Mount Zonah Medical Center",
      "Sandy Shores Medical Center",
      "Paleto Bay Medical Center"
    ],
    penal_code: [
      "PC 101 - Murder",
      "PC 102 - Attempted Murder",
      "PC 103 - Manslaughter",
      "PC 104 - Vehicular Manslaughter",
      "PC 201 - Armed Robbery",
      "PC 202 - Robbery",
      "PC 203 - Burglary",
      "PC 204 - Theft",
      "PC 205 - Grand Theft Auto",
      "PC 206 - Petty Theft",
      "PC 301 - Assault with Deadly Weapon",
      "PC 302 - Assault",
      "PC 303 - Battery",
      "PC 401 - Possession of Illegal Substances",
      "PC 402 - Trafficking of Illegal Substances",
      "PC 501 - Evading Police",
      "PC 502 - Reckless Driving",
      "PC 503 - Hit and Run",
      "PC 601 - Resisting Arrest",
      "PC 602 - Obstruction of Justice"
    ],
    vehicles: [
      "Police Cruiser",
      "Police Buffalo",
      "Police Interceptor",
      "Police Bike",
      "Undercover Cruiser",
      "Riot Van",
      "Police Helicopter",
      "FIB Buffalo",
      "FIB Granger",
      "Sheriff SUV",
      "Sheriff Cruiser",
      "Park Ranger",
      "Coastal Guard Boat",
      "Corrections Bus"
    ],
    custom: []
  };
  
  return mockData[source] || [];
};

export const saveToLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`bbcode_editor_${key}`, value);
  }
};

export const loadFromLocalStorage = (key: string): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(`bbcode_editor_${key}`) || '';
  }
  return '';
};

export const getAvailableDataSources = (): Array<{ value: keyof DataSource; label: string }> => {
  return [
    { value: 'locations', label: 'GTAW Locations' },
    { value: 'penal_code', label: 'Penal Code' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'custom', label: 'Custom Options' }
  ];
};