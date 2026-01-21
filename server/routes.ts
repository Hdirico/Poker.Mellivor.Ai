import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const MCP_SERVER_URL = "https://portal-poker.azurewebsites.net/mcp";

async function callMCPTool(toolName: string, args: Record<string, any> = {}) {
  const response = await fetch(`${MCP_SERVER_URL}/tools/call`, {
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
    throw new Error(`MCP tool call failed: ${response.statusText}`);
  }

  return response.json();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post('/api/mcp/initialize', async (req, res) => {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/initialize`, {
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

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('MCP initialize error:', error);
      res.status(500).json({ error: 'Failed to initialize MCP server' });
    }
  });

  app.post('/api/mcp/tools/list', async (req, res) => {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/tools/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('MCP tools list error:', error);
      res.status(500).json({ error: 'Failed to list MCP tools' });
    }
  });

  app.post('/api/mcp/tools/call', async (req, res) => {
    try {
      const { name, arguments: args } = req.body;
      const data = await callMCPTool(name, args);
      res.json(data);
    } catch (error) {
      console.error('MCP tool call error:', error);
      res.status(500).json({ error: 'Failed to call MCP tool' });
    }
  });

  app.post('/api/mcp/resources/list', async (req, res) => {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/resources/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('MCP resources list error:', error);
      res.status(500).json({ error: 'Failed to list MCP resources' });
    }
  });

  app.post('/api/mcp/resources/read', async (req, res) => {
    try {
      const { uri } = req.body;
      const response = await fetch(`${MCP_SERVER_URL}/resources/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uri })
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('MCP resource read error:', error);
      res.status(500).json({ error: 'Failed to read MCP resource' });
    }
  });

  app.post('/api/poker/deal', async (req, res) => {
    try {
      const { gameId } = req.body;
      const data = await callMCPTool('deal_cards', { gameId });
      res.json(data);
    } catch (error) {
      console.error('Deal error:', error);
      res.status(500).json({ error: 'Failed to deal cards' });
    }
  });

  app.post('/api/poker/fold', async (req, res) => {
    try {
      const { gameId, playerId } = req.body;
      const data = await callMCPTool('player_fold', { gameId, playerId });
      res.json(data);
    } catch (error) {
      console.error('Fold error:', error);
      res.status(500).json({ error: 'Failed to fold' });
    }
  });

  app.post('/api/poker/check', async (req, res) => {
    try {
      const { gameId, playerId } = req.body;
      const data = await callMCPTool('player_check', { gameId, playerId });
      res.json(data);
    } catch (error) {
      console.error('Check error:', error);
      res.status(500).json({ error: 'Failed to check' });
    }
  });

  app.post('/api/poker/call', async (req, res) => {
    try {
      const { gameId, playerId } = req.body;
      const data = await callMCPTool('player_call', { gameId, playerId });
      res.json(data);
    } catch (error) {
      console.error('Call error:', error);
      res.status(500).json({ error: 'Failed to call' });
    }
  });

  app.post('/api/poker/raise', async (req, res) => {
    try {
      const { gameId, playerId, amount } = req.body;
      const data = await callMCPTool('player_raise', { gameId, playerId, amount });
      res.json(data);
    } catch (error) {
      console.error('Raise error:', error);
      res.status(500).json({ error: 'Failed to raise' });
    }
  });

  app.get('/api/poker/game/:gameId', async (req, res) => {
    try {
      const { gameId } = req.params;
      const data = await callMCPTool('get_game_state', { gameId });
      res.json(data);
    } catch (error) {
      console.error('Get game state error:', error);
      res.status(500).json({ error: 'Failed to get game state' });
    }
  });

  return httpServer;
}
