import { NextRequest, NextResponse } from 'next/server';
import { createQlooService, EntityURN, AgeGroups } from '@/lib/qloo';
import { getEmployeeById } from '@/service/notion';
import { z } from 'zod';

export const runtime = 'edge';

interface RecommendationsRequest {
  recipientId: string;
  interests?: string[];
  occasion?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Schema for Qloo entity response
const QlooEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  affinity: z.number().optional(),
  popularity: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
    region: z.string().optional(),
  }).optional(),
  explainability: z.any().optional(),
});

const QlooResponseSchema = z.object({
  results: z.array(QlooEntitySchema).default([]),
});

// Convert location string to WKT POINT format
function locationToWKT(location: string): string {
  // Common location patterns
  const cityPatterns: Record<string, string> = {
    'san francisco': 'POINT(-122.4194 37.7749)',
    'new york': 'POINT(-74.0060 40.7128)',
    'los angeles': 'POINT(-118.2437 34.0522)',
    'chicago': 'POINT(-87.6298 41.8781)',
    'boston': 'POINT(-71.0589 42.3601)',
    'seattle': 'POINT(-122.3321 47.6062)',
    'austin': 'POINT(-97.7431 30.2672)',
    'denver': 'POINT(-104.9903 39.7392)',
    'atlanta': 'POINT(-84.3880 33.7490)',
    'miami': 'POINT(-80.1918 25.7617)',
    'dallas': 'POINT(-96.7970 32.7767)',
    'houston': 'POINT(-95.3698 29.7604)',
    'philadelphia': 'POINT(-75.1652 39.9526)',
    'phoenix': 'POINT(-112.0740 33.4484)',
    'san diego': 'POINT(-117.1611 32.7157)',
    'portland': 'POINT(-122.6765 45.5152)',
    'washington': 'POINT(-77.0369 38.9072)',
    'dc': 'POINT(-77.0369 38.9072)',
  };
  
  const lowerLocation = location.toLowerCase().trim();
  
  // Check for city match
  for (const [city, wkt] of Object.entries(cityPatterns)) {
    if (lowerLocation.includes(city)) {
      return wkt;
    }
  }
  
  // Default to US center (Kansas) if we can't identify the location
  // This provides a reasonable default for US-based recommendations
  return 'POINT(-98.5795 39.8283)';
}

// Map age ranges from Notion to Qloo age groups
function mapAgeToQlooGroup(ageRange: string): string | undefined {
  const ageMap: Record<string, string> = {
    '18-25': AgeGroups.AGE_24_AND_YOUNGER,
    '26-35': AgeGroups.AGE_30_TO_34,
    '36-45': AgeGroups.AGE_35_TO_44,
    '46-55': AgeGroups.AGE_45_TO_54,
    '56-65': AgeGroups.SENIOR,
    '65+': AgeGroups.SENIOR,
  };
  return ageMap[ageRange];
}

// Map occasions to relevant tags
function getOccasionTags(occasion?: string): string[] {
  if (!occasion) return [];
  
  const occasionMap: Record<string, string[]> = {
    anniversary: ['celebration', 'milestone', 'achievement'],
    birthday: ['celebration', 'personal', 'fun'],
    retirement: ['milestone', 'farewell', 'recognition'],
    promotion: ['achievement', 'professional', 'celebration'],
    farewell: ['goodbye', 'memory', 'appreciation'],
    welcome: ['onboarding', 'welcome', 'team'],
    holiday: ['seasonal', 'festive', 'gift'],
    'team celebration': ['team', 'group', 'celebration'],
  };

  const normalizedOccasion = occasion.toLowerCase();
  for (const [key, tags] of Object.entries(occasionMap)) {
    if (normalizedOccasion.includes(key)) {
      return tags;
    }
  }
  
  return ['gift', 'appreciation'];
}

