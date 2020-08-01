USE employee_db;

INSERT INTO department (name) 
VALUES
("marketing"),
("accounting"),
("engineering"),
("research")

INSERT INTO role (title, salary, department_id) 
VALUES
("project manager", 78000, 1),
("content strategist", 65000, 1),
("tax accountant", 85000, 2),
("finance manager", 85000, 2),
("lead engineer", 82000, 3),
("general engineer", 82000, 3),
("research assistant", 35000, 4),
("lab manager", 75000, 4);




