DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(30),
	salary DECIMAL UNSIGNED,
	department_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_dept_id FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT UNSIGNED,
    manager_id INT UNSIGNED,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT fk_man_id FOREIGN KEY (manager_id) REFERENCES employee(id)
)

