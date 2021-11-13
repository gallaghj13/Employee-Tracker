const inquirer = require("inquirer");
const sql = require("mysql2");
const consoleTable = require("console.table");

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
                // Return department names and ids
            } else if (choice === "View All Roles") {
                // Return job title, role id, the department that role belongs to, and the salary for that role
            } else if (choice === "View All Employees") {
                // Return employee data, including employee ids, first names, last names, job titles
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
    openingPrompt();
}

const addRole = () => {
    return inquirer
    .prompt([
        {
            type: "input",
            name: "name",
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
        }
    ])
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

