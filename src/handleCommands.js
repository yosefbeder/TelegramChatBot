const { ADMIN_CHAT_ID, COMMANDS_MESSAGE, USER_COMMANDS_MESSAGE, USER_WELCOMING_MESSAGE } = require('./constants.js');
const { bot, forwardedMessagesA2U, adminRepliesMessagesA2U, userMessagesU2A, getFullNameFromUser, getUserNameFromUser, banChat, unbanChat } = require('./common.js');
const { isUserPrivate, bannedChats, isChatBanned, doNotSignMessagesOfUser, signMessagesOfUser, hideRepliedToMessages, showRepliedToMessages, disableForwardMode, enableForwardMode, disablePrivateMode, enablePrivateMode } = require('./settings.js');

exports.handleAdminChatCommands = function handleCommands(msg) {
  const msgText = msg.text || '';

  if (!msgText)
    return false;

  if (msgText[0] != '/')
    return false;

  if (msgText == '/log') {
    const forwardedMessages = JSON.stringify(Object.fromEntries(forwardedMessagesA2U));
    const adminReplies = JSON.stringify(Object.fromEntries(adminRepliesMessagesA2U));
    const userMessages = JSON.stringify(Object.fromEntries(userMessagesU2A));
    console.log(forwardedMessagesA2U);
    console.log(adminRepliesMessagesA2U)
    console.log(userMessagesU2A)
    bot.sendMessage(ADMIN_CHAT_ID, `Forwarded messages from the bot (admin chat to user chat): \n${forwardedMessages}\nAdmin replies to users (admin chat to user chat):\n${adminReplies}\nMessages in user-bot private chat:${userMessages}`);
    return true;
  }
  else if (msgText == '/commands') {
    bot.sendMessage(ADMIN_CHAT_ID, COMMANDS_MESSAGE);
  }
  else if (msgText.startsWith('/sign ')) {
    const regexMatch = /\/sign (on|off)/.exec(msgText);

    if (!regexMatch) {
      bot.sendMessage(ADMIN_CHAT_ID, 'Incorrect format of command. The correct format is: /sign on|off.');
      return true;
    }

    const res = regexMatch.at(1);

    if (res == 'off') {
      doNotSignMessagesOfUser(msg.from);
      bot.sendMessage(ADMIN_CHAT_ID, `Messages sent by ${getFullNameFromUser(msg.from)} (${getUserNameFromUser(msg.from)}) will NOT be signed.`);
    } else {
      signMessagesOfUser(msg.from);
      bot.sendMessage(ADMIN_CHAT_ID, `Messages sent by ${getFullNameFromUser(msg.from)} (${getUserNameFromUser(msg.from)}) will be signed.`);
    }

  } else if (msgText.startsWith('/replies ')) {
    const regexMatch = /\/replies (on|off)/.exec(msgText);

    if (!regexMatch) {
      bot.sendMessage(ADMIN_CHAT_ID, 'Incorrect format of command. The correct format is: /replies on|off.');
      return true;
    }

    if (res == 'off') {
      hideRepliedToMessages();
      bot.sendMessage(ADMIN_CHAT_ID, "The message that was replied to by the user will NOT be quoted in the response.");
    } else {
      showRepliedToMessages();
      bot.sendMessage(ADMIN_CHAT_ID, "The message that was replied to by the user will be quoted in the response.");
    }

  } else if (msgText.startsWith('/forwarding ')) {
    const regexMatch = /\/forwarding (on|off)/.exec(msgText);

    if (!regexMatch) {
      bot.sendMessage(ADMIN_CHAT_ID, 'Incorrect format of command. The correct format is: /forwarding on|off.');
      return true;
    }

    const res = regexMatch.at(1);

    if (res == 'off') {
      disableForwardMode();
      bot.sendMessage(ADMIN_CHAT_ID, "User messages sent to the bot will NOT be forwarded. Instead, they will be sent.");
    } else {
      enableForwardMode();
      bot.sendMessage(ADMIN_CHAT_ID, "User messages sent to the bot will be simply forwarded.");
    }

  } else if (msgText == '/bannedUsers') {
    const bannedChatIds = bannedChats();

    if (bannedChatIds.size == 0) {
      bot.sendMessage(ADMIN_CHAT_ID, "There are no banned users.");
      return true;
    }

    bot.sendMessage(ADMIN_CHAT_ID, "Banned users are:");
    for (const chatId of bannedChatIds) {
      bot.getChatMember(chatId, chatId)
        .then(member => {
          const user = member.user;

          if (privateMode(user)) {
            bot.sendMessage(ADMIN_CHAT_ID, `${user.id} [User is in private mode]`);
            return;
          }

          const username = getUserNameFromUser(user);
          const fullName = getFullNameFromUser(user);
          const msg = `${fullName} (${username}:${chatId})`;

          bot.sendMessage(ADMIN_CHAT_ID, msg,
            { entities: [{ type: "mention", offset: msg.indexOf(username), length: username.length }] }
          );
        });
    }

  } else if (msgText.startsWith('/ban ')) {
    const regexMatch = /\/ban (\d{8,})/.exec(msgText);

    if (!regexMatch) {
      bot.sendMessage(ADMIN_CHAT_ID, 'Incorrect format of command. The correct format is: /ban <userId>. User Id must be at least 8 digits long.');
      return true;
    }

    const chatId = +regexMatch.at(1);
    banChat(chatId);

  } else if (msgText.startsWith('/unban ')) {
    const regexMatch = /\/unban (\d{8,})/.exec(msgText);

    if (!regexMatch) {
      bot.sendMessage(ADMIN_CHAT_ID, 'Incorrect format of command. The correct format is: /unban@<userId>. User Id must be at least 8 digits long.');
      return true;
    }

    const chatId = +regexMatch.at(1);
    unbanChat(chatId);

  }
  else {
    bot.sendMessage(ADMIN_CHAT_ID, "Unknown command.");
    bot.sendMessage(ADMIN_CHAT_ID, COMMANDS_MESSAGE);
  }

  return true;
}

