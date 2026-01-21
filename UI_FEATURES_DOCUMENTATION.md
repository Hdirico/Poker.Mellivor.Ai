# Mellipoker.AI - Frontend UI Features Documentation

## Design Philosophy
**Offsuit-Inspired Minimalism**: A clean, tech-forward aesthetic resembling premium productivity apps (Linear, Notion, Arc browser). Avoids all casino elements and uses a software-first approach.

---

## Typography
- **UI Text**: Inter font family
- **Numbers & Statistics**: JetBrains Mono font family (for chip counts, pot amounts, bets, blinds)

---

## Color Palette & Theme

### Light Mode
- **Borders**: Black borders for visual definition
- **Background**: Clean, light background
- **Card Styling**: Minimalist flat design

### Dark Mode
- **Background**: Sophisticated dark slate palette
- **Borders**: Subtle borders maintaining visibility
- **Card Styling**: Dark-themed flat design

### Theme Toggle
- Light/dark mode switcher in header
- Persistent theme state across application

---

## Layout Structure

### Header Component
- **Table Name**: "Main Table #1" (left side)
- **Blinds Display**: "50/100" format (center-left)
- **Deal Button**: Triggers new hand dealing (center)
- **Theme Toggle**: Light/dark mode switcher (right)

### Main Table Area
- **Aspect Ratio**: 16:10 for optimal poker table viewing
- **Max Width**: 4xl (responsive)
- **Center-aligned**: Poker table centered in viewport

### Footer Action Bar
- Fixed at bottom of screen
- Contains all player action buttons
- Displays current bet information

---

## Player Seating

### 5-Player Configuration
Positions (clockwise from top):
1. **top-left**
2. **top-right**
3. **right**
4. **bottom** (Human player - "You")
5. **left**

### Player Card Layout
Each player seat displays:
- **Player Name**: Displayed above/below cards
- **Chip Count**: JetBrains Mono font
- **Cards**: 2 hole cards
  - Human player cards: Always visible (face-up)
  - Other players: Face-down by default
- **Current Bet**: Shows chips wagered in current round
- **Position Badges**: Dealer (D), Small Blind (SB), Big Blind (BB)

### Position Badges
- **Dealer (D)**: Small circular badge, rotates clockwise each hand
- **Small Blind (SB)**: Sky blue badge, positioned clockwise from dealer
- **Big Blind (BB)**: Amber/orange badge, positioned 2 seats clockwise from dealer

**Rotation Logic**: When "Deal" button is clicked, all badges rotate clockwise to next player

---

## Playing Cards

### Card Design
- **Style**: Flat, minimalist design (no gradients or shadows)
- **Suits**: Spade (♠), Heart (♥), Diamond (♦), Club (♣)
- **Ranks**: A, 2-10, J, Q, K
- **Back Design**: Simple, clean card back for face-down cards

### Card Animation
- **Deal Animation**: Sequential dealing with 360° spin
  - Cards dealt one at a time
  - Clockwise direction starting from current dealer position
  - Each card performs full rotation during deal
  - Origin point: Current dealer's seat (rotates with dealer badge)
- **Smooth Transitions**: CSS animations for fluid motion

---

## Community Cards

### Layout
- **Position**: Center of poker table
- **Count**: Up to 5 cards (Flop: 3, Turn: 1, River: 1)
- **Spacing**: Even spacing between cards
- **Design**: Same minimalist style as player cards

### Dealing Sequence
- Flop: 3 cards revealed simultaneously
- Turn: Single card
- River: Single card

---

## Pot Display

### Visual Elements
- **Location**: Center of table, above community cards
- **Format**: "POT" label + amount
- **Font**: JetBrains Mono for chip amount
- **Style**: Clean, minimal container

---

## Action Bar (Bottom)

### Betting Interface

#### Cumulative Bet Buttons
- **+25**: Adds $25 to current raise amount
- **+50**: Adds $50 to current raise amount
- **+100**: Adds $100 to current raise amount
- **+500**: Adds $500 to current raise amount

**Behavior**: Each click increments total raise amount cumulatively

#### Custom Bet Input
- Text input field for manual bet entry
- Validates against min/max betting limits
- Integrates with cumulative bet total

#### Undo Button
- Removes last bet increment from history
- Tracks bet history in stack
- Allows stepping back through bet adjustments

### Primary Action Buttons

#### Fold Button
- **Color**: Solid red background
- **Purpose**: Clear visual distinction as destructive action
- **Position**: Leftmost in action bar
- **State**: Always enabled during player's turn

#### Check Button
- **Purpose**: Pass action with no bet
- **State**: Only enabled when previous player checks
- **Style**: Secondary button style

#### Call Button
- **Purpose**: Match current bet
- **Display**: Shows call amount dynamically
- **State**: Enabled when there's a bet to match

#### Raise Button
- **Purpose**: Increase current bet
- **Display**: "Raise $XXX" with dynamic amount
- **State**: Shows cumulative total from bet buttons
- **Behavior**: Commits current raise amount

---

## Interactive States

### Visual Feedback
- **Hover States**: All buttons have hover effects
- **Active Player**: Highlighted border/glow on current player
- **Folded Players**: Dimmed/grayed out appearance
- **Disabled States**: Reduced opacity for unavailable actions

### Button States
- **Enabled**: Full color, interactive
- **Disabled**: Reduced opacity, non-interactive
- **Loading**: Potential spinner for async operations

---

## Data Attributes (Test IDs)

All interactive elements include `data-testid` attributes for testing:

### Pattern Examples
- Buttons: `button-{action}` (e.g., `button-fold`, `button-check`)
- Inputs: `input-{purpose}` (e.g., `input-custom-bet`)
- Player Elements: `player-{position}` (e.g., `player-bottom`)
- Cards: `card-{suit}-{rank}` (e.g., `card-spade-A`)

---

## Animations & Transitions

### Card Dealing
- **Type**: Sequential animation
- **Origin**: Current dealer position
- **Path**: Clockwise to each player
- **Effect**: 360° rotation during flight
- **Speed**: Smooth, natural timing

### UI Transitions
- **Theme Switch**: Smooth color transitions
- **Button Hovers**: Quick, responsive feedback
- **Badge Rotation**: Instant update on deal

---

## Responsive Behavior

### Desktop (Primary)
- Full table view with optimal spacing
- All elements clearly visible
- Comfortable interaction targets

### Tablet/Mobile Considerations
- Maintains aspect ratio
- Scales appropriately
- Touch-friendly button sizes

---

## Key Technical Features

### State Management
- Player chip counts
- Current pot size
- Active player tracking
- Dealer/blind position rotation
- Bet history stack (for undo)
- Theme preference

### User Interactions
- Theme toggling
- Deal new hand
- Bet increment/decrement
- Action execution (fold/check/call/raise)
- Custom bet input

---

## Browser Tab
- **Title**: "Mellipoker.Ai"

---

## Summary

This UI surfaces a complete poker game interface with:
- Clean, minimal design avoiding casino aesthetics
- Sophisticated typography hierarchy (Inter + JetBrains Mono)
- Comprehensive betting interface with cumulative buttons
- Dynamic position badge rotation
- Sequential card dealing animations from dealer position
- Light/dark theme support with distinct visual treatments
- Fully interactive action bar with contextual button states
- Professional, software-first visual language

The interface prioritizes clarity, ease of use, and modern design patterns over traditional casino-style aesthetics.
