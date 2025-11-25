import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from "chart.js";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import TypeTabs from "../components/TypeTabs";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import API_URL from '../config';
import { getCompanyColor, sortCompanies, getCanonicalCompanyName, isSameCompany } from '../utils/colors';


Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

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



const ChartPage: React.FC = () => {
  const { communityName } = useParams<{ communityName: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Get the type from URL parameter, default to 'now' if not specified
  const urlType = searchParams.get('type');
  const [selectedType, setSelectedType] = useState<string>(urlType === 'plan' ? 'Plan' : 'Now');
  const [selectedPricingLayer, setSelectedPricingLayer] = useState<string>('All');

  const decodedCommunityName = communityName ? decodeURIComponent(communityName) : '';

  useEffect(() => {
    // Scroll to top when component mounts or route changes
    window.scrollTo(0, 0);
    const fetchPlans = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL + "/plans");
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data = await res.json();
        
        // Filter plans for this specific community
        const communityPlans = data.filter((plan: Plan) => plan.community === decodedCommunityName);
        setPlans(communityPlans);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    
    if (decodedCommunityName) {
      fetchPlans();
    }
  }, [decodedCommunityName]);

  if (!decodedCommunityName) {
    return <ErrorMessage message="Community not found" />;
  }

  // Helper function to check if price falls in a pricing layer
  const isInPricingLayer = (price: number, layer: string): boolean => {
    if (layer === 'All') return true;
    
    // Only filter by price if price is valid (> 0)
    if (!price || price <= 0) return false;
    
    // Handle 100s+ (anything >= $1,000,000)
    if (layer === '100s') {
      return price >= 1000000;
    }
    
    // Extract the decade (20s, 30s, 40s, etc.)
    const decadeMatch = layer.match(/^(\d+)s$/);
    if (!decadeMatch) return true;
    
    const decade = parseInt(decadeMatch[1]);
    const minPrice = decade * 10000;
    const maxPrice = minPrice + 100000 -1;
    
    return price >= minPrice && price <= maxPrice;
  };

  // Filter plans by selected type and pricing layer
  const filteredPlans = plans.filter((plan) => {
    const typeMatch = selectedType === 'Plan' || selectedType === 'Now' 
      ? plan.type === selectedType.toLowerCase() 
      : true;
    
    const pricingLayerMatch = isInPricingLayer(plan.price, selectedPricingLayer);
    
    return typeMatch && pricingLayerMatch;
  });

  // Get all companies present in filtered data (using canonical names to avoid duplicates)
  const companies = sortCompanies(Array.from(new Set(filteredPlans.map((p) => getCanonicalCompanyName(p.company)))));

  // Prepare datasets for each company
  const datasets = companies.map((company) => {
    const filtered = filteredPlans.filter((p) => isSameCompany(p.company, company) && p.sqft && p.price);
    // Sort by sqft for a smooth line
    const sorted = filtered.sort((a, b) => a.sqft - b.sqft);
    return {
      label: company,
      data: sorted.map((p) => ({ x: p.sqft, y: p.price })),
      borderColor: getCompanyColor(company),
      backgroundColor: getCompanyColor(company) + '40', // Add 40 for transparency
      tension: 0.2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: false,
    };
  });

  // X axis: all unique sqft values (sorted) from filtered data
  const allSqft = Array.from(new Set(filteredPlans.filter((p) => p.sqft).map((p) => p.sqft))).sort((a, b) => a - b);

  const data = {
    labels: allSqft,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { font: { weight: "bold" }, color: '#2563eb' },
      },
      title: {
        display: true,
        text: `${decodedCommunityName} - Price vs Sqft by Company - ${selectedType} Homes`,
        color: "#2563eb",
        font: { size: 18, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const d = context.raw;
            return `Sqft: ${d.x} | Price: $${d.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Sqft", color: "#2563eb", font: { weight: "bold" } },
        ticks: { color: "#2563eb" },
        grid: { color: "#dbeafe" },
        type: 'linear',
      },
      y: {
        title: { display: true, text: "Price ($)", color: "#2563eb", font: { weight: "bold" } },
        ticks: { color: "#2563eb" },
        grid: { color: "#dbeafe" },
      },
    },
  } as any;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{decodedCommunityName} - Price Analysis</CardTitle>
              <div className="flex gap-4">
              <Button 
                onClick={() => navigate(`/community/${encodeURIComponent(decodedCommunityName)}`)}
                variant="outline"
              >
                ← Back to Community
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <TypeTabs selected={selectedType} onSelect={setSelectedType} className="w-auto" />
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-muted-foreground">Pricing Layer:</span>
              <Select value={selectedPricingLayer} onValueChange={setSelectedPricingLayer}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select pricing layer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="20s">20s ($200k-$299k)</SelectItem>
                  <SelectItem value="30s">30s ($300k-$399k)</SelectItem>
                  <SelectItem value="40s">40s ($400k-$499k)</SelectItem>
                  <SelectItem value="50s">50s ($500k-$599k)</SelectItem>
                  <SelectItem value="60s">60s ($600k-$699k)</SelectItem>
                  <SelectItem value="70s">70s ($700k-$799k)</SelectItem>
                  <SelectItem value="80s">80s ($800k-$899k)</SelectItem>
            
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div>
              {filteredPlans.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No {selectedType.toLowerCase()} homes found in {decodedCommunityName} to display in the chart.</p>
                </div>
              ) : (
                <Line data={data} options={options} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default ChartPage; 