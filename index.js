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
                db.query('SELECT * FROM department', function (err, results) {
                    console.table(results);
                  });
                  return openingPrompt();
            } else if (choice === "View All Roles") {
                db.query('SELECT * FROM roles', function (err, results) {
                    console.table(results);
                  });
                  return openingPrompt();
            } else if (choice === "View All Employees") {
                db.query('SELECT * FROM employee', function (err, results) {
                    console.table(results);
                  });
                  return openingPrompt();
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

const addRole = () => {
    return inquirer
    .prompt([
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
            type: "input",
            name: "department",
            message: "Which department does the role belong to?",
            // choices: [Department Array]
        }
    ])
    .then(({ title, salary, department}) => {
        const newRole = {
            title,
            salary,
            department
        }
        db.query('INSERT INTO roles (title, salary, department_id) VALUES (?)', newRole, (err, result) => {
            if (err) {
                console.log(err);
              }
              console.log(result);
        })
        return openingPrompt();
    });
    openingPrompt();
}

const addEmployee = () => {
    return inquirer
    .prompt([
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
            type: "input",
            name: "department",
            message: "What is the employee's role?",
        }
        // Need question: Who is employee's manager? Need a way to have the options come from a managers array?
    ])
    openingPrompt();
}

const updateRole = () => {
    return inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "Which employee's role do you want to update?",
        },
        {
            type: "input",
            name: "role",
            message: "What role do you want to assign to the selected employee?",
        }
    ])
    openingPrompt();
}

openingPrompt();

