import { notion } from '@/lib/notion'

export interface EmployeeCulturalProfile {
  id: string
  name: string
  email: string
  employeeId: string
  department: string
  role: string
  startDate: string
  location: string
  timeZone: string
  ageRange: string
  genderIdentity: string
  culturalHeritage: string[]
  tags?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPropertyValue(properties: any, propertyName: string): any {
  const property = properties[propertyName]
  if (!property) return null

  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || ''
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || ''
    case 'email':
      return property.email || ''
    case 'select':
      return property.select?.name || ''
    case 'multi_select':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return property.multi_select?.map((item: any) => item.name) || []
    case 'date':
      return property.date?.start || ''
    case 'number':
      return property.number || 0
    case 'checkbox':
      return property.checkbox || false
    case 'url':
      return property.url || ''
    default:
      return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notionPageToEmployee(page: any): EmployeeCulturalProfile {
  const { properties } = page
  
  return {
    id: page.id,
    name: getPropertyValue(properties, 'Name'),
    email: getPropertyValue(properties, 'Email'),
    employeeId: getPropertyValue(properties, 'Employee ID'),
    department: getPropertyValue(properties, 'Department'),
    role: getPropertyValue(properties, 'Role'),
    startDate: getPropertyValue(properties, 'Start Date'),
    location: getPropertyValue(properties, 'Location'),
    timeZone: getPropertyValue(properties, 'Time Zone'),
    ageRange: getPropertyValue(properties, 'Age Range'),
    genderIdentity: getPropertyValue(properties, 'Gender Identity'),
    culturalHeritage: getPropertyValue(properties, 'Cultural Heritage'),
    tags: getPropertyValue(properties, 'Tags'),
  }
}

export async function getAllEmployees(): Promise<EmployeeCulturalProfile[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not configured')
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Tags',
        multi_select: {
          contains: 'New Hire',
        },
      },
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    })

    return response.results.map(notionPageToEmployee)
  } catch (error) {
    console.error('Error fetching employees from Notion:', error)
    throw new Error(`Failed to fetch employees: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getEmployeeById(id: string): Promise<EmployeeCulturalProfile | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id })
    
    if (!response) {
      return null
    }

    return notionPageToEmployee(response)
  } catch (error) {
    console.error(`Error fetching employee ${id} from Notion:`, error)
    
    if (error instanceof Error && error.message.includes('Could not find page')) {
      return null
    }
    
    throw new Error(`Failed to fetch employee: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function searchEmployees(query: string): Promise<EmployeeCulturalProfile[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not configured')
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'Name',
            title: {
              contains: query,
            },
          },
          {
            property: 'Email',
            email: {
              contains: query,
            },
          },
        ],
      },
    })

    return response.results.map(notionPageToEmployee)
  } catch (error) {
    console.error('Error searching employees:', error)
    throw new Error(`Failed to search employees: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getEmployeesByDepartment(department: string): Promise<EmployeeCulturalProfile[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not configured')
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Department',
        select: {
          equals: department,
        },
      },
    })

    return response.results.map(notionPageToEmployee)
  } catch (error) {
    console.error(`Error fetching employees in ${department}:`, error)
    throw new Error(`Failed to fetch employees by department: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export type CreateEmployeeData = Omit<EmployeeCulturalProfile, 'id' | 'tags'>

function createNotionProperties(employeeData: CreateEmployeeData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {
    'Name': {
      title: [
        {
          text: {
            content: employeeData.name,
          },
        },
      ],
    },
    'Email': {
      email: employeeData.email,
    },
    'Employee ID': {
      rich_text: [
        {
          text: {
            content: employeeData.employeeId,
          },
        },
      ],
    },
    'Department': {
      select: {
        name: employeeData.department,
      },
    },
    'Role': {
      select: {
        name: employeeData.role,
      },
    },
    'Start Date': {
      date: {
        start: employeeData.startDate,
      },
    },
    'Location': {
      rich_text: [
        {
          text: {
            content: employeeData.location,
          },
        },
      ],
    },
    'Time Zone': {
      select: {
        name: employeeData.timeZone,
      },
    },
    'Tags': {
      multi_select: [
        { name: 'New Hire' }
      ],
    },
  }

  // Only add optional fields if they have values
  if (employeeData.ageRange && employeeData.ageRange.trim()) {
    properties['Age Range'] = {
      select: {
        name: employeeData.ageRange,
      },
    }
  }

  if (employeeData.genderIdentity && employeeData.genderIdentity.trim()) {
    properties['Gender Identity'] = {
      select: {
        name: employeeData.genderIdentity,
      },
    }
  }

  if (employeeData.culturalHeritage && employeeData.culturalHeritage.length > 0) {
    properties['Cultural Heritage'] = {
      multi_select: employeeData.culturalHeritage.map(heritage => ({
        name: heritage,
      })),
    }
  }

  return properties
}

export async function createEmployee(employeeData: CreateEmployeeData): Promise<EmployeeCulturalProfile> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not configured')
    }

    const properties = createNotionProperties(employeeData)
    console.log('Creating employee with properties:', JSON.stringify(properties, null, 2))

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties,
    })

    return notionPageToEmployee(response)
  } catch (error) {
    console.error('Error creating employee in Notion:', error)
    throw new Error(`Failed to create employee: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function createPartialNotionProperties(employeeData: Partial<CreateEmployeeData>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {}

  if (employeeData.name) {
    properties['Name'] = {
      title: [
        {
          text: {
            content: employeeData.name,
          },
        },
      ],
    }
  }

  if (employeeData.email) {
    properties['Email'] = {
      email: employeeData.email,
    }
  }

  if (employeeData.employeeId) {
    properties['Employee ID'] = {
      rich_text: [
        {
          text: {
            content: employeeData.employeeId,
          },
        },
      ],
    }
  }

  if (employeeData.department) {
    properties['Department'] = {
      select: {
        name: employeeData.department,
      },
    }
  }

  if (employeeData.role) {
    properties['Role'] = {
      select: {
        name: employeeData.role,
      },
    }
  }

  if (employeeData.startDate) {
    properties['Start Date'] = {
      date: {
        start: employeeData.startDate,
      },
    }
  }

  if (employeeData.location) {
    properties['Location'] = {
      rich_text: [
        {
          text: {
            content: employeeData.location,
          },
        },
      ],
    }
  }

  if (employeeData.timeZone) {
    properties['Time Zone'] = {
      select: {
        name: employeeData.timeZone,
      },
    }
  }

  if (employeeData.ageRange && employeeData.ageRange.trim()) {
    properties['Age Range'] = {
      select: {
        name: employeeData.ageRange,
      },
    }
  }

  if (employeeData.genderIdentity && employeeData.genderIdentity.trim()) {
    properties['Gender Identity'] = {
      select: {
        name: employeeData.genderIdentity,
      },
    }
  }

  if (employeeData.culturalHeritage && employeeData.culturalHeritage.length > 0) {
    properties['Cultural Heritage'] = {
      multi_select: employeeData.culturalHeritage.map(heritage => ({
        name: heritage,
      })),
    }
  }

  return properties
}

export async function updateEmployee(id: string, employeeData: Partial<CreateEmployeeData>): Promise<EmployeeCulturalProfile> {
  try {
    const properties = createPartialNotionProperties(employeeData)

    if (Object.keys(properties).length === 0) {
      throw new Error('No valid data provided for update')
    }

    const response = await notion.pages.update({
      page_id: id,
      properties,
    })

    return notionPageToEmployee(response)
  } catch (error) {
    console.error(`Error updating employee ${id} in Notion:`, error)
    throw new Error(`Failed to update employee: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}