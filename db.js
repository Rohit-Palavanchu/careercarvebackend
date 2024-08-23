const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const db = new sqlite3.Database('./sqlite.db');

db.serialize(() => {
    // Create Mentors table
    db.run(`CREATE TABLE IF NOT EXISTS mentors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      areas_of_expertise TEXT NOT NULL,
      is_premium INTEGER NOT NULL,
      availability BOOLEAN NOT NULL
    )`);
  
    // Create Bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      mentor_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      area_of_interest TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      duration INTEGER NOT NULL,
      FOREIGN KEY(mentor_id) REFERENCES mentors(id)
    )`);

    // Create Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      area_of_interest TEXT NOT NULL,
      availability BOOLEAN NOT NULL
    )`);

    // Insert dummy data into Mentors table
    const mentors = [
        { name: 'Alice Johnson', areas_of_expertise: 'FMCG, Sales', is_premium: 1, availability: 1 },
        { name: 'Bob Smith', areas_of_expertise: 'Marketing, Digital Marketing', is_premium: 0, availability: 1 },
        { name: 'Carol White', areas_of_expertise: 'E-commerce, Retail Management', is_premium: 1, availability: 0 },
        { name: 'David Brown', areas_of_expertise: 'Sales, Business Development', is_premium: 0, availability: 1 },
        { name: 'Eve Davis', areas_of_expertise: 'FMCG, Product Management', is_premium: 1, availability: 1 }
    ];

    mentors.forEach(mentor => {
        const mentorId = uuidv4();
        db.run(`INSERT INTO mentors (id, name, areas_of_expertise, is_premium, availability) 
                VALUES (?, ?, ?, ?, ?)`, 
                [mentorId, mentor.name, mentor.areas_of_expertise, mentor.is_premium, mentor.availability]);
    });
});

module.exports = db;