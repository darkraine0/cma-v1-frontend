// Simplified color configuration for company consistency across all pages
// Normalizes company name for case-insensitive matching and handles variations
const normalizeCompanyName = (company: string): string => {
  return company.trim().toLowerCase().replace(/\s+/g, ' ');
};

// Sort companies with UnionMain Homes always first
export const sortCompanies = (companies: string[]): string[] => {
  const unionMain = 'UnionMain Homes';
  const hasUnionMain = companies.includes(unionMain);
  const otherCompanies = companies.filter(c => c !== unionMain).sort();
  return hasUnionMain ? [unionMain, ...otherCompanies] : otherCompanies;
};

export const getCompanyColor = (company: string) => {
  const normalized = normalizeCompanyName(company);
  
  // Normalize and match company names (case-insensitive)
  const companyMap: Record<string, string> = {
    // DR Horton variations
    'dr horton': '#2563eb',
    'd.r. horton': '#2563eb',
    'd r horton': '#2563eb',
    
    // UnionMain Homes
    'unionmain homes': '#e11d48',
    'union main homes': '#e11d48',
    
    // M/I Homes variations
    'm/i homes': '#9c27b0',
    'mi homes': '#9c27b0',
    
    // Pacesetter Homes
    'pacesetter homes': '#ff9800',
    
    // Trophy Signature Homes
    'trophy signature homes': '#2e7d32',
    
    // HistoryMaker Homes
    'historymaker homes': '#00a651',
    'history maker homes': '#00a651',
    'history maker': '#00a651',
    
    // K. Hovnanian Homes
    'k. hovnanian homes': '#ff6b35',
    'k hovnanian homes': '#ff6b35',
    'hovnanian homes': '#ff6b35',
    
    // Highland Homes
    'highland homes': '#ec4899',
    
    // Beazer Homes
    'beazer homes': '#f43f5e',
    
    // Redfin
    'redfin': '#7c3aed',
    
    // Chesmar Homes variations
    'chesmarhomes': '#8b5cf6',
    'chesmar homes': '#8b5cf6',
    
    // Perry Homes variations
    'perryhomes': '#6366f1',
    'perry homes': '#6366f1',
    
    // Coventry Homes variations
    'coventryhomes': '#0ea5e9',
    'coventry homes': '#0ea5e9',
    
    // William Ryan Homes
    'william ryan homes': '#4f46e5',
    'williamryan homes': '#4f46e5',
    
    // Rockwell Homes
    'rockwell homes': '#84cc16',
    
    // American Legend Homes
    'american legend homes': '#14b8a6',
    
    // AshtonWoods Homes variations
    'ashtonwoods homes': '#64748b',
    'ashton woods homes': '#64748b',
    
    // Bloomfield Homes
    'bloomfield homes': '#d946ef',
    
    // Brightland Homes
    'brightland homes': '#f97316',
    
    // David Weekley Homes
    'david weekley homes': '#eab308',
    'davidweekley homes': '#eab308',
    
    // Shaddock Homes
    'shaddock homes': '#78716c',
    
    // Chafin Communities variations
    'chafin communities': '#059669',
    'chafincommunities': '#059669',
    
    // David Homes
    'david homes': '#dc2626',
    
    // Eastwood Homes
    'eastwood homes': '#7c2d12',
    
    // Fischer Homes
    'fischer homes': '#1e40af',
    
    // Kittle Homes
    'kittle homes': '#10b981',
    
    // Millcroft Townhomes
    'millcroft townhomes': '#a855f7',
    
    // Evanshire Townhomes
    'evanshire townhomes': '#ef4444',
    
    // Wards Crossing Townhomes
    'wards crossing townhomes': '#ea580c',
    
    // Waterside Condos
    'waterside condos': '#0891b2',
    
    // Waterside Townhomes
    'waterside townhomes': '#16a34a',
    
    // BlueHaven Homes variations
    'bluehaven homes': '#8b5a2b',
    'blue haven homes': '#8b5a2b',
    
    // Christie Homes
    'christie homes': '#9333ea',
    
    // Starlight Homes
    'starlight homes': '#22d3ee',
    
    // Piedmont Homes
    'piedmont homes': '#fbbf24',
    
    // DavidSon Homes variations (one 's' - DavidSon)
    'davidson homes': '#c026d3',
    'davidsonhomes': '#c026d3',
    'david son homes': '#c026d3',
    
    // Centex Homes variations
    'centex': '#0369a1', // Sky Blue
    'centex homes': '#0369a1',
    'centexhomes': '#0369a1',
  };
  
  return companyMap[normalized] || '#888'; // Gray default for unknown companies
};
