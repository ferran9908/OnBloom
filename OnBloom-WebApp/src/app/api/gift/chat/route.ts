import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { models } from '@/lib/ai';
import { getEmployeeById } from '@/service/notion';
import { createQlooService, EntityURN, AgeGroups } from '@/lib/qloo';

export const runtime = 'edge';

interface ChatRequest {
  message: string;
  mentionedEmployees: Array<{
    id: string;
    name: string;
  }>;
  previousMessages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
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

// Extract gift context from the conversation
function extractGiftContext(message: string, previousMessages?: Array<{ role: string; content: string }>) {
  const fullConversation = [
    ...(previousMessages || []),
    { role: 'user', content: message }
  ].map(m => m.content).join(' ');

  // Extract occasions
  const occasionPatterns = [
    /anniversary/i,
    /birthday/i,
    /retirement/i,
    /promotion/i,
    /farewell/i,
    /welcome/i,
    /holiday/i,
    /christmas/i,
    /new year/i,
    /team celebration/i,
    /milestone/i,
  ];

  const occasions = occasionPatterns
    .filter(pattern => pattern.test(fullConversation))
    .map(pattern => pattern.source.replace(/[\/\\i]/g, ''));

  // Extract price range mentions
  const priceMatch = fullConversation.match(/\$(\d+)(?:\s*-\s*\$?(\d+))?/);
  const priceRange = priceMatch ? {
    min: parseInt(priceMatch[1]),
    max: priceMatch[2] ? parseInt(priceMatch[2]) : parseInt(priceMatch[1]) * 2
  } : null;

  // Extract interests or categories
  const interestPatterns = [
    /tech|technology|gadget/i,
    /book|reading|literature/i,
    /food|gourmet|cooking/i,
    /fitness|health|wellness/i,
    /travel|adventure/i,
    /music|audio/i,
    /art|creative/i,
    /coffee|tea/i,
    /wine|spirits/i,
    /fashion|style/i,
  ];

  const interests = interestPatterns
    .filter(pattern => pattern.test(fullConversation))
    .map(pattern => pattern.source.replace(/[\/\\i]/g, '').split('|')[0]);

  return { occasions, priceRange, interests };
}

export async function POST(request: NextRequest) {
  try {
    const { message, mentionedEmployees, previousMessages } = await request.json() as ChatRequest;

    // Fetch employee details for mentioned employees
    const employeeProfiles = await Promise.all(
      mentionedEmployees.map(async (emp) => {
        try {
          const profile = await getEmployeeById(emp.id);
          return profile;
        } catch (error) {
          console.error(`Failed to fetch employee ${emp.id}:`, error);
          return null;
        }
      })
    );

    const validProfiles = employeeProfiles.filter(Boolean);
    
    // Extract gift context
    const giftContext = extractGiftContext(message, previousMessages);

    // Build employee context for the AI
    const employeeContext = validProfiles.map(profile => {
      if (!profile) return '';
      return `
Employee: ${profile.name}
- Department: ${profile.department}
- Role: ${profile.role}
- Location: ${profile.location}
- Start Date: ${profile.startDate}
${profile.ageRange ? `- Age Range: ${profile.ageRange}` : ''}
${profile.culturalHeritage?.length ? `- Cultural Background: ${profile.culturalHeritage.join(', ')}` : ''}
      `.trim();
    }).join('\n\n');

    // Get Qloo recommendations if we have employee profiles
    let qlooRecommendations = null;
    if (validProfiles.length > 0 && process.env.QLOO_API_KEY) {
      try {
        const qloo = createQlooService(process.env.QLOO_API_KEY, {
          environment: 'hackathon'
        });

        // Use the first mentioned employee's demographics for recommendations
        const targetEmployee = validProfiles[0];
        const ageGroup = targetEmployee?.ageRange ? mapAgeToQlooGroup(targetEmployee.ageRange) : undefined;

        // Normalize gender to only 'male' or 'female' as required by Qloo API
        const normalizedGender = targetEmployee?.genderIdentity?.toLowerCase() === 'male' 
          ? 'male' 
          : 'female'; // Default to female if not male or unsure
        
        // Ensure we have a valid age group - default to young adult if not specified
        const finalAgeGroup = ageGroup || AgeGroups.YOUNG_ADULT;
        
        const insights = await qloo.getInsights({
          filterType: EntityURN.BRAND,
          signal: {
            demographics: {
              age: finalAgeGroup,
              gender: normalizedGender,
            },
            // Add location in WKT format
            location: targetEmployee?.location 
              ? locationToWKT(targetEmployee.location)
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
            trends: 'medium',
          },
          take: 10,
        });

        qlooRecommendations = Array.isArray(insights.results) ? insights.results : [];
      } catch (error) {
        console.error('Failed to get Qloo recommendations:', error);
      }
    }

    // Build the prompt for Perplexity
    const systemPrompt = `You are a helpful gift recommendation assistant for a corporate gifting platform. 
You help employees find thoughtful, appropriate gifts for their colleagues.
Focus on professional, tasteful gift suggestions that are appropriate for a workplace setting.
Consider the recipient's role, department, interests, and any mentioned occasions.
${employeeContext ? `\nEmployee Information:\n${employeeContext}` : ''}
${giftContext.occasions.length > 0 ? `\nOccasion: ${giftContext.occasions.join(', ')}` : ''}
${giftContext.priceRange ? `\nBudget: $${giftContext.priceRange.min} - $${giftContext.priceRange.max}` : ''}
${giftContext.interests.length > 0 ? `\nInterests mentioned: ${giftContext.interests.join(', ')}` : ''}
${qlooRecommendations && qlooRecommendations.length > 0 ? `\n\nBased on cultural intelligence data, here are some personalized brand recommendations:\n${qlooRecommendations.slice(0, 5).map(r => `- ${r.name} (Affinity Score: ${(r.affinity || 0).toFixed(2)})`).join('\n')}` : ''}

Provide specific gift suggestions with reasoning. Be conversational and helpful.`;

    const userPrompt = previousMessages && previousMessages.length > 0
      ? `Previous conversation:\n${previousMessages.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${message}`
      : message;

    // Generate response using Perplexity
    const response = await generateText({
      model: models.perplexityPro,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      maxTokens: 1500,
    });

    return NextResponse.json({
      content: response.text,
      context: {
        mentionedEmployees: validProfiles,
        giftContext,
        qlooRecommendations: qlooRecommendations && Array.isArray(qlooRecommendations) ? qlooRecommendations.slice(0, 5).map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          affinity: r.affinity,
          explainability: r.explainability,
        })) : null,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}