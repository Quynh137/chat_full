
const usersRoute = require("../routes/usersRoute");
const authRoute = require("../routes/authRoute");
const chatsRoute = require("../routes/chatsRoute");
const messagesRoute = require("../routes/messagesRoute");
const conversationsRoute = require("../routes/conversationsRoute");
const friendsRoute = require("../routes/friendsRoute");
const roomsRoute = require("../routes/roomsRoute");
const roomMembersRoute = require("../routes/roomMembersRoute");

const routes = (app) => {
  // [ROUTE] /users
<<<<<<< HEAD
  app.use("/users", usersRoute);

  // [ROUTE] /chats
  app.use("/chats", chatsRoute);
=======
  app.use("/users",authenticateJWT, usersRoute);

  // [ROUTE] /chats
  app.use("/chats",authenticateJWT, chatsRoute);
>>>>>>> ad4e62adbe339590df7032be9c3bc91d913e8f1f

  // [ROUTE] /messages
  app.use("/messages", messagesRoute);

  // [ROUTE] /messages
  app.use("/conversations", conversationsRoute);

  // [ROUTE] /messages
  app.use("/friends", friendsRoute);

  // [ROUTE] /rooms
  app.use("/rooms", roomsRoute);

  // [ROUTE] /roommembers
  app.use("/roommembers", roomMembersRoute);

  // [ROUTE] /auth
  app.use("/auth", authRoute);
};

module.exports = routes;
