/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Simran Student ID: syadav44 Date: 22 July , 2023
*  Online (Cycliic) Link:  https://poised-flannel-shirt-jay.cyclic.app
*
********************************************************************************/ 


const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const exphbs = require('express-handlebars');



const collegeData = require("./modules/collegeData");
const  addStudent  = require('./modules/collegeData'); // Assuming you have a collegeData.js file in the same directory

const app = express();
const HTTP_PORT = process.env.PORT || 8080;
app.use('/public', express.static(path.join(__dirname,'public')));
console.log(path.join(__dirname,'public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' , helpers : {navLink: function(url, options){
  return '<li' + 
      ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
      '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
},equal: function (lvalue, rvalue, options) {
  if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
      return options.inverse(this);
  } else {
      return options.fn(this);
  }
}},defaultLayout:'main'}));
app.set('view engine', '.hbs');
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
  next();
});

app.get('/students/add', (req, res) => {
  res.render('addStudent');
});




// Initialize the data collection
collegeData.initialize()
  .then(() => {
    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Error initializing data:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.render('home');
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.get("/htmlDemo", (req, res) => {
  res.render('htmlDemo');
});

app.get("/students", (req, res) => {
  const course = req.query.course;
  if (course) {
    collegeData.getStudentsByCourse(course)
      .then((students) => {
        if (students.length === 0) {
          res.render("students", {message: "no results"});
        } else {
          res.render("students", {students: students});
        }
      })
      .catch((err) => {
        console.error("Error retrieving students by course:", err);
        res.sendStatus(500);
      });
  } else {
    collegeData.getAllStudents()
      .then((students) => {
        if (students.length === 0) {
          res.render("students", {message:"no results"});
        } else {
          res.render("students", {students: students});
        }
      })
      .catch((err) => {
        console.error("Error retrieving all students:", err);
        res.sendStatus(500);
      });
  }
});

app.get("/tas", (req, res) => {
  collegeData.getTAs()
    .then((tas) => {
      if (tas.length === 0) {
        res.json({ message: "no results" });
      } else {
        res.json(tas);
      }
    })
    .catch((err) => {
      console.error("Error retrieving TAs:", err);
      res.sendStatus(500);
    });
});

app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then((courses) => {
      if (courses.length === 0) {
        res.render('courses', { message: "no results" });
      } else {
        res.render('courses', { courses: courses });
      }
    })
    .catch((err) => {
      console.error("Error retrieving courses:", err);
      res.sendStatus(500);
    });
});

app.get("/student/:num", (req, res) => {
  const num = req.params.num;
  collegeData.getStudentByNum(num)
    .then((student) => {
      if (student) {
        res.render("student", { student: student }); 
      } else {
        res.render("student", { message: "no results" }); 
      }
    })
    .catch((err) => {
      console.error("Error retrieving student by number:", err);
      res.sendStatus(500);
    });
});

app.get('/course/:id', (req, res) => {
  const courseId = parseInt(req.params.id); // Parse the ID from the URL parameter
  console.log(courseId)
  collegeData.getCourseById(courseId)
    .then((course) => {
      console.log(course);
      res.render('course', { course: course });
    })
    .catch((error) => {
      res.render('course', { message: 'Course not found' } );
    });
    
});

app.post('/students/add', (req, res) => {
  const studentData = req.body;
  // console.log(req.body.First_Name);
  if (typeof studentData.TA === 'undefined') {
    studentData.TA = false;
  } else {
    studentData.TA = true;
  }

  // Call the addStudent function passing req.body as the parameter
  collegeData.addStudent(studentData)
    .then(() => {
      res.redirect('/students');
    })
    .catch((error) => {
      // Handle any errors that occurred during adding the student
      console.error('Error adding student:', error);
      res.redirect('/');
    });
});
app.post("/student/update", (req, res) => {
  collegeData.updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((error) => {
      res.render('students', { message: 'Error updating student: ' } );
    });
});

// 404 route
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});






