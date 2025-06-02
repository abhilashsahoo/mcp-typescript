#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import { TaskManager } from './task-manager';
import { createTaskTools } from './tools/task-tools';

// Initialize task manager
const taskManager = new TaskManager();

// Create MCP server
const server = new Server(
  {
    name: 'task-manager-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// Get tool definitions
const tools = createTaskTools(taskManager);
const toolList = Object.values(tools);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolList.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = tools[name as keyof typeof tools];
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  return await tool.handler(args);
});

// Handle resource listing
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'tasks://summary',
        name: 'Task Summary',
        description: 'Overview of all tasks and statistics'
      }
    ]
  };
});

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'tasks://summary') {
    const stats = taskManager.getTaskStats();
    const recentTasks = taskManager.getTasks().slice(0, 5);
    
    const summary = {
      statistics: stats,
      recentTasks: recentTasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt.toISOString(),
        dueDate: task.dueDate?.toISOString()
      }))
    };

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(summary, null, 2)
        }
      ]
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Task Manager MCP Server running on stdio');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Shutting down...');
  process.exit(0);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});