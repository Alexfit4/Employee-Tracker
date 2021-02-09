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
				"View All Department",
				"View All Roles",
				"Add Employee",
				"Add Department",
				"Add Roles",
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

				case "View All Department":
					viewDepartments();
					break;

				case "View All Roles":
					viewRoles();
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

				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};

// * Searching all employees.

const employeeSearch = () => {
	const query =
		"SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, employee.manager_id	  FROM	employee LEFT JOIN role ON employee.role_id = role.id		LEFT JOIN department ON department.id = role.department_id	LEFT JOIN employee e ON e.id = employee.manager_id";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	connection.end();
};

const viewDepartments = () => {
	const query = "SELECT * FROM department";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	connection.end();
};

const viewRoles = () => {
	const query = "SELECT * FROM role";
	connection.query(query, (err, res) => {
		console.table(res);
	});
	connection.end();
};

//* Adding employee

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
				message: "Employee's last name:",
			},
			{
				name: "roleID",
				type: "input",
				message: "Employee's ID:",
			},
		])
		.then((answer) => {
			console.log(answer.first);
			let query = `INSERT INTO employee (first_name, last_name, role_id) VALUES ('${answer.first}','${answer.last}',${answer.roleID})`;

			connection.query(query, mysql, (err, res) => {
				if (err) throw err;
				console.table(mysql);
				employeeSearch();
			});
		});
};

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
			let query = `INSERT INTO department (department) VALUES ('${answer.department}')`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				viewDepartments();
			});
		});
};

const addRole = () => {
	inquirer
		.prompt([
			{
				name: "role",
				type: "input",
				message: "Add role name:",
			},
			{
				name: "salary",
				type: "input",
				message: "Add Role Salary:",
			},
			{
				name: "salary",
				type: "input",
				message: "Add Department ID:",
			},
		])
		.then((answer) => {
			let query = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}), '${salary.department_id}'`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				viewRoles();
			});
		});
};

// * add employee first name and last name,
