// HTML references
const $deskLabel = document.querySelector("#desk");
const $currentTicketLabel = document.querySelector("small");
const $takeTicketButton = document.querySelector("button");
const $queueLabel = document.querySelector("#lblPendientes");
const $alert = document.querySelector(".alert");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("Desk is obligatory");
}

const desk = searchParams.get("escritorio");

const socket = io();

$alert.style.display = "none";
$deskLabel.textContent = "Escritorio " + desk;

socket.on("connect", () => {
  $takeTicketButton.disabled = false;
});

socket.on("disconnect", () => {
  $takeTicketButton.disabled = true;
});

socket.on("pendingTickets", (tickets) => {
  $queueLabel.textContent = tickets;
  console.log(tickets);
});

$takeTicketButton.addEventListener("click", () => {
  const payload = { desk };
  socket.emit("takeTicket", payload, ({ ok, ticket, msg }) => {
    if (!ok) {
      $currentTicketLabel.textContent = "Nadie";
      return ($alert.style.display = "");
    }
    $currentTicketLabel.textContent = "Ticket " + ticket.number;
  });
});
