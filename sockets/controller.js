const TicketControl = require("../models/ticketControl");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit("lastTicket", ticketControl.last);
  socket.emit("lastFour", ticketControl.lastFourTickets);
  socket.emit("pendingTickets", ticketControl.tickets.length);

  socket.on("nextTicket", (payload, callback) => {
    const nextTicket = ticketControl.nextTicket();
    callback(nextTicket);
    socket.broadcast.emit("pendingTickets", ticketControl.tickets.length);
  });

  socket.on("takeTicket", ({ desk }, callback) => {
    if (!desk) {
      return callback({
        ok: false,
        msg: "Desk is required",
      });
    }
    const ticket = ticketControl.takeTicket(desk);
    socket.broadcast.emit("lastFour", ticketControl.lastFourTickets);
    socket.emit("pendingTickets", ticketControl.tickets.length);
    socket.broadcast.emit("pendingTickets", ticketControl.tickets.length);
    if (!ticket) {
      callback({
        ok: false,
        msg: "No tickets.",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = { socketController };
