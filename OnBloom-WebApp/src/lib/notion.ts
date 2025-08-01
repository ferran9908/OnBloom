import { Client as NotionClient } from '@notionhq/client'

// Initializing a client
export const notion = new NotionClient({
  auth: process.env.NOTION_API_KEY,
})
