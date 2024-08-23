Here's a `README.md` file for your Node.js project. This will give users a clear understanding of the project, how to set it up, and how to use it.

---

# 1x1 Mentor Booking System

This project is a simple 1x1 Mentor Booking System built with Node.js and SQLite. It allows students to book sessions with mentors based on their areas of expertise, with options for premium services.

## Features

- **Mentor Management**: Mentors can be premium or non-premium and are categorized by areas of expertise.
- **Student Booking**: Students can book sessions with mentors based on their area of interest. The system ensures no bookings are made on Sundays, and sessions are scheduled between 6 PM and 10 PM.
- **Dynamic Scheduling**: Sessions are scheduled based on the mentor's latest available slot, with options for 30, 45, and 60-minute durations.
- **Load Balancing**: The system assigns the least booked mentor if no premium mentor is chosen.
  
## Project Structure

```bash
1x1-mentor-booking/
│
├── db/
│   └── sqlite.db           # SQLite database file
├── routes/
│   ├── booking.js          # Booking route handling
│   └── mentors.js          # Mentor route handling
├── middleware/
│   └── cors.js             # CORS middleware setup
├── app.js                  # Main application file
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js
- npm
- SQLite

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/1x1-mentor-booking.git
   cd 1x1-mentor-booking
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Database Setup:**

   The project uses SQLite as the database. The database schema and initial data are set up automatically when the application runs for the first time.

4. **Run the Server:**

   ```bash
   npm start
   ```

   The server will start at `http://localhost:3000`.

## API Endpoints

### 1. Get Premium Mentors by Expertise

**Endpoint:** `/api/mentors`

**Method:** `GET`

**Query Parameters:**
- `expertise` (required): The area of expertise to filter mentors by.

**Response:**
- Returns a list of premium mentors with the specified expertise.

**Example:**
```http
GET /api/mentors?expertise=FMCG
```

### 2. Book a Mentor Session

**Endpoint:** `/api/bookings`

**Method:** `POST`

**Request Body:**
- `student_name` (required): Name of the student.
- `area_of_interest` (required): The area of interest for which the mentor is being booked.
- `duration` (required): Duration of the session (30, 45, or 60 minutes).
- `premium_service` (optional): Boolean indicating if the student wants a premium mentor.

**Response:**
- Returns the booking ID on successful booking.

**Example:**
```json
{
    "student_name": "John Doe",
    "area_of_interest": "Sales",
    "duration": 45,
    "premium_service": true
}
```
### 3. Retreive all bookings

**Endpoint:** `/api/bookings`

**Method:** `GET`

**Response:**
- Returns all the bookings made till now

### CORS Configuration

The project includes a CORS middleware setup to handle cross-origin requests from the frontend. The middleware is configured in the `middleware/cors.js` file.

## Testing the API

To test the API, you can use tools like [Postman](https://www.postman.com/) or create an `app.http` file with sample requests. Here's an example:

```http
### Get Premium Mentors
GET http://localhost:3000/api/mentors?expertise=Sales

### Book a Session
POST http://localhost:3000/api/bookings
Content-Type: application/json

{
    "student_name": "Jane Doe",
    "area_of_interest": "Marketing",
    "duration": 30,
    "premium_service": false
}
```

## License

This project is licensed under the MIT License.

---

This `README.md` provides a comprehensive guide to understanding, setting up, and using the 1x1 Mentor Booking System project. You can customize the sections as needed based on the specific requirements or additional features of your project.