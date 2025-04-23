const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
mongoose.connect('mongodb+srv://yahyaabdallah:3BxTpeeY2t8hs0ym@task.kwbkro7.mongodb.net/?retryWrites=true&w=majority&appName=task', {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    }
);
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
    address: '123 Main St',
}).save();

let mohammed = new Student({
    name: 'Mohammed',
    age: 22,
    level: 'Graduate',
    address: '456 Elm St',
}).save();

let ali = new Student({
    name: 'Ali',
    age: 23,
    level: 'Postgraduate',
    address: '789 Oak St',
}).save();

// 2.Add a New Student (From Request Body):
// {
//     "name":"muhammed",
//     "age":17 , 
//     "level":"1",
//     "address":"23 ali street"
// }
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
    
});

const Doctor = mongoose.model('Doctor', doctorSchema);// schema --> class to initialize doctors
// 3.Add a New Doctor (From Query Parameters):
// http://localhost:3000/doctors?name=John&age=30&phone=1234567890&id=1
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
// http://localhost:3000/students
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
}
);

// 5. Delete a Student:
// http://localhost:3000/students/3
app.delete('/students/:id', async (req, res) => {
    const id = req.params.id;
    const student = await Student.findById(id);
    if (!student) {
        return res.status(404).send('Student not found');
    }
    await Student.deleteOne({ _id: id });
    res.status(200);
    res.send("Student deleted successfully");
}
);
// 6. Update a Doctor's Name:
// http://localhost:3000/doctors?oldName=John&newName=John Doe
app.put('/doctors/', async (req, res) => {
    const{oldName,newName} = req.query;
    const doctor = await Doctor.findOne({ name: oldName });
    if (!doctor) {
        return res.status(404).send('Doctor not found');
    }
    doctor.name = newName;
    await doctor.save();
    res.json(doctor);
    res.status(200);
    res.send("Doctor updated successfully");

}
);
// 7. Fetch Both Lists (Students and Doctors):
// http://localhost:3000/all

app.get("/all", async (req, res) => {
    const students = await Student.find();
    const doctors = await Doctor.find();
    res.json({students, doctors});
}
);
