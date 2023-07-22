const fs = require('fs');

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
      if (err) {
        reject('Unable to read students.json');
        return;
      }

      fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          reject('Unable to read courses.json');
          return;
        }

        const studentData = JSON.parse(studentDataFromFile);
        const courseData = JSON.parse(courseDataFromFile);

        dataCollection = new Data(studentData, courseData);
        resolve();
      });
    });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length === 0) {
      reject('No results returned');
      return;
    }

    resolve(dataCollection.students);
  });
}


function getTAs() {
  return new Promise((resolve, reject) => {
    const tas = dataCollection.students.filter(student => student.TA);

    if (tas.length === 0) {
      reject('No results returned');
      return;
    }

    resolve(tas);
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length === 0) {
      reject('No results returned');
      return;
    }

    resolve(dataCollection.courses);
  });
}




function getStudentsByCourse(course) {
  return new Promise(async(resolve, reject) => {
    const student_s = await this.getAllStudents();
    const students = student_s.filter(student => student.course == course);
    if (students.length > 0) {
      resolve(students);
    } else {
      reject('No results returned');
    }
  });
}

function getStudentByNum(num) {
  return new Promise(async(resolve, reject) => {
    const student_s = await this.getAllStudents();
    const student = student_s.find(student => student.studentNum == num);
    if (student) {
      resolve(student);
    } else {
      reject('No results returned');
    }
  });
};

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (typeof studentData.TA === 'undefined') {
      studentData.TA = false;
    } else {
      studentData.TA = true;
    }

    studentData.studentNum = dataCollection.students.length + 1;
    dataCollection.students.push(studentData);

    resolve();
  });
}

function getCourseById(id) {
  return new Promise(async(resolve, reject) => {
    const courses = await this.getCourses();
    const course = courses.find((course) => course.courseId === id);
    if (course) {
      resolve(course);
    } else {
      reject(new Error('query returned 0 results'));
    }
  });
}
async function updateStudent(studentData) {
  return new Promise(async (resolve, reject) => {
    try {
      const student_s = await this.getAllStudents();
      const studentIndex = student_s.findIndex(
        (student) => student.studentNum === parseInt(studentData.studentNum)
      );
      if (studentIndex === -1) {
        reject(new Error('Student not found'));
      } else {
        // Handle the "TA" checkbox data
        studentData.TA = studentData.TA === 'on'; // Convert 'on' to true, 'undefined' to false

        // Update the student with the new data
        student_s[studentIndex] = {
          ...student_s[studentIndex],
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          addressStreet: studentData.addressStreet,
          addressCity: studentData.addressCity,
          addressProvince: studentData.addressProvince,
          TA: studentData.TA,
          status: studentData.status,
          course: studentData.course,
        };

        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}




module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentsByCourse,
  getStudentByNum,
  addStudent,
  getCourseById,
  updateStudent
  
  
};
