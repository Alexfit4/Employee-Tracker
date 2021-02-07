const cTable = require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
	host: "localhost",

	// Your port; if not 3306
	port: 3306,

	// Your username
	user: "root",

	// Be sure to update with your own MySQL password!
	password: "password",
	database: "employee_trackerDB",
});

connection.connect((err) => {
	if (err) throw err;
	runSearch();
});

const runSearch = () => {
	inquirer
		.prompt({
			name: "action",
			type: "rawlist",
			message: "What would you like to do?",
			choices: [
				"View All Employees",
				"View All Employees by Department",
				"View All Employees by Manager",
				"Add Employee",
				"Remove Employee",
				"Update Employee Role",
				"Update Employee Role",
			],
		})
		.then((answer) => {
			switch (answer.action) {
				case "View All Employees":
					employeeSearch();
					break;

				case "View All Employees by Department":
					employeeSearchDepartment();
					break;

				case "Add Employee":
					addEmployee();
					break;

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
	const query =
		"SELECT employee.id, employee.first_name,employee.last_name, role.title, department.department, role.salary, employee.manager_id FROM employee LEFT JOIN role ON role.id=employee.id LEFT JOIN department on role.department_id = department.id";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	connection.end();
};

const employeeSearchDepartment = () => {
	const query =
		"SELECT department.name, employee.first_name, employee.last_name FROM employee JOIN department ON employee.id = department.id;";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	connection.end();
};

const addEmployee = () => {
	inquirer
		.prompt([
			{
				name: "first",
				type: "input",
				message: "Employee's first name:",
			},
			{
				name: "last",
				type: "input",
				message: "Employee's last name:"
			},
      {
				name: "department",
				type: "input",
				message: "Employee's department number 1-4:"
			},

		])
		.then((answer) => {
      console.log(answer.first);
			const query = `INSERT INTO employee (first_name, last_name) VALUES ('${answer.first}','${answer.last}')`
      let mysql = 'SELECT * FROM employee'
        connection.query(query, mysql, (err, res) => {
        if (err) throw err;        
          console.table(mysql);
          employeeSearch()
      
        
      });
		});
	
};

// ALTER TABLE employee
// ADD first_name datatype;
