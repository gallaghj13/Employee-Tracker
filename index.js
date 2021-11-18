const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// Create connection to mysql?
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the company_db database.`)
  );

const openingPrompt = () => {
    return inquirer
        .prompt([
            {
              type: "list",
              name: "choice",
              message: "What would you like to do?",
              choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role"]
            }
        ])
        .then(({ choice }) => {
            if(choice === "View All Departments") {
                db.query('SELECT * FROM department;', function (err, results) {
                    console.table(results);
                    openingPrompt();
                  });
            } else if (choice === "View All Roles") {
                db.query('SELECT roles.id, roles.title, department.department_name AS department, roles.salary FROM roles LEFT JOIN department ON roles.department_id = department.id;', function (err, results) {
                    console.table(results);
                    openingPrompt();
                  });
                
            } else if (choice === "View All Employees") {
                db.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department, roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;', function (err, results) {
                    console.table(results);
                    openingPrompt();
                  });
            } else if (choice === "Add A Department") {
                addDepartment();
            } else if (choice === "Add A Role") {
                addRole();
            } else if (choice === "Add An Employee") {
                addEmployee();
            } else if (choice === "Update an Employee Role") {
                updateRole();
            }
        })
};


const addDepartment = () => {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "What is the name of the department?",
            }
        ])
        .then(({ department }) => {
            db.query('INSERT INTO department (department_name) VALUES (?)', department, (err, result) => {
                if (err) {
                    console.log(err);
                  }
                  console.log(result);
            })
            return openingPrompt();
        });
}

function addRole() {
    db.promise().query('SELECT * FROM department')
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({id, department_name}) => ({
            name: department_name,
            value: id
        }));

        inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",

        },
        {
            type: "list",
            name: "department",
            message: "Which department does the role belong to?",
            choices: departmentChoices
        }
    ]).then(({ title, salary, department }) => {
        const newRole = {
            title,
            salary,
            department_id: department
        }

        console.log(newRole)
        db.query('INSERT INTO roles SET ?', newRole, (err, result) => {
            if (err) {
                console.log(err);
                }
                console.log(result);
        })
        return openingPrompt();
    })
})
}

const addEmployee = () => {
    db.promise().query('SELECT * FROM roles')
    .then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ title, id}) => ({
            name: title,
            value: id
        }));
        inquirer.prompt([
            {
                type: "input",
                name: "first",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "last",
                message: "What is the employee's last name??",
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roleChoices
            }
            // Need Role Array too?
            // Need question: Who is employee's manager? Need a way to have the options come from a managers array?
            // managerChoices.unshift({name: "None", value: null})
            // db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL');
        ])
        .then((data) => {
            let firstName = data.first;
            let lastName = data.last;
            let employeeRole = data.role;

            db.promise().query('SELECT * FROM employee')
            .then(([rows]) => {
                let employees = rows;
                const employeeArr = employees.map(({ first_name, last_name, id}) => ({
                    name: first_name + ' ' + last_name,
                    value: id
                }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: employeeArr
                }
            ])
        .then((data) => {
            let manager = data.manager;
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, employeeRole, manager], (err, result) => {
                if(err) {
                    console.log(err);
                }
                    console.log(result);
            })
            return openingPrompt();
        })})})})
    }

const updateRole = () => {
    db.promise().query('SELECT * FROM employee')
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ first_name, last_name, id}) => ({
            name: first_name + ' ' + last_name,
            value: id
        }));
        inquirer.prompt([
            {
                type: "list",
                name: "update",
                message: "Which employee would you like to update?",
                choices: employeeChoices
            }
        ])
        .then((data) => {
            let employee = data.update
            db.promise().query('SELECT * FROM roles')
            .then((data) => {
                let roles = data;
                const roleChoices = roles.map(({ title, id}) => ({
                    name: title,
                    value: id
                }));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "What is this employee's new role?",
                        choices: roleChoices
                    }
                ])
                .then((data) => {
                    let newRole = data.role;
                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRole, employee], (err, result) => {
                        if(err) {
                            console.log(err);
                        }
                        console.log(result);
                    })
                    return openingPrompt();
                })
            })
        })
    })
}

openingPrompt();

