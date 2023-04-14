const User = require("../models/userModel");
const FriendInvitation = require("../models/friendInvitationModel");

const AppError = require("../utils/appError");
const updateFriend = require("../socketHandlers/updates/updateFriend");
const Conversation = require("../models/conversationsModel");
const chatUpdate = require("../socketHandlers/updates/updateChatRoom");

exports.postInvite = async (req, res, next) => {
  const { targetMailAddress } = req.body;

  // Lấy từ thằng auth chuyền xuống
  const { id, email } = req.user;

  // 1. Ko đc mời chính bản thân mình
  if (email.toLowerCase() === targetMailAddress.toLowerCase()) {
    return next(
      new AppError("Sorry. You cannot become friend with yourself", 409)
    );
  }

  // 2. Ktra xem email của ng bạn mời có tồn tại ko
  const targetUser = await User.findOne({
    email: targetMailAddress,
  });

  if (!targetUser) {
    return next(
      new AppError(
        `${targetMailAddress} has not been found. Please check email address again.`,
        404
      )
    );
  }

  // 4. Ktra xem if invitation has been already sent
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: id,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceived) {
    return next(new AppError("Invitation has been already sent.", 409));
  }

  // 5. Kiểm tra xem người dc gửi đã là bạn của mình chưa
  const usersAlreadyFriends = targetUser.friends.find((friendId) => {
    friendId.toString() === id.toString();
  });

  if (usersAlreadyFriends) {
    return next(
      new AppError("Friend already added. Please check friends list.", 409)
    );
  }
  // 6. Create new invitation in DB
  const newInvitation = await FriendInvitation.create({
    senderId: id,
    receiverId: targetUser._id,
  });

  // 5. (Nếu Lời mời dc tạo thành công thì ta phải update danh sách Invitation của
  // ng dùng dc gửi lời mời để họ chấp nhận vào phòng)

  updateFriend.updateFriendPendingInvitations(targetUser._id.toString());

  return res.status(201).send({
    status: "success",
    data: newInvitation,
    message: "Invitation has been sent",
  });
};

exports.postAccept = async (req, res) => {
  try {
    // 1. Id cua invitation
    const { id } = req.body;

    const invitation = await FriendInvitation.findById(id);

    // 1. Ktra xem có invitation trong memberInviation trong mongo k
    if (!invitation) {
      return res.status(401).send({
        status: "error",
        message: "Error occured. Please try again",
      });
    }

    const { senderId, receiverId } = invitation;

    // 2. Cập nhật danh sách bạn bè của ng gửi
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    console.log("senderUser", senderUser);
    // 3. Câp nhật danh sách bạn bẻ của ng nhận
    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];
    console.log("receiverUser", receiverUser);

    // 5. Xóa invitation khỏi Collection FriendInvitation
    await FriendInvitation.findByIdAndDelete(id);

    // 6. Update list friends nếu ng dùng đang onl
    updateFriend.updateFriends(senderId.toString());
    updateFriend.updateFriends(receiverId.toString());

    // 7. Update lại friend pending invitations
    updateFriend.updateFriendPendingInvitations(receiverId.toString());

    // 8. Tạo 1 room chat giữa 2 ng dùng này
    const newConversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    // 9. Cập nhật danh sách rooms của người dùng
    senderUser.rooms = [...senderUser.rooms, newConversation._id];
    receiverUser.rooms = [...receiverUser.rooms, newConversation._id];
    // 4. Lưu vào CSDL
    senderUser.save({ validateBeforeSave: false });
    receiverUser.save({ validateBeforeSave: false });

    // 9. Update room chat list của ng dùng

    chatUpdate.updateChatRoom(senderId.toString());
    chatUpdate.updateChatRoom(receiverId.toString());

    return res.status(201).send({
      status: "success",
      message: "Accept friend successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
};

exports.postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { id: userId } = req.user;

    // 1. Xóa invitation khỏi friendInviation trong mongo
    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // 2. Update lại danh sách Invitation của ng dùng userId
    updateFriend.updateFriendPendingInvitations(userId);
    return res.status(200).send({
      status: "success",
      message: "Friend request succesfully rejected",
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
};
