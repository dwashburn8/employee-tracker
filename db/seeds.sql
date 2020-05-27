INSERT INTO department (department_name)
VALUES("Sales"), ("Management"),("Administration"), ("Warehouse"), ("Human Resources"),("Accounting");

INSERT INTO role(title,salary,department_id)
VALUES("Regional Manager", 75000, 2),
("Salesman", 85000, 1),
("Office Administrator", 50000, 3),
("Foreman", 60000, 4),
("HR Rep", 10, 5),
("Accountant", 45000,6);

INSERT INTO employee(first_name, last_name, role_id,manager_id)
VALUES("Michael", "Scott", 1, null),
("Dwight", "Schrute", 2, 1),
("Pam", "Beesley", 3, 1),
("Darryl", "Philbin", 4, null),
("Toby", "Flenderson", 5, 1),
("Kevin", "Malone", 6, 1)