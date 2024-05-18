
const usersRoute = require("../routes/usersRoute");
const authRoute = require("../routes/authRoute");
const chatsRoute = require("../routes/chatsRoute");
const messagesRoute = require("../routes/messagesRoute");
const conversationsRoute = require("../routes/conversationsRoute");
const friendsRoute = require("../routes/friendsRoute");
const roomsRoute = require("../routes/roomsRoute");
const roomMembersRoute = require("../routes/roomMembersRoute");
const authenticateJWT = require('../middleware/checkPermission');


const routes = (app) => {
  // [ROUTE] /users
  app.use("/users", authenticateJWT, usersRoute);

  // [ROUTE] /chats
  app.use("/chats", authenticateJWT, chatsRoute);

  // [ROUTE] /messages
  app.use("/messages",authenticateJWT, messagesRoute);

  // [ROUTE] /messages
  app.use("/conversations", conversationsRoute);

  // [ROUTE] /messages
  app.use("/friends",authenticateJWT, friendsRoute);

  // [ROUTE] /rooms
  app.use("/rooms",authenticateJWT, roomsRoute);

  // [ROUTE] /roommembers
  app.use("/roommembers",authenticateJWT, roomMembersRoute);

  // [ROUTE] /auth
  app.use("/auth", authRoute);
};

module.exports = routes;
