const express = require('express');
const router = express.Router();
const db = require('./db');
const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');

// Helper function to check if a date is a Sunday
const isSunday = (date) => DateTime.fromISO(date).weekday === 7;

// Helper function to get the next available slot
const getNextAvailableSlot = (latestBookingEndTime, duration) => {
  let startTime = DateTime.fromISO(latestBookingEndTime);
  let endTime = startTime.plus({ minutes: duration });

  if (endTime.hour >= 22 || (endTime.hour === 21 && endTime.minute > 30)) {
    startTime = startTime.plus({ days: 1 }).set({ hour: 18, minute: 0 });
    endTime = startTime.plus({ minutes: duration });
  }

  while (isSunday(startTime.toISODate())) {
    startTime = startTime.plus({ days: 1 }).set({ hour: 18, minute: 0 });
    endTime = startTime.plus({ minutes: duration });
  }

  return { startTime, endTime };
};

// Route to get premium mentors with specified expertise
router.get('/mentors', (req, res) => {
  const { expertise } = req.query;

  if (!expertise) {
    return res.status(400).json({ error: 'Expertise query parameter is required' });
  }

  db.all(`SELECT * FROM mentors
          WHERE is_premium = 1 AND areas_of_expertise LIKE ?`, [`%${expertise}%`], (err, mentors) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(mentors);
  });
});

//Route to get all bookings
router.get('/bookings', (req,res)=>{
    db.all(`SELECT * FROM bookings`, (err,bookings)=>{
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.json(bookings);
    })
})

// Route to handle booking requests
router.post('/bookings', (req, res) => {
  const { student_name, area_of_interest, duration, premium_service } = req.body;

  let mentorQuery = `SELECT mentors.*, COUNT(bookings.id) AS booking_count
                     FROM mentors
                     LEFT JOIN bookings ON mentors.id = bookings.mentor_id AND DATE(bookings.start_time) = DATE('now')
                     WHERE mentors.areas_of_expertise LIKE ?`;

  if (premium_service) {
    mentorQuery += ` AND mentors.is_premium = 1`;
  } else {
    mentorQuery += ` AND mentors.is_premium = 0`;
  }

  mentorQuery += ` GROUP BY mentors.id
                   ORDER BY booking_count ASC, mentors.is_premium DESC`;

  db.all(mentorQuery, [`%${area_of_interest}%`], (err, mentors) => {
    if (err || mentors.length === 0) {
      res.status(500).json({ error: "No available mentor found" });
      return;
    }

    const mentor = mentors[0];

    db.get(
      `SELECT end_time FROM bookings WHERE mentor_id = ? ORDER BY end_time DESC LIMIT 1`,
      [mentor.id],
      (err, latestBooking) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        let { startTime, endTime } = latestBooking
          ? getNextAvailableSlot(latestBooking.end_time, duration)
          : getNextAvailableSlot(DateTime.now().set({ hour: 18, minute: 0 }).toISO(), duration);

        // Update the student in the students table
        const studentId = uuidv4();
        db.run(
          `INSERT INTO students (id, student_name, area_of_interest, availability)
           VALUES (?, ?, ?, ?)`,
          [studentId, student_name, area_of_interest, 1],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
          }
        );

        db.run(
          `INSERT INTO bookings (id, mentor_id, student_name, area_of_interest, start_time, end_time, duration)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), mentor.id, student_name, area_of_interest, startTime.toISO(), endTime.toISO(), duration],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: "Booking successful", booking_id: this.lastID });
          }
        );
      }
    );
  });
});

module.exports = router;
