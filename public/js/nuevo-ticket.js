//DOM ELEMENTS
const lblNewTicket = document.querySelector("#lblNuevoTicket");
const btnCreate = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  btnCreate.disabled = false;
});

socket.on("disconnect", () => {
  btnCreate.disabled = true;
});

socket.on("lastTicket", (ticket) => {
  lblNewTicket.textContent = `Ticket: ${ticket}`;
});

btnCreate.addEventListener("click", () => {
  socket.emit("nextTicket", null, (ticket) => {
    lblNewTicket.textContent = ticket;
  });
});
