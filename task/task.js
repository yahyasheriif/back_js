const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/task', {})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    level: String,
    address:  String,
    id: String
});

const Student = mongoose.model('Student', studentSchema);// schema --> class to initialize students 
// 1.Add a New Student (Hardcoded):
let newStudent = new Student({
    name: 'John Doe',
    age: 20,
    level: 'Undergraduate',
    address: '123 Main St'
});

let mohammed = new Student({
    name: 'Mohammed',
    age: 22,
    level: 'Graduate',
    address: '456 Elm St'
});

let ali = new Student({
    name: 'Ali',
    age: 23,
    level: 'Postgraduate',
    address: '789 Oak St'
});

// 2.Add a New Student (From Request Body):
app.post('/students', async (req, res) => {
    const data = new Student({
        name: req.body.name,
        age: req.body.age,
        level: req.body.level,
        address: req.body.address
    });
    const result = await data.save();
    res.json(result);
    res.status(201);

}
);

const doctorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    phone: String,
    id: String
});

const Doctor = mongoose.model('Doctor', doctorSchema);// schema --> class to initialize doctors
// 3.Add a New Doctor (From Query Parameters):
app.post('/doctors', async (req, res) => {
    const {name, age, phone} = req.query;
    const data = new Doctor({
        name: name,
        age: age,
        phone: phone
    });
    const result = await data.save();
    res.json(result);
    res.status(201);
    res.send("Doctor added successfully");
});

//4.Fetch All Students:
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
}
);

// 5. Delete a Student:
app.delete('/students/:id', async (req, res) => {
    const id = req.params.id;
    const student = await Student.findById(id);
    if (!student) {
        return res.status(404).send('Student not found');
    }
    await student.remove();
    res.status(200);
    res.send("Student deleted successfully");
}
);
// 6. Update a Doctor's Name:
app.put('/doctors/:id', async (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;
    const newPhone = req.body.phone;
    const newAge = req.body.age;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
        return res.status(404).send('Doctor not found');
    }
    doctor.name = newName;
    doctor.phone = newPhone;
    doctor.age = newAge;
    await doctor.save();
    res.json(doctor);
    res.status(200);
    res.send("Doctor updated successfully");

}
);
// 7. Fetch Both Lists (Students and Doctors):

app.get("/all", async (req, res) => {
    const students = await Student.find();
    const doctors = await Doctor.find();
    res.json({students, doctors});
}
);
