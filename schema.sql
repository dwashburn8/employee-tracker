DROP DATABASE IF EXISTS employee_summary;
CREATE DATABASE employee_summary;

CREATE TABLE department(
id INT AUTO_INCREMENT NOT NULL,
name VARCHAR(30),

PRIMARY KEY(id)
);

CREATE TABLE role(
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(30),
salary DECIMAL (4,2),
department_id INT,

PRIMARY KEY(id)
);

CREATE TABLE employee(
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30),
last_name DECIMAL (4,2),
role_id INT,
manager_id INT ,

PRIMARY KEY(id)
);




