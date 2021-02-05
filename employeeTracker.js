const cTable = require('console.table');
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employee_trackerDB',
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'View All Employees by Department',
          'View All Employees by Manager',
          'Add Employee',
          'Remove Employee',
          'Update Employee Role',
          'Update Employee Role',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View All Employees':
            employeeSearch();
            break;
  
        //   case 'Find all artists who appear more than once':
        //     multiSearch();
        //     break;
  
        //   case 'Find data within a specific range':
        //     rangeSearch();
        //     break;
  
        //   case 'Search for a specific song':
        //     songSearch();
        //     break;
  
        //   case 'Find artists with a top song and top album in the same year':
        //     songAndAlbumSearch();
        //     break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };



  const employeeSearch = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      console.table(res);
      connection.end();
    });
  };