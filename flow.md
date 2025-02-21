1. Bot is speaking:

[SYSTEM]: Bot started speaking
(Bot talks about product feature)

2. Bot stops speaking:

[SYSTEM]: Bot stopped speaking
[SYSTEM]: Response timeout initiated. 🕐

3. Two possible paths:

Path A - User responds:
[USER]: "That's interesting, can you tell me more?"
(Timeout is cleared, normal conversation continues)

Path B - No response:
[SYSTEM]: Response timeout reached
[SYSTEM]: No response received within timeout, continuing demo...
(Bot automatically continues with next part of demo)

The key timing is:

- Bot stops → 2.5 second timer starts
- If no one speaks within 2.5s → Bot continues demo
- If anyone speaks within 2.5s → Timer resets
