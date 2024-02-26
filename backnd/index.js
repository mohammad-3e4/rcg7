const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const StudentDataroute = require("./routes/StudentData");
const AdminDataroute = require("./routes/AdminData");
const StudentMarksroute = require("./routes/StudentMarks");
const teachersroute = require("./routes/Teachers");
const Classesroute= require("./routes/Classes");
const app = express();
const port = 3001;
const path = require('path')

app.use(cors());
app.use(bodyParser.json());

app.use("/", StudentDataroute);
app.use("/admin", AdminDataroute);
app.use("/student", StudentMarksroute);
app.use("/cls", Classesroute);
app.use("/staff", teachersroute);

app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'))
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
