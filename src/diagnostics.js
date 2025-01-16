import { UserInfo } from "./common.js";
import { bot, BotInfo, TextMessages } from './constants.js'
import { admins, settings, users } from "./settings.js";

export const DiagnosticMessage = Object.freeze({
  DELETED_MESSAGE: 0,
  EDITED_MESSAGE_TEXT: 1,
  EDITED_MESSAGE_CAPTION: 2,
  INCORRECT_FORMAT_OF_COMMAND: 3,
  NO_BANNED_USERS_EXIST: 4,
  DISPLAYING_BANNED_USERS_NOW: 5,
  USER_BANNING_MESSAGE: 6,
  ADMIN_BANNING_MESSAGE: 7,
  USER_NO_LONGER_BANNED_MESSAGE: 8,
  ADMIN_USER_NO_LONGER_BANNED_MESSAGE: 9,
  USER_IS_ALREADY_BANNED: 10,
  USER_IS_ALREADY_NOT_BANNED: 11,
  MESSAGE_NOT_PRESENT_BOT_DATA_STRUCTURES: 12,
  USER_INFO_MESSAGE: 13,
  BOT_LANGUAGE_CHANGE_MESSAGE: 14,
  BOT_LANGUAGE_MESSAGE: 15,
  ADMIN_COMMANDS_MESSAGE: 16,
  USER_COMMANDS_MESSAGE: 17,
  UNKNOWN_COMMAND: 18,
  USER_MESSAGES_WILL_BE_SIGNED_MESSAGE: 19,
  USER_MESSAGES_WILL_NOT_BE_SIGNED_MESSAGE: 20,
  SHOW_REPLIED_TO_MESSAGES_MESSAGE: 21,
  HIDE_REPLIED_TO_MESSAGES_MESSAGE: 22,
  FORWARDING_IS_ON_MESSAGE: 23,
  FORWARDING_IS_OFF_MESSAGE: 24,
  USER_WELCOMING_MESSAGE: 25,
  USER_CHAT_HAS_ALREADY_STARTED: 26,
  BOT_FORWARDING_SETTING_MESSAGE: 27,
  BOT_REPLIES_SETTING_MESSAGE: 28,
  ADMIN_SIGN_STATE_MESSAGE: 29,
  USER_PRIVATE_MODE_CHANGED_MESSAGE: 30,
  USER_PRIVATE_STATE_MESSAGE: 31
})
export const sendDiagnosticMessage = async function (messageType, chatId, opts = {}) {

  const botSenderMsg = `>${BotInfo.BOT_NAME}`;
  const options = {
    parse_mode: "MarkdownV2",
    ...opts
  }

  const user = opts.user;
  let username = '';
  let userFullName = '';
  let userId = 0;

  if (user) {
    username = UserInfo.getUserNameFromUser(user);
    userFullName = UserInfo.getFullNameFromUser(user);
    userId = user.id;
  }

  switch (messageType) {
    case DiagnosticMessage.DELETED_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `تم مسح الرسالة\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Deleted message\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.EDITED_MESSAGE_TEXT:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `تم تعديل نص الرسالة\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Edited message text\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.EDITED_MESSAGE_CAPTION:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `تم تعديل تعليق الرسالة\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Edited message caption\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.INCORRECT_FORMAT_OF_COMMAND:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `تركيب الأمر خاطئ\\. التركيب الصحيح هو:\n${opts.correct_format}\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Incorrect format of command\\. The correct format is: ${opts.correct_format}\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.NO_BANNED_USERS_EXIST:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `لا يوجد مستخدمون محظورون\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `No banned users exist\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.DISPLAYING_BANNED_USERS_NOW:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `المستخدمون المحظورون:\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Banned users are:\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_BANNING_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `لقد تعطل البوت مؤقتًا\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `You've been banned from the bot\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.ADMIN_BANNING_MESSAGE:
      if (settings.language() == "ar")
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `لقد تم حظر المستخدم الذي يحمل المعرف \\(${userId}\\) من البوت\\.\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `لقد تم حظر المستخدم ${userFullName} \\(${username}:${userId}\\) من البوت\\.\n${botSenderMsg}`, options);
      else
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `The user with ID ${userId} has been banned from the bot\\.\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `The user ${userFullName} \\(${username}:${userId}\\) has been banned from the bot\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_NO_LONGER_BANNED_MESSAGE:
      if (settings.language() == "ar")
        // bot.sendMessage(chatId, `أنت لم تعد محظورا من البوت\\.\n${botSenderMsg}`, options);
        break;
      else
        bot.sendMessage(chatId, `You're no longer banned from the bot\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.ADMIN_USER_NO_LONGER_BANNED_MESSAGE:
      if (settings.language() == "ar")
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `لقد تمت إزالة المستخدم الذي يحمل المعرف \\(${userId}\\) قائمة الحظر\\.\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `لقد تمت إزالة المستخدم ${userFullName} \\(${username}:${userId}\\) من قائمة الحظر\\.\n${botSenderMsg}`, options);
      else
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `The user with ID ${userId} has been removed from the banned list\\.\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `The user ${userFullName} \\(${username}:${userId}\\) has been removed from the banned list\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_IS_ALREADY_BANNED:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `المسختدم محظورٌ بالفعل\\. لإزالة الحظر, استخدم الأمر:\n/unban ${userId}\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `The user is already banned\\. To remove the ban, type\n/unban ${userId}\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_IS_ALREADY_NOT_BANNED:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `المسختدم ليس محظورًا بالفعل\\. لحظر المستخدم, استخدم الأمر:\n/ban ${userId}\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `The user is already not banned\\. To ban them, type\n/ban ${userId}\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.MESSAGE_NOT_PRESENT_BOT_DATA_STRUCTURES:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `الرسالة ليست موجودة في قاعدة بيانات البوت\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Message is not present in bot data structures\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_INFO_MESSAGE:
    case DiagnosticMessage.BOT_LANGUAGE_CHANGE_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `تم ضبط لغة البوت إلي العربية\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `The language of the bot has been set to English\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.BOT_LANGUAGE_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `لغة البوت هي العربية\\. لتغيير اللغة, استخدم الأمر\n/language ar\\|en\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `The language of the bot is English\\. To change language, use the command /language ar\\|en\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.ADMIN_COMMANDS_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `${TextMessages.ADMIN_COMMANDS_MESSAGE_AR}\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `${TextMessages.ADMIN_COMMANDS_MESSAGE_EN}\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_COMMANDS_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `${TextMessages.USER_COMMANDS_MESSAGE_AR}\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `${TextMessages.USER_COMMANDS_MESSAGE_EN}\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.UNKNOWN_COMMAND:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `أمر غير معروف\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Unknown command\\.\n${botSenderMsg}`, options);
      if (chatId == BotInfo.ADMIN_CHAT_ID)
        sendDiagnosticMessage(DiagnosticMessage.ADMIN_COMMANDS_MESSAGE, chatId);
      else
        sendDiagnosticMessage(DiagnosticMessage.USER_COMMANDS_MESSAGE, chatId);
      break;
    case DiagnosticMessage.USER_MESSAGES_WILL_BE_SIGNED_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `الرسائل المرسلة من قبل ${userFullName} \\([${username}](tg://user?id=${userId})\\) ستكون موقعة\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Messages sent by ${userFullName} \\([${username}](tg://user?id=${userId})\\) will be signed\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_MESSAGES_WILL_NOT_BE_SIGNED_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `الرسائل المرسلة من قبل ${userFullName} \\([${username}](tg://user?id=${userId})\\) لن تكون موقعة\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `Messages sent by ${userFullName} \\([${username}](tg://user?id=${userId})\\) will not be signed\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.SHOW_REPLIED_TO_MESSAGES_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `سيتمكن المستخدم من رؤية أي رسالة من الرسائل التي أرسلها تم الرد عليها\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `The user will be able to see which message admins have replied to\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.HIDE_REPLIED_TO_MESSAGES_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `لن يتمكن المستخدم من رؤية أي رسالة من الرسائل التي أرسلها تم الرد عليها\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `The user will not be able to see which message admins have replied to\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.FORWARDING_IS_ON_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `الرسائل التي يرسلها المستخدم سيتم تحوليها بدلًا من إرسالها\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `User messages sent to the bot will be forwarded instead of being sent\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.FORWARDING_IS_OFF_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `الرسائل التي يرسلها المستخدم لن يتم تحويلها\\. بدلًا من ذلك, سيتم إرسالها\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `User messages sent to the bot will NOT be forwarded. Instead, they will be sent\\.\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_WELCOMING_MESSAGE:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `${TextMessages.USER_WELCOMING_MESSAGE_AR}\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `${TextMessages.USER_WELCOMING_MESSAGE_EN}\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_CHAT_HAS_ALREADY_STARTED:
      if (settings.language() == "ar")
        bot.sendMessage(chatId, `محادثتك قد بدأت بالفعل\\. أرسل أي رسالة تريدها و سنحاول أن نرد عليها باسرع وقت\\.\n${botSenderMsg}`, options);
      else
        bot.sendMessage(chatId, `"Your chat has already started\\. Send whatever message you want and we will hopefully respond ASAP\\."\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.BOT_FORWARDING_SETTING_MESSAGE:
      if (settings.language() == 'ar')
        if (settings.forwardMode())
          bot.sendMessage(chatId, `رسائل المستخدمين يتم توجيهها بدلًا من إرسالها\\. لتغيير هذا الإعداد, استخدم الأمر:\n/forwarding on\\|off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `رسائل المستخدمين يتم إرسالها بدلًا من توجيهها\\. لتغيير هذا الإعداد, استخدم الأمر:\n/forwarding on\\|off\n${botSenderMsg}`, options);
      else
        if (settings.forwardMode())
          bot.sendMessage(chatId, `User messages are being forwarded instead of being sent\\.\nTo change this setting, use the command /forwarding on\\|off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `User messages are being sent instead of being forwarded\\.\nTo change this setting, use the command /forwarding on\\|off\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.BOT_REPLIES_SETTING_MESSAGE:
      if (settings.language() == 'ar')
        if (settings.replies())
          bot.sendMessage(chatId, `يتسطيع المستخدم أن يري أية رسالة بالضبط رد عليها المشرف\\. لتغيير هذا الإعداد, استخدم الأمر:\n/replies on\\|off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `لا يتسطيع المستخدم أن يري أية رسالة بالضبط رد عليها المشرف\\. لتغيير هذا الإعداد, استخدم الأمر:\n/replies on\\|off\n${botSenderMsg}`, options);
      else
        if (settings.replies())
          bot.sendMessage(chatId, `The user can see which message admins have replied to\\.\nTo change this setting, use the command /replies on\\|off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `The user cannot see which message admins have replied to\\.\nTo change this setting, use the command /replies on\\|off\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.ADMIN_SIGN_STATE_MESSAGE:
      if (settings.language() == 'ar')
        if (await admins.adminSigns(user))
          bot.sendMessage(chatId, `رسائل المشرف ${userFullName} \\(${username}\\) موقعة\\. لإلغاء توقيع الرسائل, استخدم الأمر:\n/sign off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `رسائل المشرف ${userFullName} \\(${username}\\) غير موقعة\\. لتفعيل توقيع الرسائل, استخدم الأمر:\n/sign on\n${botSenderMsg}`, options);
      else
        if (await admins.adminSigns(user))
          bot.sendMessage(chatId, `The messages of admin ${userFullName} \\(${username}\\) are signed\\.\nTo make them not signed, use the command /sign off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `The messages of admin ${userFullName} \\(${username}\\) are not signed\\.\nTo make them signed, use the command /sign on\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_PRIVATE_MODE_CHANGED_MESSAGE:
      if (settings.language() == 'ar')
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `تم تفعيل الوضع الخاص\\. لن يظهر اسمك و لا معلوماتك للمشرفين\\. لإلغاء تفعيل هذا الوضع, استخدم الأمر:\n/private off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `تم إلغاء تفعيل الوضع الخاص\\. اسمك يظهر للمشرفين\\. لإعادة تفعيل هذا الوضع, استخدم الأمر:\n/private on\n${botSenderMsg}`, options);
      else
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `Private mode is on\\. Your name and information will not appear to admins\\.\nTo disable this mode, use the command /private off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `Private mode is off\\. Your name and information will appear to admins\\.\nTo enable this mode, use the command /private on\n${botSenderMsg}`, options);
      break;
    case DiagnosticMessage.USER_PRIVATE_STATE_MESSAGE:
      if (settings.language() == 'ar')
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `إنت في الوضع الخاص\\. لن يظهر اسمك و لا معلوماتك للمشرفين\\. لإلغاء تفعيل هذا الوضع, استخدم الأمر:\n/private off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `أنت لست في الوضع الخاص\\. اسمك يظهر للمشرفين\\. لتفعيل هذا الوضع, استخدم الأمر:\n/private on\n${botSenderMsg}`, options);
      else
        if (await users.isUserPrivate(user))
          bot.sendMessage(chatId, `You are in private mode\\. Your name and information will not appear to admins\\.\nTo disable this mode, use the command /private off\n${botSenderMsg}`, options);
        else
          bot.sendMessage(chatId, `You are not in private mode\\. Your name and information will appear to admins\\.\nTo enable this mode, use the command /private on\n${botSenderMsg}`, options);
      break;

  }

}