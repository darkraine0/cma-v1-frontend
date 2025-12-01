import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import API_URL from '../config';
import { getCompanyColor, sortCompanies, getCanonicalCompanyName } from '../utils/colors';

interface Plan {
  plan_name: string;
  price: number;
  sqft: number;
  stories: string;
  price_per_sqft: number;
  last_updated: string;
  price_changed_recently: boolean;
  company: string;
  community: string;
  type: string;
}

interface Company {
  name: string;
  communities: string[];
  totalPlans: number;
  totalNow: number;
  avgPrice: number;
  priceRange: { min: number; max: number };
  recentChanges: number;
}

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL + "/plans");
      if (!res.ok) throw new Error("Failed to fetch plans");
      const plans: Plan[] = await res.json();
      
      // Group plans by company (normalize duplicates like "Chesmar Homes" and "ChesmarHomes")
      const companyMap = new Map<string, Plan[]>();
      const canonicalMap = new Map<string, string>(); // Map normalized to canonical name
      
      plans.forEach(plan => {
        const canonicalName = getCanonicalCompanyName(plan.company);
        const normalizedKey = canonicalName.toLowerCase();
        
        // Use canonical name as key to merge duplicates
        if (!companyMap.has(normalizedKey)) {
          companyMap.set(normalizedKey, []);
          canonicalMap.set(normalizedKey, canonicalName);
        }
        companyMap.get(normalizedKey)!.push(plan);
      });

      // Convert to Company objects using canonical names
      const companyData: Company[] = Array.from(companyMap.entries()).map(([key, plans]) => {
        const canonicalName = canonicalMap.get(key) || key;
        const communities = Array.from(new Set(plans.map(p => p.community)));
        const prices = plans.map(p => p.price).filter(p => p > 0);
        const recentChanges = plans.filter(p => p.price_changed_recently).length;
        const totalPlans = plans.filter(p => p.type === 'plan').length;
        const totalNow = plans.filter(p => p.type === 'now').length;
        
        return {
          name: canonicalName,
          communities,
          totalPlans,
          totalNow,
          avgPrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
          priceRange: {
            min: prices.length > 0 ? Math.min(...prices) : 0,
            max: prices.length > 0 ? Math.max(...prices) : 0
          },
          recentChanges
        };
      });

      // Sort companies with UnionMain Homes first
      const sortedCompanies = sortCompanies(companyData.map(c => c.name));
      const sortedCompanyData = sortedCompanies.map(companyName => 
        companyData.find(c => c.name === companyName)!
      );

      setCompanies(sortedCompanyData);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    fetchCompanies();
    const interval = setInterval(fetchCompanies, 60 * 1000); // Refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  const handleCompanyClick = (companyName: string) => {
    navigate(`/company/${encodeURIComponent(companyName)}`);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">Explore home plans by company</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const color = getCompanyColor(company.name);
            return (
              <Card
                key={company.name}
                onClick={() => handleCompanyClick(company.name)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <span 
                        className="inline-block w-4 h-4 rounded-full border-2"
                        style={{ backgroundColor: color, borderColor: color }}
                      />
                      {company.name}
                    </CardTitle>
                    {company.recentChanges > 0 && (
                      <Badge variant="destructive">
                        {company.recentChanges} new
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Plan/Now Summary */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
                        <span className="text-sm font-medium text-muted-foreground">Plans</span>
                      </div>
                      <Badge variant="secondary">
                        {company.totalPlans}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-success"></span>
                        <span className="text-sm font-medium text-muted-foreground">Available Now</span>
                      </div>
                      <Badge variant="success">
                        {company.totalNow}
                      </Badge>
                    </div>
                    
                    {/* Price Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Price:</span>
                        <span className="font-semibold text-primary">
                          ${company.avgPrice.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price Range:</span>
                        <span className="font-semibold text-foreground text-sm">
                          ${company.priceRange.min.toLocaleString()} - ${company.priceRange.max.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Communities */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Communities:</span>
                      <Badge variant="outline">
                        {company.communities.length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {companies.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No companies found.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Companies;

