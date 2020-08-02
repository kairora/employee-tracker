var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

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

  function startPrompts() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View employees by department",
          "View employees by manager",
          "View all roles",
          "View all departments",
          "View total budget by department",
          "Add an employee",
          "Add a department",
          "Add a role",
          "Remove an employee",
          "Remove a role",
          "Remove a department",
          "Update an employee role",
          "Update an employee manager",
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

        // case "Remove an employee":
          // empByDept();
          // break;

        // case "Remove a role":
          // empByDept();
          // break;

        case "Remove a department":
          deleteDept();
          break;

        // case "Update an employee role":
          // empByDept();
          // break;

        // case "Update an employee manager":
          // empByDept();
          // break;
        
  
        case "exit":
          connection.end();
          process.exit();
          break;
        }
      });
  }
  
  // get by ID
  function roleID(answer) {
    
    connection.query('SELECT id FROM role WHERE title = ?', answer.title, function(err, result) {
      if (err) throw err;
      return result
  });
  }


  // View All
  function allEmployees() {
    console.log("Searching for all employees...")
    connection.query(`SELECT employee.id, employee.first_name First_Name, employee.last_name Last_Name, title Role, Salary, department.name Department, CONCAT_WS(' ', e.first_name,  e.last_name) Manager FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee e ON employee.manager_id = e.id;`, function(err, results) {
      if (err) throw err;
      const table = cTable.getTable(results)
      console.log(table);
      startPrompts();
  });
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
           LEFT JOIN department d ON (d.id = r.dept_id)
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
                 LEFT JOIN department d ON (r.dept_id = d.id)
                 LEFT JOIN employee m ON (e.manager_id = m.id)
                 ORDER BY e.first_name, e.last_name, d.name, r.title`,
          (err, data) => {
            console.log(data);
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
                },
                {
                  name: "last_name",
                  type: "input",
                  message: "Enter last name",
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
                    mainMenu();
                  }
                );
              });
          }
        );
      }
    );
  }
  // function addEmployee() {
  //   inquirer
  //   .prompt([
  //     {
  //       name: "first_name",
  //       type: "input",
  //       message: "What is the employee's first name? ",
  //       validate: function(value) {
  //         if(input !== "") {
  //           return true;
  //         } else {
  //           return "Please input the employee's first name."
  //         }
  //       }
  //     },
  //     {
  //       name: "last_name",
  //       type: "input",
  //       message: "What is the employee's last name? ",
  //       validate: function(value) {
  //         if(input !== "") {
  //           return true;
  //         } else {
  //           return "Please input the employee's last name."
  //         }
  //       }
  //     },
  //     {
  //       name: "role",
  //       type: "input",
  //       message: "What is the employee's role? ",
  //       validate: function(value) {
  //         if(input !== "") {
  //           return true;
  //         } else {
  //           return "Please input the employee's last name."
  //         }
  //       }
  //     },
  //   ])
  //   .then(answers => {
  //     let newRoleID = roleID();
  //     connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ? ? ? ?', answers.first_name, answers.last_name, newRoleID,  function(err, results) {
  //       if (err) throw err;
  //       const table = cTable.getTable(allDepts(results)
  //       console.log(table);
  //       startPrompts();
  //     }) 
  //   })
  // }


// Worked with Ben De Garcia
function viewEmployees() {
  getEmployees((data) => {
      console.table(data)
mainMenu();
  })
}

function removeEmployee() {
  getEmployees(function(data){
    let employeeList = [];
    console.log(data)
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
          }
        );
      });
  })
mainMenu();
}


function getEmployees(cb){
  connection.query(
  `SELECT employee.id, employee.first_name, employee.last_name, title Role, salary, department.name Department, CONCAT_WS(' ', e.first_name,  e.last_name) Manager FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.dept_id = department.id
      LEFT JOIN employee e ON employee.manager_id = e.id`,
  (err, data) => {
    if (err) throw err;
    cb(data)
})}

  function addDept() {
    inquirer
    .prompt([
      {
        name: "dept_name",
        type: "input",
        message: "What department would you like to add?"
      },
    ])
    .then(answer => {
      connection.query('INSERT INTO department (name) VALUES (?)', answer.dept_name,  function(err, results) {
        if (err) throw err;
        console.log(answer.dept_name)
        const table = cTable.getTable(allDepts(results))
        console.log(table);
      }) 
      startPrompts();
    })
  }

  function addRole() {
    connection.query('SELECT * FROM department', function(err, results) {
        if (err) throw err;
        let depArr = [];
        results.forEach((result) => {
          depArr.push(`${result.id} - ${result.name}`)
        })
      // }) 
    inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What role would you like to add?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?"
      },
      {
        name: "dept_choice",
        type: "list",
        message: "Choose an existing department",
        choices: depArr
      },
    ])
    .then(function(answer) {
      switch (answer.dept_choice) {
      case "Add new department":
        addDept()
        // connection.query('INSERT INTO role (title, salary, department_id) VALUES ? ? ?', answers.dept_name,  function(err, results) {
        //   if (err) throw err;
        //   const table = cTable.getTable(allDepts(results))
        //   console.log(table);
        //   console.log(`${answers.title} added to the list of roles.`)
        // }) 
        // startPrompts();
        break;

      case "Choose an existing department":
        allDepts()
        break;
      }})
    // .then(answers => {
    //   connection.query('INSERT INTO role (title, salary, department_id) VALUES ? ? ?', answers.dept_name,  function(err, results) {
    //     if (err) throw err;
    //     const table = cTable.getTable(allDepts(results))
    //     console.log(table);
    //     console.log(`${answers.title} added to the list of roles.`)
    //   }) 
    //   startPrompts();
    // })
  })
}

  // function empByDept() {
  //   onsole.log("Displaying all the departments...")
  //   connection.query('SELECT * FROM department', function(err, results) {
  //     if (err) throw err;
  //     const table = cTable.getTable(results)
      // console.log(table);
  //     startPrompts();
  // }

  // function deptSearch() {
  //   console.log("Seaching for employee by department...")
  //   inquirer.prompt([
  //       { 
  //       message: "What department are you looking for?",
  //       name: "artist",
  //       }
  //   ]).then(answer => {
  //       connection.query(
  //           'SELECT position, artist, song, year FROM top5000  WHERE ?', 
  //       {
  //           artist: answer.artist
  //       }, 
  //       (err, results) => {
  //           if(err) throw err
  //           const table = cTable.getTable(results)
      // console.log(table);
  //           initialPrompts()
  //       })
  //   })
  // }

  