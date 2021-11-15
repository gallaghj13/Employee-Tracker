USE company_db;

INSERT INTO department (department_name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Junior Developer", 65000, 2),
("Lead Engineer", 125000, 2),
("Sales Lead", 110000, 1),
("Salesperson", 75000, 1),
("Account Manager", 130000, 3),
("Lawyer", 100000, 4),
("Lead Counsel", 200000, 4),
("Accountant", 110000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
("Nate", "Dogg", 2, 2),
("Snoop", "Dogg", 3, 1),
("Dr", "Dre", 4, NULL),
("Tupac", "Shakur", 5, 3),
("Lil", "Jon", 6, NULL),
("Jay", "Z", 7, 4),
("Method", "Man", 8, NULL);

