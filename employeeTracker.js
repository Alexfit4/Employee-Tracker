const cTable = require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");
const confirm = require('inquirer-confirm')

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
				"View All Department",
				"View All Roles",
				"View All Managers",
				"Add Employee",
				"Add Department",
				"Add Roles",
				"Remove Employee",
				"Remove Role",
				"Update Employee Role",
			],
		})
		.then((answer) => {
			switch (answer.action) {
				case "View All Employees":
					employeeSearch();
					break;

				case "View All Department":
					viewDepartments();
					break;

				case "View All Roles":
					viewRoles();
					break;

				case "View All Managers":
					viewManagers();
					break;

				case "Add Employee":
					addEmployee();
					break;

				case "Add Department":
					addDepartment();
					break;

				case "Add Roles":
					addRole();
					break;
				case "Update Employee Role":
					updateRole();
					break;
				case "Remove Employee":
					deleteNames();
					break;
				case "Remove Role":
					deleteRole();
					break;

				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};

// * View all employees.

const employeeSearch = () => {
	const query =
		"SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, CONCAT(e.first_name, ' ', e.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id	LEFT JOIN employee e ON e.id = employee.manager_id";
	connection.query(query, (err, res) => {
		console.table(res);
	});
};

//* View all Departments
const viewDepartments = () => {
	const query = "SELECT * FROM department";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	
};

// * View all Roles
const viewRoles = () => {
	const query = "SELECT * FROM role";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	
};

//* Adding employee

const addEmployee = () => {
	const query = "SELECT * FROM role";
	let newArr = [];
	let conversions = {};
	connection.query(query, (err, res) => {
		res.forEach((role) => {
			const string = `${role.id}: ${role.title}`;
			conversions[string] = role.id;
			newArr.push(string);
		});
	});
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
				message: "Employee's last name:",
			},
			{
				name: "roleID",
				type: "rawlist",
				message: "Employee's ID:",
				choices: newArr,
			},
		])
		.then((answer) => {
			let query = `INSERT INTO employee (first_name, last_name, role_id) VALUES ('${
				answer.first
			}','${answer.last}',${conversions[answer.roleID]})`;

			connection.query(query, (err, res) => {
				if (err) throw err;

				employeeSearch();
			});
		});
};

//* View by Managers
const viewManagers = () => {
	const query =
		"SELECT CONCAT(e.first_name, ' ', e.last_name) AS Manager	FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department	ON department.id = role.department_id	LEFT JOIN employee e ON e.id = employee.manager_id WHERE employee.manager_id IS NOT NULL";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	connection.end();
};

//* Add Department

const addDepartment = () => {
	inquirer
		.prompt([
			{
				name: "department",
				type: "input",
				message: "Add Department name:",
			},
		])
		.then((answer) => {
			let query = `INSERT INTO department (department) VALUES ('${answer.department}')
			`;

			query += connection.query(query, (err, res) => {
				if (err) throw err;
				viewDepartments();
			});
		});
};

//* Add Role
const addRole = () => {
	inquirer
		.prompt([
			{
				name: "title",
				type: "input",
				message: "Add role name:",
			},
			{
				name: "salary",
				type: "input",
				message: "Add Role Salary:",
			},
			{
				name: "departmentID",
				type: "input",
				message: "Add Department ID:",
			},
		])
		.then((answer) => {
			let query = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.departmentID})`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				viewRoles();
			});
		});
};

//* Update Employee Role
const updateRole = () => {
	const query = "SELECT * FROM role";
	let nameArr = [];
	connection.query(query, (err, res) => {
		res.forEach((name) => {
			nameArr.push(name.title);
		});
		console.log(nameArr);
	});
	inquirer
		.prompt([
			{
				name: "update",
				type: "input",
				message: "What is the name of the new role?",
			},
			{
				name: "employee",
				type: "rawlist",
				message: "Which Emloyee's role would you like to update?:",
				choices: nameArr,
			},
			{
				name: "salary",
				type: "input",
				message: "New salary for role.",
			},
		])
		.then((answer) => {
			let query = `UPDATE role SET title = '${answer.update}', salary = ${answer.salary} WHERE title = '${answer.employee}'`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				viewRoles();
			});
		});
};

//* Delete Employee
const deleteNames = () => {

	const query = "SELECT * FROM employee";
	let newArr = [];
	connection.query(query, (err, res) => {
		res.forEach((name) => {
			const string = `${name.id}: ${name.first_name} ${name.last_name}`;
			newArr.push(string);
		});
	});


	confirm('Delete an Employee?')
  .then(function confirmed() {
    inquirer
		.prompt([
			{
				name: "nameD",
				type: "rawlist",
				message: "Employee's:",
				choices: newArr,
			},
		])
		.then((answer) => {
			console.log(answer.nameD[0]);
			const query = `DELETE FROM employee WHERE id = '${answer.nameD[0]}'`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				employeeSearch();
				connection.end();
			});
		});
  }, function cancelled() {
    connection.end();
  });



	
};


//* Delete Role
const deleteRole = () => {

	const query = "SELECT * FROM role";
	let newArr = [];
	connection.query(query, (err, res) => {
		res.forEach((role) => {
			const string = `${role.id}: ${role.title}`;
			newArr.push(string);
		});
	});


	confirm('Delete a role?')
  .then(function confirmed() {
    inquirer
		.prompt([
			{
				name: "roleD",
				type: "rawlist",
				message: "Roles:",
				choices: newArr,
			},
		])
		.then((answer) => {
			console.log(answer.roleD[0]);
			const query = `DELETE FROM role WHERE id = '${answer.roleD[0]}'`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				viewRoles();
				connection.end();
			});
		});
  }, function cancelled() {
    connection.end();
  });



	
};