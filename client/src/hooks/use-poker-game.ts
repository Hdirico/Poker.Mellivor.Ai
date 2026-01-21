import { useState, useCallback } from "react";

type Suit = "spade" | "heart" | "diamond" | "club";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

interface Player {
  id: string;
  name: string;
  chips: number;
  cards: Card[];
  isActive: boolean;
  isFolded: boolean;
  bet: number;
  position: "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left";
  showCards: boolean;
  isDealer?: boolean;
  isBigBlind?: boolean;
  isSmallBlind?: boolean;
  playerType?: "human" | "ai";
  seat?: number;
}

interface GameState {
  tableId: string | null;
  handNumber: number;
  status: "idle" | "ready" | "active" | "complete";
  stage: "preflop" | "flop" | "turn" | "river" | "showdown";
  pot: number;
  players: Player[];
  communityCards: Card[];
  dealerSeat: number;
  actorSeat: number;
  smallBlind: number;
  bigBlind: number;
  isLoading: boolean;
  error: string | null;
  humanSeat: number;
}

const positionOrder = ["top-left", "top-right", "right", "bottom", "left"] as const;

function parseCard(cardStr: string): Card | null {
  if (!cardStr || cardStr.length < 2) return null;
  
  const rankMap: Record<string, Rank> = {
    'A': 'A', '2': '2', '3': '3', '4': '4', '5': '5',
    '6': '6', '7': '7', '8': '8', '9': '9', 'T': '10',
    'J': 'J', 'Q': 'Q', 'K': 'K', '10': '10'
  };
  
  const suitMap: Record<string, Suit> = {
    'h': 'heart', 'd': 'diamond', 'c': 'club', 's': 'spade'
  };
  
  const rankChar = cardStr.slice(0, -1);
  const suitChar = cardStr.slice(-1).toLowerCase();
  
  const rank = rankMap[rankChar];
  const suit = suitMap[suitChar];
  
  if (!rank || !suit) return null;
  return { suit, rank };
}

async function callMCPTool(name: string, args: Record<string, any> = {}) {
  const response = await fetch('/api/mcp/tools/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, arguments: args })
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message || 'MCP call failed');
  }
  
  const result = data.result?.structuredContent || data.result;
  
  if (data.result?.isError) {
    return { ...result, isError: true };
  }
  
  return result;
}

