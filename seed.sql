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
("tax accountant", 73000, 2),
("finance manager", 85000, 2),
("lead engineer", 82000, 3),
("general engineer", 82000, 3),
("research assistant", 35000, 4),
("lab manager", 75000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("Chanyeol", "Park", 5, NULL),
("Junmyeon", "Kim", 4, NULL),
("Jongdae", "Kim", 8, NULL),
("Baekhyun", "Byun", 1, NULL),
("Jongin", "Kim", 2, 1),
("Sehun", "Oh", 7, 8),
("Kyungsoo", "Do", 6, 5),
("Minseok", "Kim", 3, 4);



