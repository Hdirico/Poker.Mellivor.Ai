export const MCP_CONFIG = {
  "portal-poker": {
    "url": "https://portal-poker.azurewebsites.net/mcp"
  }
} as const;

export interface MCPToolCall {
  name: string;
  arguments?: Record<string, any>;
}

export interface MCPResponse {
  content: Array<{
    type: string;
    text?: string;
    [key: string]: any;
  }>;
  isError?: boolean;
}

export class MCPClient {
  private baseUrl: string;

  constructor(baseUrl: string = MCP_CONFIG["portal-poker"].url) {
    this.baseUrl = baseUrl;
  }

  async initialize(): Promise<{ protocolVersion: string; capabilities: any; serverInfo: any }> {
    const response = await fetch(`${this.baseUrl}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'mellipoker-ai',
          version: '1.0.0'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize MCP: ${response.statusText}`);
    }

    return response.json();
  }

  async listTools(): Promise<{ tools: Array<{ name: string; description?: string; inputSchema: any }> }> {
    const response = await fetch(`${this.baseUrl}/tools/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`Failed to list tools: ${response.statusText}`);
    }

    return response.json();
  }

  async callTool(toolName: string, args: Record<string, any> = {}): Promise<MCPResponse> {
    const response = await fetch(`${this.baseUrl}/tools/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: toolName,
        arguments: args
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to call tool ${toolName}: ${response.statusText}`);
    }

    return response.json();
  }

  async listResources(): Promise<{ resources: Array<{ uri: string; name: string; description?: string }> }> {
    const response = await fetch(`${this.baseUrl}/resources/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`Failed to list resources: ${response.statusText}`);
    }

    return response.json();
  }

  async readResource(uri: string): Promise<{ contents: Array<{ uri: string; mimeType?: string; text?: string }> }> {
    const response = await fetch(`${this.baseUrl}/resources/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uri
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to read resource ${uri}: ${response.statusText}`);
    }

    return response.json();
  }
}

export const mcpClient = new MCPClient();
