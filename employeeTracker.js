//* Required Modules/Packages
const cTable = require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");
const confirm = require("inquirer-confirm");

//* Connection
const connection = mysql.createConnection({
	host: "localhost",

	port: 3306,

	user: "root",

	password: "password",
	database: "employee_trackerDB",
});

connection.connect((err) => {
	if (err) throw err;
	console.log(`╔═════════════════════════════════════════════════════╗
║                                                     ║
║     ___                 _                         ║
║    | _| _ __  _ _ | | __  _   _  _  _   ║
║    |  | | ' \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  ║
║    | |_| | | | | | |) | | () | || |  _/  __/  ║
║    |__|| || || ._/||\\__/ \\, |\\_|\\__|  ║
║                    ||            |__/             ║
║                                                     ║
║     _  _                                          ║
║    |  \\/  | _ _ _ _   _ _  _ _  _ _ __        ║
║    | |\\/| |/ \` | ' \\ / \` |/ _\` |\/ _ \\ '_|       ║
║    | |  | | (| | | | | (| | (| |  _/ |          ║
║    ||  ||\\_,|| ||\\_,|\\_, |\\_||          ║
║                              |_/                  ║
║                                                     ║
\╚═════════════════════════════════════════════════════╝`);

	runSearch();
});

//* Starter Questions.
const runSearch = () => {
	inquirer
		.prompt({
			name: "action",
			type: "rawlist",
			message: "What would you like to do?",
			choices: [
				"View Data",
				"Add Data",
				"Remove Data",
				"Update Data",
				"View Total Revenue",
			],
		})
		.then((answer) => {
			switch (answer.action) {
				case "View Data":
					viewData();
					break;
				case "Add Data":
					addData();
					break;
				case "Remove Data":
					deleteData();
					break;
				case "Update Data":
					updateData();
					break;
				case "View Total Revenue":
					totalSum();
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
		runSearch();
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
		runSearch();
	});
};

//* View by Managers
const viewManagers = () => {
	const query =
		"SELECT CONCAT(first_name, ' ', last_name) AS Manager FROM employee WHERE employee.manager_id IS NOT NULL";
	connection.query(query, (err, res) => {
		console.table(res);
		runSearch();
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

				runSearch();
			});
		});
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
			const query = `INSERT INTO department (department) VALUES ('${answer.department}')
			`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				runSearch();
			});
		});
};

//* Add Role
const addRole = () => {
	viewDepartments();
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
				message: "Add Department ID (matching with the Department ID):",
			},
		])
		.then((answer) => {
			let query = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.departmentID})`;

			connection.query(query, (err, res) => {
				if (err) throw err;

				runSearch();
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
		inquirer
			.prompt([
				{
					name: "employee",
					type: "rawlist",
					message: "Which Emloyee's role would you like to update?:",
					choices: nameArr,
				},
				{
					name: "update",
					type: "input",
					message: "What is the name of the new role?",
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

					runSearch();
				});
			});
	});
};

//* Update Mangagers
const updateManagers = () => {
	const query = "Select * from employee where manager_id";
	let firstNameArr = [];
	let lastNameArr = [];
	connection.query(query, (err, res) => {
		res.forEach((name) => {
			firstNameArr.push(name.first_name);

			lastNameArr.push(name.last_name);
		});
		inquirer
			.prompt([
				{
					name: "first",
					type: "rawlist",
					message: "Employee's first name:",
					choices: firstNameArr,
				},
				{
					name: "last",
					type: "rawlist",
					message: "Employee's last name:",
					choices: lastNameArr,
				},
				{
					name: "updateFirst",
					type: "input",
					message: "Update first name",
				},
				{
					name: "updatelast",
					type: "input",
					message: "Update last name",
				},
			])
			.then((answer) => {
				let query = `UPDATE employee SET first_Name = '${answer.updateFirst}', last_name = '${answer.updatelast}' WHERE first_name = '${answer.first}' AND last_name = '${answer.last}'`;

				connection.query(query, (err, res) => {
					if (err) throw err;

					runSearch();
				});
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

	confirm("Delete an Employee?").then(
		function confirmed() {
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
					const query = `DELETE FROM employee WHERE id = '${answer.nameD[0]}'`;

					connection.query(query, (err, res) => {
						if (err) throw err;

						runSearch();
					});
				});
		},
		function cancelled() {
			runSearch();
		}
	);
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

	confirm("Delete a role?").then(
		function confirmed() {
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
					const query = `DELETE FROM role WHERE id = '${answer.roleD[0]}'`;

					connection.query(query, (err, res) => {
						if (err) throw err;

						runSearch();
					});
				});
		},
		function cancelled() {
			runSearch();
		}
	);
};

//* Vew Total Sum
const totalSum = () => {
	const query =
		"SELECT department.department, SUM(salary) AS TotalItemsOrdered FROM role	LEFT JOIN department ON role.department_id = department.id 	GROUP BY department_id";
	connection.query(query, (err, res) => {
		console.table(res);
		runSearch();
	});
};

//* Delete Department
const deleteDepartment = () => {
	const query = "SELECT * FROM department";
	let newArr = [];
	connection.query(query, (err, res) => {
		res.forEach((department) => {
			const string = `${department.id}: ${department.department}`;
			newArr.push(string);
		});
	});

	confirm("Delete a Department?").then(
		function confirmed() {
			inquirer
				.prompt([
					{
						name: "departmentD",
						type: "rawlist",
						message: "Departments:",
						choices: newArr,
					},
				])
				.then((answer) => {
					const query = `DELETE FROM department WHERE id = '${answer.departmentD[0]}'`;

					connection.query(query, (err, res) => {
						if (err) throw err;

						runSearch();
					});
				});
		},
		function cancelled() {
			runSearch();
		}
	);
};

//* Delete Data
const deleteData = () => {
	inquirer
		.prompt({
			name: "action",
			type: "rawlist",
			message: "What would you like to Remove?",
			choices: ["Remove Employee", "Remove Role", "Remove Department"],
		})
		.then((answer) => {
			switch (answer.action) {
				case "Remove Employee":
					deleteNames();
					break;
				case "Remove Role":
					deleteRole();
					break;
				case "Remove Department":
					deleteDepartment();
					break;

				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};

//* View Data.
const viewData = () => {
	inquirer
		.prompt({
			name: "action",
			type: "rawlist",
			message: "What would you like to view?",
			choices: ["Employees", "Department", "Roles", "Managers"],
		})
		.then((answer) => {
			switch (answer.action) {
				case "Employees":
					employeeSearch();
					break;

				case "Department":
					viewDepartments();
					break;

				case "Roles":
					viewRoles();
					break;

				case "Managers":
					viewManagers();
					break;
				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};

//*Add Data
const addData = () => {
	inquirer
		.prompt({
			name: "action",
			type: "rawlist",
			message: "What would you like to add?",
			choices: ["Add Employee", "Add Department", "Add Roles"],
		})
		.then((answer) => {
			switch (answer.action) {
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

//* Update Data
const updateData = () => {
	inquirer
		.prompt({
			name: "action",
			type: "rawlist",
			message: "What would you like to add?",
			choices: ["Update Employee Role", "Update Managers"],
		})
		.then((answer) => {
			switch (answer.action) {
				case "Update Employee Role":
					updateRole();
					break;
				case "Update Managers":
					updateManagers();
					break;
				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};