const mapForwardedMessageToUserChatID = function (msg) {

  const userChatDetail = forwardedMessagesA2U.get(msg.message_id);

  if (!userChatDetail) {
    bot.sendMessage(ADMIN_CHAT_ID, 'Message not present in bot data structures.', { reply_to_message_id: msg.message_id });
    return false;
  }

  return userChatDetail;
}

exports.handleAdminChatReplyCommands = function (msg) { // msg must be a reply to another message

  const userCommands = ["delete", "عومر", "ban", "عومر2", "إلغاء عومر2", "unban", "info", "معلومات"];

  if (!msg.text)
    return false;

  const text = msg.text.toLowerCase();

  if (!userCommands.includes(text))
    return false;

  const replyToMessage = msg.reply_to_message;
  const replyToMessageId = replyToMessage.message_id;

  if (text == "delete" || text == "عومر") {

    if (adminRepliesMessagesA2U.size == 0)
      return false;

    const replyDetails = adminRepliesMessagesA2U.get(replyToMessageId);

    if (!replyDetails) {
      bot.sendMessage(ADMIN_CHAT_ID, 'Message not present in bot data structures.', { reply_to_message_id: replyToMessageId });
      return false;
    }

    const { chatId, messageId } = replyDetails;

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(ADMIN_CHAT_ID, 'Deleted message.', { reply_to_message_id: replyToMessageId });

  }
  else if (text == "ban" || text == "عومر2") {

    const { chatId: userChatId } = mapForwardedMessageToUserChatID(replyToMessage);
    banChat(userChatId);

  }
  else if (text == "unban" || text == "إلغاء عومر2") {

    const { chatId: userChatId } = mapForwardedMessageToUserChatID(replyToMessage);
    unbanChat(userChatId);

  }
  else if (text == "info" || text == "معلومات") {

    const { chatId: userChatId } = mapForwardedMessageToUserChatID(replyToMessage);

    let username;
    let fullName;
    let id;

    bot.getChatMember(userChatId, userChatId)
      .then(function (member) {
        const user = member.user;
        const isInPrivateMode = isUserPrivate(user);
        id = user.id;

        if (isInPrivateMode) {
          const userInfo = `
          ✳️ User Information: [User is in private mode]
          🪪 User ID: ${id}
          ⛔ Status: ${isChatBanned(id) ? 'Banned' : 'Not banned'}
          `.trim();

          bot.sendMessage(ADMIN_CHAT_ID, userInfo);
          return undefined;
        }

        username = getUserNameFromUser(user);
        fullName = getFullNameFromUser(user);

        return bot.getUserProfilePhotos(userChatId)
      })
      .then(photos => {

        if (!photos) // This means that we're in private mode
          return;

        const userInfo = `
        ✳️ User Information:
        👤 Full Name: ${fullName}
        👤 Username: ${username}
        🪪 User ID: ${id}
        ⛔ Status: ${isChatBanned(id) ? 'Banned' : 'Not banned'}
        `.trim();

        if (photos.total_count == 0) {
          const options = {
            reply_to_message_id: msg.message_id,
            entities: [{ type: "mention", offset: userInfo.indexOf(username), length: username.length }]
          }

          bot.sendMessage(ADMIN_CHAT_ID, userInfo, options)
          return;
        }

        console.log(photos);
        const photo = photos.photos.at(0).at(0);


        bot.sendPhoto(ADMIN_CHAT_ID, photo.file_id, {
          reply_to_message_id: msg.message_id,
          caption: userInfo,
          caption_entities: [{ type: "mention", offset: userInfo.indexOf(username), length: username.length }]
        });
      });

  }

  return true;
}

exports.handleUserChatCommands = function (msg) {

  const msgText = msg.text || '';
  const userChatId = msg.chat.id;

  if (!msgText)
    return false;

  if (msgText[0] != '/')
    return false;

  if (msgText == '/commands') {
    bot.sendMessage(userChatId, USER_COMMANDS_MESSAGE);
  }
  else if (msgText == '/start') {
    if (userMessagesU2A.has(msg.message_id)) // If the user has already /start ed the chat
      bot.sendMessage(userChatId, "Your chat has already started. Send whatever message you want and we will hopefully respond ASAP.");
    else
      bot.sendMessage(userChatId, USER_WELCOMING_MESSAGE);

    return true;
  }
  else if (msgText.startsWith('/private ')) {
    const regexMatch = /\/private (on|off)/.exec(msgText);

    if (!regexMatch) {
      bot.sendMessage(ADMIN_CHAT_ID, 'Incorrect format of command. The correct format is: /private on|off.');
      return true;
    }

    const res = regexMatch.at(1);

    if (res == 'off') {
      disablePrivateMode(msg.from)
      bot.sendMessage(userChatId, "You left private mode.");
    } else {
      enablePrivateMode(msg.from)
      bot.sendMessage(userChatId, "You entered private mode.");
    }

  }
  else {
    bot.sendMessage(userChatId, "Unknown command.");
    bot.sendMessage(userChatId, COMMANDS_MESSAGE);
  }

  return true;
}