export async function POST(request: NextRequest) {
  try {
    const { recipientId, interests, occasion, priceRange } = await request.json() as RecommendationsRequest;

    if (!process.env.QLOO_API_KEY) {
      return NextResponse.json(
        { error: 'Qloo API key not configured' },
        { status: 500 }
      );
    }

    // Fetch recipient profile
    const recipientProfile = await getEmployeeById(recipientId);
    if (!recipientProfile) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Initialize Qloo service - use hackathon environment
    const qloo = createQlooService(process.env.QLOO_API_KEY, {
      environment: 'hackathon'
    });

    // Prepare demographics
    const ageGroup = recipientProfile.ageRange ? mapAgeToQlooGroup(recipientProfile.ageRange) : undefined;
    // Normalize gender to only 'male' or 'female' as required by Qloo API
    const gender = recipientProfile.genderIdentity?.toLowerCase() === 'male' ? 'male' : 'female';

    // Ensure we have a valid age group - default to young adult if not specified
    const finalAgeGroup = ageGroup || AgeGroups.YOUNG_ADULT;
    
    console.log('Qloo API Request - Demographics:', { ageGroup: finalAgeGroup, gender });

    let brandInsights = { results: [] };
    let placeInsights = { results: [] };

    try {
      // Get brand recommendations
      const brandInsightsRaw = await qloo.getInsights({
        filterType: EntityURN.BRAND,
        signal: {
          demographics: {
            age: finalAgeGroup,
            gender: gender,
          },
          // Add location in WKT format
          location: recipientProfile?.location 
            ? locationToWKT(recipientProfile.location)
            : 'POINT(-98.5795 39.8283)', // US center as default
        },
        // Add a filter to ensure we have at least one valid signal
        filter: {
          popularity: 0.1, // Only show brands with at least 10% popularity
        },
        feature: {
          explainability: true,
        },
        bias: {
          trends: 'high',
        },
        take: 20,
      });

      // Get product/place recommendations
      const placeInsightsRaw = await qloo.getInsights({
        filterType: EntityURN.PLACE,
        signal: {
          demographics: {
            age: finalAgeGroup,
            gender: gender,
          },
          // Add location in WKT format
          location: recipientProfile?.location 
            ? locationToWKT(recipientProfile.location)
            : 'POINT(-98.5795 39.8283)', // US center as default
        },
        // Add a filter to ensure we have at least one valid signal
        filter: {
          popularity: 0.05, // Lower threshold for places
        },
        feature: {
          explainability: true,
        },
        take: 10,
      });

      // The Qloo service returns { results: data } where data might be an object or array
      // Ensure results is always an array
      brandInsights = {
        results: Array.isArray(brandInsightsRaw.results) 
          ? brandInsightsRaw.results 
          : brandInsightsRaw.results && typeof brandInsightsRaw.results === 'object'
          ? Object.values(brandInsightsRaw.results)
          : []
      };
      
      placeInsights = {
        results: Array.isArray(placeInsightsRaw.results) 
          ? placeInsightsRaw.results 
          : placeInsightsRaw.results && typeof placeInsightsRaw.results === 'object'
          ? Object.values(placeInsightsRaw.results)
          : []
      };
    } catch (error) {
      console.error('Error fetching Qloo recommendations:', error);
      // Continue with empty results
    }

    // Combine and format recommendations
    const recommendations = [
      ...brandInsights.results.filter(brand => brand && brand.id && brand.name).map(brand => ({
        id: brand.id,
        name: brand.name,
        type: 'brand' as const,
        category: brand.category,
        affinityScore: brand.affinity || 0,
        popularity: brand.popularity,
        explainability: brand.explainability,
        metadata: {
          ...brand.metadata,
          suggestedGifts: getSuggestedGiftsForBrand(brand.name, occasion),
        },
      })),
      ...placeInsights.results.filter(place => place && place.id && place.name).map(place => ({
        id: place.id,
        name: place.name,
        type: 'place' as const,
        category: place.category,
        affinityScore: place.affinity || 0,
        popularity: place.popularity,
        location: place.geo,
        explainability: place.explainability,
        metadata: place.metadata,
      })),
    ].sort((a, b) => b.affinityScore - a.affinityScore);

    // Filter by price range if provided
    const filteredRecommendations = priceRange
      ? recommendations.filter(rec => {
          // This is a simplified filter - in reality, you'd need product pricing data
          return true; // For now, return all recommendations
        })
      : recommendations;

    return NextResponse.json({
      recipient: {
        id: recipientProfile.id,
        name: recipientProfile.name,
        department: recipientProfile.department,
        role: recipientProfile.role,
      },
      recommendations: filteredRecommendations.slice(0, 15),
      context: {
        occasion,
        interests,
        priceRange,
        demographics: {
          ageGroup,
          gender,
          location: recipientProfile.location,
        },
      },
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

// Helper function to suggest specific gifts for brands
function getSuggestedGiftsForBrand(brandName: string, occasion?: string): string[] {
  // This is a simplified mapping - in production, you'd have a more comprehensive database
  const brandGiftMap: Record<string, string[]> = {
    'Apple': ['AirPods', 'Apple Gift Card', 'iPad Accessories', 'Apple Watch Band'],
    'Amazon': ['Kindle', 'Echo Dot', 'Amazon Gift Card', 'Prime Membership'],
    'Starbucks': ['Gift Card', 'Tumbler Set', 'Coffee Bean Subscription', 'Merchandise Bundle'],
    'Nike': ['Gift Card', 'Sneakers', 'Gym Bag', 'Athletic Wear'],
    'Patagonia': ['Fleece Jacket', 'Backpack', 'Water Bottle', 'Gift Card'],
    'Moleskine': ['Notebook Set', 'Pen Collection', 'Digital Writing Set', 'Planner'],
    'LEGO': ['Architecture Set', 'Ideas Set', 'Botanical Collection', 'Display Set'],
    'MasterClass': ['Annual Subscription', 'Gift Subscription', 'Course Bundle'],
    'Spotify': ['Premium Subscription', 'Gift Card', 'Merchandise'],
    'Headspace': ['Annual Subscription', 'Meditation Bundle', 'Gift Membership'],
  };

  const suggestions = brandGiftMap[brandName] || ['Gift Card', 'Brand Merchandise', 'Product Bundle'];
  
  // Filter suggestions based on occasion if needed
  if (occasion?.toLowerCase().includes('retirement')) {
    return suggestions.filter(s => !s.toLowerCase().includes('subscription'));
  }
  
  return suggestions;
}