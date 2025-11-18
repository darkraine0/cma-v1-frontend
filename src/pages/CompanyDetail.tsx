import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import API_URL from '../config';
import { getCompanyColor, isSameCompany } from '../utils/colors';
import { getCommunityImage } from '../utils/communityImages';

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

interface Community {
  name: string;
  totalPlans: number;
  totalNow: number;
  avgPrice: number;
  priceRange: { min: number; max: number };
  recentChanges: number;
}

const CompanyDetail: React.FC = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const decodedCompanyName = companyName ? decodeURIComponent(companyName) : '';

  const fetchCommunities = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL + "/plans");
      if (!res.ok) throw new Error("Failed to fetch plans");
      const plans: Plan[] = await res.json();
      
      // Filter plans for this specific company (handles variations like "Chesmar Homes" and "ChesmarHomes")
      const companyPlans = plans.filter(plan => 
        isSameCompany(plan.company, decodedCompanyName)
      );

      // Group plans by community
      const communityMap = new Map<string, Plan[]>();
      companyPlans.forEach(plan => {
        if (!communityMap.has(plan.community)) {
          communityMap.set(plan.community, []);
        }
        communityMap.get(plan.community)!.push(plan);
      });

      // Convert to Community objects
      const communityData: Community[] = Array.from(communityMap.entries()).map(([name, plans]) => {
        const prices = plans.map(p => p.price).filter(p => p > 0);
        const recentChanges = plans.filter(p => p.price_changed_recently).length;
        const totalPlans = plans.filter(p => p.type === 'plan').length;
        const totalNow = plans.filter(p => p.type === 'now').length;
        
        return {
          name,
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

      // Sort communities alphabetically
      communityData.sort((a, b) => a.name.localeCompare(b.name));

      setCommunities(communityData);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts or route changes
    window.scrollTo(0, 0);
    if (decodedCompanyName) {
      fetchCommunities();
      const interval = setInterval(fetchCommunities, 60 * 1000); // Refresh every 1 min
      return () => clearInterval(interval);
    }
  }, [decodedCompanyName]);

  const handleCommunityClick = (communityName: string) => {
    navigate(`/community/${encodeURIComponent(communityName)}?company=${encodeURIComponent(decodedCompanyName)}`);
  };

  if (!decodedCompanyName) {
    return <ErrorMessage message="Company not found" />;
  }

  const companyColor = getCompanyColor(decodedCompanyName);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span 
              className="inline-block w-6 h-6 rounded-full border-2"
              style={{ backgroundColor: companyColor, borderColor: companyColor }}
            />
            <h1 className="text-2xl font-semibold leading-none tracking-tight">{decodedCompanyName}</h1>
          </div>
          <p className="text-sm text-muted-foreground">Communities for {decodedCompanyName}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community) => (
            <Card
              key={community.name}
              onClick={() => handleCommunityClick(community.name)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 rounded-t-xl overflow-hidden">
                <img
                  src={getCommunityImage(community.name)}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                {community.recentChanges > 0 && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    {community.recentChanges} new
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle>{community.name}</CardTitle>
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
                      {community.totalPlans}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-success"></span>
                      <span className="text-sm font-medium text-muted-foreground">Available Now</span>
                    </div>
                    <Badge variant="success">
                      {community.totalNow}
                    </Badge>
                  </div>
                  
                  {/* Price Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Price:</span>
                      <span className="font-semibold text-primary">
                        ${community.avgPrice.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price Range:</span>
                      <span className="font-semibold text-foreground text-sm">
                        ${community.priceRange.min.toLocaleString()} - ${community.priceRange.max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {communities.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No communities found for {decodedCompanyName}.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;

