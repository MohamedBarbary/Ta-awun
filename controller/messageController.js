const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const { io, getReceiverSocketId } = require('../socket/socket');

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.model._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'message photoLink _id')
      .populate('receiverId', 'message photoLink _id');

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log('Error in sendMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const senderId = req.model._id;

//     const conversation = await Conversation.findOne({
//       participants: { $all: [senderId, userToChatId] },
//     }).populate({
//       path: 'messages',
//       populate: [
//         { path: 'senderId', select: 'message photoLink _id' },
//         { path: 'receiverId', select: 'message photoLink _id' },
//       ],
//     });

//     if (!conversation) return res.status(200).json([]);

//     const messages = conversation.messages;

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log('Error in getMessages controller: ', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

const getAllConversations = async (req, res) => {
  try {
    const userId = req.model._id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: 'messages',
      options: { sort: { createdAt: -1 } },
      populate: [
        { path: 'senderId', select: 'message photoLink _id' },
        { path: 'receiverId', select: 'message photoLink _id' },
      ],
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.log('Error in getAllConversations controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendMessage,
  // getMessages,
  getAllConversations,
};
