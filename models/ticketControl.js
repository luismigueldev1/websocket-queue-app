const path = require("path");
const fs = require("fs");
const { timeStamp } = require("console");

class Ticket {
  constructor(number, desk) {
    (this.number = number), (this.desk = desk);
  }
}

class TicketControl {
  constructor() {
    this.last = 0;
    this.today = new Date().getDate();
    this.tickets = [];
    this.lastFourTickets = [];

    this.init();
  }

  get toJson() {
    return {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      lastFourTickets: this.lastFourTickets,
    };
  }

  init() {
    const {
      today,
      tickets,
      lastFourTickets,
      last,
    } = require("../db/data.json");
    if (today === this.today) {
      this.tickets = tickets;
      this.last = last;
      this.lastFourTickets = lastFourTickets;
    } else {
      this.saveOnDb();
    }
  }

  saveOnDb() {
    const dbpath = path.join(__dirname, "../db/data.json");
    fs.writeFileSync(dbpath, JSON.stringify(this.toJson));
  }

  nextTicket() {
    this.last += 1;
    const ticket = new Ticket(this.last, null);
    this.tickets.push(ticket);
    this.saveOnDb();
    return "Ticket: " + this.last;
  }

  takeTicket(desk) {
    //We don't have tickets
    if (this.tickets.length === 0) {
      return null;
    }
    const ticket = this.tickets.shift();
    ticket.desk = desk;

    this.lastFourTickets.unshift(ticket);

    if (this.lastFourTickets.length > 4) {
      this.lastFourTickets.splice(-1, 1);
    }

    this.saveOnDb();
    return ticket;
  }
}

module.exports = TicketControl;