export function usePokerGame() {
  const [gameState, setGameState] = useState<GameState>({
    tableId: null,
    handNumber: 0,
    status: "idle",
    stage: "preflop",
    pot: 0,
    players: [],
    communityCards: [],
    dealerSeat: 0,
    actorSeat: -1,
    smallBlind: 5,
    bigBlind: 10,
    isLoading: false,
    error: null,
    humanSeat: 0,
  });

  const updateGameFromMCP = useCallback((mcpState: any, humanSeat: number = 0) => {
    const players: Player[] = mcpState.seats?.map((seat: any, index: number) => {
      const position = positionOrder[index % positionOrder.length];
      const isHuman = seat.player_type === "human";
      
      let cards: Card[] = [];
      if (seat.cards && Array.isArray(seat.cards)) {
        cards = seat.cards.map(parseCard).filter(Boolean) as Card[];
      }
      
      return {
        id: String(seat.seat),
        name: seat.player_name || seat.name,
        chips: seat.stack,
        cards,
        isActive: mcpState.actor_seat === seat.seat,
        isFolded: seat.is_folded || false,
        bet: seat.bet || 0,
        position,
        showCards: isHuman || mcpState.stage === "showdown",
        isDealer: mcpState.dealer_seat === seat.seat,
        isSmallBlind: (mcpState.dealer_seat + 1) % mcpState.seat_count === seat.seat,
        isBigBlind: (mcpState.dealer_seat + 2) % mcpState.seat_count === seat.seat,
        playerType: seat.player_type,
        seat: seat.seat,
      };
    }) || [];

    const communityCards: Card[] = (mcpState.board || [])
      .map(parseCard)
      .filter(Boolean) as Card[];

    setGameState(prev => ({
      ...prev,
      tableId: mcpState.table_id,
      handNumber: mcpState.hand_number || prev.handNumber,
      status: mcpState.status || "active",
      stage: mcpState.stage || "preflop",
      pot: mcpState.pot || 0,
      players,
      communityCards,
      dealerSeat: mcpState.dealer_seat || 0,
      actorSeat: mcpState.actor_seat ?? -1,
      smallBlind: mcpState.small_blind || 5,
      bigBlind: mcpState.big_blind || 10,
      humanSeat,
      isLoading: false,
      error: null,
    }));

    return mcpState;
  }, []);

  const processAITurns = useCallback(async (currentState: any) => {
    let state = currentState;
    
    while (
      state.status === "active" && 
      state.actor_seat !== undefined && 
      state.actor_seat !== gameState.humanSeat
    ) {
      const actorSeat = state.seats?.find((s: any) => s.seat === state.actor_seat);
      if (!actorSeat || actorSeat.player_type !== "ai") break;
      
      try {
        const result = await callMCPTool("trigger_ai", {
          table_id: state.table_id,
          seat: state.actor_seat,
        });
        
        if (result.isError) {
          console.error("AI trigger failed:", result);
          setGameState(prev => ({ ...prev, isLoading: false, error: "AI server error - please try again later" }));
          break;
        }
        
        state = result;
        updateGameFromMCP(result, gameState.humanSeat);
        
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error("AI turn error:", error);
        setGameState(prev => ({ ...prev, isLoading: false, error: "AI server error" }));
        break;
      }
    }
    
    return state;
  }, [gameState.humanSeat, updateGameFromMCP]);

  const createTable = useCallback(async (playerConfigs?: { name: string; type: "human" | "ai"; stack: number }[]) => {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const defaultPlayers = [
        { name: "You", type: "human" as const, stack: 1000 },
        { name: "Sarah K.", type: "ai" as const, stack: 1000 },
        { name: "Mike R.", type: "ai" as const, stack: 1000 },
        { name: "Alex T.", type: "ai" as const, stack: 1000 },
        { name: "Jordan L.", type: "ai" as const, stack: 1000 },
      ];
      
      const players = playerConfigs || defaultPlayers;
      const humanIndex = players.findIndex(p => p.type === "human");
      
      const result = await callMCPTool("create_table", {
        players,
        small_blind: 5,
        big_blind: 10,
      });
      
      updateGameFromMCP(result, humanIndex >= 0 ? humanIndex : 0);
      return result;
    } catch (error: any) {
      setGameState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  }, [updateGameFromMCP]);

  const dealHand = useCallback(async () => {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let tableId = gameState.tableId;
      
      if (!tableId) {
        const tableResult = await callMCPTool("create_table", {
          players: [
            { name: "You", type: "human", stack: 1000 },
            { name: "Sarah K.", type: "ai", stack: 1000 },
            { name: "Mike R.", type: "ai", stack: 1000 },
            { name: "Alex T.", type: "ai", stack: 1000 },
            { name: "Jordan L.", type: "ai", stack: 1000 },
          ],
          small_blind: 5,
          big_blind: 10,
        });
        
        if (!tableResult?.table_id) {
          throw new Error("Failed to create table");
        }
        
        tableId = tableResult.table_id;
        setGameState(prev => ({ ...prev, tableId }));
      }
      
      const result = await callMCPTool("deal_hand", {
        table_id: tableId,
      });
      
      updateGameFromMCP(result, gameState.humanSeat);
      
      if (result.actor_seat !== gameState.humanSeat) {
        await processAITurns(result);
      }
      
      return result;
    } catch (error: any) {
      setGameState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  }, [gameState.tableId, gameState.humanSeat, updateGameFromMCP, processAITurns]);

  const act = useCallback(async (action: "fold" | "check" | "call" | "raise", amount?: number) => {
    if (!gameState.tableId) return;
    
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const args: Record<string, any> = {
        table_id: gameState.tableId,
        seat: gameState.humanSeat,
        action,
      };
      
      if (action === "raise" && amount !== undefined) {
        args.amount = amount;
      }
      
      const result = await callMCPTool("act", args);
      updateGameFromMCP(result, gameState.humanSeat);
      
      if (result.status === "active" && result.actor_seat !== gameState.humanSeat) {
        await processAITurns(result);
      }
      
      return result;
    } catch (error: any) {
      setGameState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  }, [gameState.tableId, gameState.humanSeat, updateGameFromMCP, processAITurns]);

  const fold = useCallback(() => act("fold"), [act]);
  const check = useCallback(() => act("check"), [act]);
  const call = useCallback(() => act("call"), [act]);
  const raise = useCallback((amount: number) => act("raise", amount), [act]);

  const getState = useCallback(async () => {
    if (!gameState.tableId) return null;
    
    try {
      const result = await callMCPTool("get_state", {
        table_id: gameState.tableId,
        seat: gameState.humanSeat,
      });
      
      updateGameFromMCP(result, gameState.humanSeat);
      return result;
    } catch (error: any) {
      console.error("Get state error:", error);
      return null;
    }
  }, [gameState.tableId, gameState.humanSeat, updateGameFromMCP]);

  const canCheck = gameState.players.find(p => p.seat === gameState.humanSeat)?.bet === 
    Math.max(...gameState.players.map(p => p.bet));
  
  const callAmount = Math.max(...gameState.players.map(p => p.bet)) - 
    (gameState.players.find(p => p.seat === gameState.humanSeat)?.bet || 0);
  
  const isMyTurn = gameState.actorSeat === gameState.humanSeat && gameState.status === "active";
  const humanPlayer = gameState.players.find(p => p.seat === gameState.humanSeat);

  return {
    ...gameState,
    createTable,
    dealHand,
    fold,
    check,
    call,
    raise,
    getState,
    canCheck,
    callAmount,
    isMyTurn,
    humanPlayer,
  };
}
