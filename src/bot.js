const { ADMIN_CHAT_ID } = require('./constants.js');
const { bot, forwardedMessagesA2U, userMessagesU2A, adminRepliesMessagesA2U, setUserMessagesU2A } = require('./common.js');
const { handleCommands } = require('./handleCommands.js');
const { handleReplies } = require('./handleReplies.js');
const { editMessageText, editMessageCaption } = require('./editMessage.js');

// Handle incoming messages from users
bot.on('message', async (msg) => {

  try {

    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const replyToMessage = msg.reply_to_message;

    // MESSAGES COMING FROM USER CHATS
    if (chatId != ADMIN_CHAT_ID) {
      // Forward the user's message to the admin
      bot.forwardMessage(ADMIN_CHAT_ID, chatId, messageId).then(adminMsg => {
        // Store the original user message ID and chat ID
        forwardedMessagesA2U.set(adminMsg.message_id, { chatId, messageId });
        setUserMessagesU2A(chatId, messageId, adminMsg.message_id);

        if (replyToMessage) {
          const replyToUserMessageId = replyToMessage.message_id;
          const replyToAdminMessageId = userMessagesU2A.get(chatId).get(replyToUserMessageId);

          bot.sendMessage(ADMIN_CHAT_ID, "The message responds to:", { reply_to_message_id: replyToAdminMessageId });
        }

      });

    } else { // MESSAGES COMING FROM THE ADMIN CHAT

      // If this returns true, that means the message was a command
      if (handleCommands(msg))
        return;

      // If this returns true, the message was handled successfully
      if (handleReplies(msg))
        return;

    }
  } catch (err) {
    console.log(err);
    bot.sendMessage(ADMIN_CHAT_ID, `Exception: ${err.message}`);
  };
});

bot.on('edited_message', async (msg) => {

  const msgId = msg.message_id;
  const replyToMessage = msg.reply_to_message;

  console.log(msg);

  // If this is not a message that replies to another message
  if (!replyToMessage)
    return;

  // If this is not a message we've sent to some user
  if (!adminRepliesMessagesA2U.has(msgId))
    return;

  if (msg.text)
    editMessageText(msg);

  return;
})

bot.on('edited_message_caption', async (msg) => {

  const msgId = msg.message_id;
  const replyToMessage = msg.reply_to_message;

  console.log(msg);

  // If this is not a message that replies to another message
  if (!replyToMessage)
    return;

  // If this is not a message we've sent to some user
  if (!adminRepliesMessageMapA2U.has(msgId))
    return;

  if (msg.caption)
    editMessageCaption(msg);

  return;
})