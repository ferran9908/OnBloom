import { streamText } from 'ai';
import { models } from '@/lib/ai';
import { getEmployeeById, getAllEmployees } from '@/service/notion';
import { findDirectConnections } from '@/service/relationship-analysis';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { employeeId } = await req.json();
    
    if (!employeeId) {
      return Response.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    // Get the employee
    const employee = await getEmployeeById(employeeId);
    if (!employee) {
      return Response.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Get all employees for comparison
    const allEmployees = await getAllEmployees();

    // Get direct connections first
    const directConnections = findDirectConnections(employee, allEmployees);

    // Prepare the analysis prompt
    const prompt = `You are an HR specialist analyzing employee relationships for onboarding purposes. 

New Employee:
Name: ${employee.name}
Role: ${employee.role}
Department: ${employee.department}
Location: ${employee.location}
Cultural Heritage: ${employee.culturalHeritage?.join(', ') || 'Not specified'}
Age Range: ${employee.ageRange || 'Not specified'}
Start Date: ${employee.startDate}

Total Employees in Organization: ${allEmployees.length - 1}

Direct Connections Found:
${directConnections.map(conn => `- ${conn.employeeName} (${conn.connectionTypes?.join(', ')})`).join('\n')}

Think through this step by step:

1. First, analyze the direct connections - what patterns do you see?
2. Consider cultural and social connections - who shares similar backgrounds?
3. Think about professional development - who could be good mentors or guides?
4. Consider cross-functional relationships - which departments should they connect with?
5. Look for recent hires who could share their onboarding experience
6. Think about timezone and location practicalities

For each potential connection, explain your reasoning clearly. Consider both obvious connections (same team/department) and less obvious but potentially valuable connections (cross-functional, cultural, mentorship).

After your analysis, summarize:
- The top 5-10 most valuable connections with clear reasoning
- Key insights about their potential network
- Specific recommendations for the onboarding process

Think out loud about your reasoning process.`;

    // Stream the thinking process
    const result = await streamText({
      model: models.claude37SonnetThinking,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 4000,
    });

    // Return the stream with proper headers
    return new Response(result.textStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error streaming analysis:', error);
    return Response.json(
      { error: 'Failed to stream analysis' },
      { status: 500 }
    );
  }
}