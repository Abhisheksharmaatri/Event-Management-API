# Event-Management-API

The Event Management System is a web application that simplifies event organization, facilitates user registrations, and enables attendees to book tickets for various events. This system provides a user-friendly interface for event creators to manage event details and allows users to browse and register for events of their interest.

## Features

- **Event Creation**: Event organizers can create new events by providing essential details such as title, description, date, and venue. They can also set ticket prices, specify event categories, and manage event capacity.

- **User Registration**: Users can sign up for an account in the system to access various features. Registration typically requires providing basic information like name, email address, and password.

- **Event Browsing**: Users can browse through a list of available events, filter events based on categories, dates, or other criteria, and view detailed information about each event.

- **Ticket Booking**: Users can select events of interest and book tickets. The system tracks the number of available tickets and allows users to specify the quantity of tickets they wish to purchase.

- **Payment Integration**: The system supports secure payment processing, allowing users to complete their ticket bookings by making online payments.

- **Booking Management**: Event organizers and users can view and manage their bookings, including ticket details, payment status, and cancellation options.

## Technologies Used

- Back-end: Node.js, Express.js
- Database: MySQL
- ORM: Sequelize

## Getting Started

### Prerequisites

- Node.js and npm should be installed on your system.
- MySQL Server should be installed and running.

### Installation

1. Clone the repository:

```shell
git clone https://github.com/your-username/event-booking-system.git

```

2. Install the dependencies:

```cd event-booking-system
    npm install

```

3. Configure the database:

- Create a MySQL database for the project.
- Update the database configuration in the config/config.js file.

4. Run the application

```npm start

```

5. Access the application:

- Open your web browser and visit http://localhost:3000 to access the event booking system.

6. Contributing

- Contributions are welcome! If you find any bugs or have suggestions for improvements, please feel free to submit an issue or a pull request.
