import { streamText } from 'ai';
import { models } from '@/lib/ai';
import { getEmployeeById, getAllEmployees } from '@/service/notion';
import { analyzeEmployeeRelationships } from '@/service/relationship-analysis';

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

    // Prepare the analysis prompt with structured thinking
    const prompt = `
You are an HR specialist analyzing employee relationships for onboarding purposes. Think through this step by step.

New Employee:
${JSON.stringify({
  name: employee.name,
  role: employee.role,
  department: employee.department,
  location: employee.location,
  culturalHeritage: employee.culturalHeritage,
  ageRange: employee.ageRange,
  startDate: employee.startDate,
}, null, 2)}

Existing Employees:
${JSON.stringify(allEmployees.filter(e => e.id !== employee.id).map(e => ({
  id: e.id,
  name: e.name,
  role: e.role,
  department: e.department,
  location: e.location,
  culturalHeritage: e.culturalHeritage,
  ageRange: e.ageRange,
  startDate: e.startDate,
  timeZone: e.timeZone,
})), null, 2)}

Think through the following:
1. What are the direct connections (same team, department, location)?
2. What cultural or social connections exist?
3. Who would be good mentors or guides?
4. What cross-functional relationships would be valuable?
5. Who are recent hires that could share their experience?

For each potential connection, explain your reasoning clearly.

After your analysis, provide a structured response with:
- Top recommended connections with relevance scores
- Key insights about the employee's potential network
- Specific onboarding recommendations
`;

    // Stream the thinking process
    const result = await streamText({
      model: models.claude37SonnetThinking,
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    });

    // Return the stream
    return new Response(result.textStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error analyzing relationships:', error);
    return Response.json(
      { error: 'Failed to analyze relationships' },
      { status: 500 }
    );
  }
}