var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

// CONNECTION
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "employee_db"
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("You are connected to employee_db!")
    startPrompts()
  });

  
  // INITIAL PROMPTS
  // prompts with switch cases to initialize each case function commented cases/functions are for future development
  function startPrompts() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          // "View employees by department",
          // "View employees by manager",
          "View all roles",
          "View all departments",
          // "View total budget by department",
          "Add an employee",
          "Add a department",
          "Add a role",
          "Remove an employee",
          // "Remove a role",
          "Remove a department",
          // "Update an employee role",
          // "Update an employee manager",
          "Exit"        
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View all employees":
          allEmployees();
          break;
  
        // case "View employees by department":
          // empByDept();
          // break;

        // case "View employees by manager":
          // empByDept();
          // break;
  
        case "View all roles":
          
          allRoles();
          break;
  
        case "View all departments":
          allDepts();
          break;
        
        // case "View total budget by department":
          // empByDept();
          // break;
        
        case "Add an employee":
          addEmployee();
          break;

        case "Add a department":
          addDept();
          break;

        case "Add a role":
          addRole();
          break;

        case "Remove an employee":
          removeEmployee();
          break;

        // case "Remove a role":
          // empByDept();
          // break;

        case "Remove a department":
          removeDept();
          break;

        // case "Update an employee role":
          // empByDept();
          // break;

        // case "Update an employee manager":
          // empByDept();
          // break;
        
  
        case "exit":
          connection.end()
          process.exit();
        }
      });
  }


  // Peer programmed with Ben De Garcia - To simplify mysql query into one function to be used in multiple places
  function grabEmployees(cb){
    connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, title Role, salary, department.name Department, CONCAT_WS(' ', e.first_name,  e.last_name) Manager FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee e ON employee.manager_id = e.id`,
    (err, data) => {
      if (err) throw err;
      cb(data)
  })}

  function grabDepts(cb){
    connection.query(
    `SELECT * FROM department`,
    (err, data) => {
      if (err) throw err;
      cb(data)
  })}

   // VIEW ALL
  // Peer programmed with Ben De Garcia
  function allEmployees() {
    grabEmployees((data) => {
      console.table(data)
      startPrompts();
    })
  }
  function allRoles() {
    console.log("Grabbing all the roles...")
    connection.query('SELECT id AS "ID", title AS "Title", salary AS "Salary" FROM role', function(err, results) {
      if (err) throw err;
      const table = cTable.getTable(results)
      console.log(table);
      startPrompts();
  });
  }
  function allDepts() {
    console.log("Displaying all the departments...")
    connection.query('SELECT id, name Department FROM department', function(err, results) {
      if (err) throw err;
      const table = cTable.getTable(results)
      console.log(table);
      startPrompts();
  });
  }


  // ADD
  function addEmployee() {
    connection.query(
      `SELECT r.title Title, d.name Department,r.id RoleID
           FROM role r
           LEFT JOIN department d ON (d.id = r.department_id)
           ORDER BY r.title, d.name`,
      (err, data) => {
        let roles = [];
        if (err) throw err;
        data.forEach((items) => {
          roles.push(`${items.Title} ${items.Department} ${items.RoleID}`);
        });
        connection.query(
          `SELECT e.first_name FirstName, e.last_name LastName, d.name Department, r.title Title, e.id EmployeeID, concat(m.first_name, " ", m.last_name) Manager
                 FROM employee e
                 LEFT JOIN role r ON (e.role_id = r.id)
                 LEFT JOIN department d ON (r.department_id = d.id)
                 LEFT JOIN employee m ON (e.manager_id = m.id)
                 ORDER BY e.first_name, e.last_name, d.name, r.title`,
          (err, data) => {
            // console.log(data);
            const table = cTable.getTable(data);
            console.log(table);
            let managers = [];
            if (err) throw err;
            data.forEach((item) => {
              managers.push(
                `${item.FirstName} ${item.LastName} ${item.EmployeeID}`
              );
            });
            inquirer
              .prompt([
                {
                  name: "first_name",
                  type: "input",
                  message: "Enter first name",
                  validate: input => {
                    if(input !== "") {
                        return true;
                    } else {
                        return "Please input the employee's first name."
                    }
                }
                },
                {
                  name: "last_name",
                  type: "input",
                  message: "Enter last name",
                  validate: input => {
                    if(input !== "") {
                        return true;
                    } else {
                        return "Please input the employee's last name."
                    }
                }
                },
                {
                  name: "role_id",
                  type: "list",
                  message: "Choose role",
                  choices: roles,
                },
                {
                  name: "manager_id",
                  type: "list",
                  message: "Choose manager",
                  choices: managers,
                },
              ])
              .then((answers) => {
                let role_id = parseInt(answers.role_id.split(" ").pop());
                let manager_id = parseInt(answers.manager_id.split(" ").pop());
                connection.query(
                  "INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)",
                  [answers.first_name, answers.last_name, role_id, manager_id],
                  (err) => {
                    if (err) throw err;
                    console.log("Employee was added!")
                    startPrompts();
                  }
                );
              });
          }
        );
      }
    );
  }
  
  function addDept() {
    inquirer
    .prompt([
      {
        name: "dept_name",
        type: "input",
        message: "What department would you like to add?",
        validate: input => {
          if(input !== "") {
              return true;
          } else {
              return "Please add the name of the department."
          }
      }
      },
    ])
    .then(answer => {
      connection.query('INSERT INTO department (name) VALUES (?)', answer.dept_name,  function(err, results) {
        if (err) throw err;
        console.log(`${answer.dept_name} was added the to list of departments.`)
      }) 
      startPrompts();
    })
  }

  function addRole() {
    connection.query('SELECT * FROM department', function(err, results) {
        if (err) throw err;
        let depArr = [];
        results.forEach((result) => {
          depArr.push(`${result.name} - ${result.id}`)
        })
    inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What role would you like to add?",
        validate: input => {
          if(input !== "") {
              return true;
          } else {
              return "Please input role title."
          }
      }
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
        validate: input => {
          const valID = input.match(/^\d+(?:\.\d{0,2})?$/);
          if(valID) {
              return true;
          } else {
              return "Please input positive numerical characters up to two decimals only."
          }
        }
      },
      {
        name: "dept_choice",
        type: "list",
        message: "Choose an existing department",
        choices: depArr
      },
    ])
    .then(answers => {
      let deptID = parseInt(answers.dept_choice.split('-').pop());
      connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, deptID], function(err, results) {
        if (err) throw err;
        console.log(`${answers.title} added to the list of roles.`)
      }) 
      startPrompts();
    })
  })
}


// REMOVE
// function peer programmed on with Ben De Garcia
function removeEmployee() {
  grabEmployees(function(data){
    let employeeList = [];
    data.forEach((item) => {
      employeeList.push(
        `${item.first_name} ${item.last_name}, Employee# ${item.id}`
      );
    });
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Who is no longer on the crew?",
          choices: employeeList,
        },
      ])
      .then((answer) => {
        let firedEmpID = answer.employee.split(" ").pop();
        connection.query(
          "DELETE FROM employee WHERE id = ?",
          firedEmpID,
          (err, data) => {
            if (err) throw err;
            console.log(`Employee removed.`);
            startPrompts();
          }
        );
      });
  })
}


function removeDept() {
  grabDepts(function(data){
    let deptList = [];
    data.forEach((item) => {
      deptList.push(
        `${item.name} ${item.id}`
      );
    });
    inquirer
      .prompt([
        {
          name: "depts",
          type: "list",
          message: "Which department will you delete?",
          choices: deptList,
        },
      ])
      .then((answer) => {
        let deletedID = answer.depts.split(" ").pop();
        connection.query(
          "DELETE FROM department WHERE id = ?",
          deletedID,
          (err, data) => {
            if (err) throw err;
            console.log(`Department removed.`);
            startPrompts();
          }
        );
      });
  })
}
  