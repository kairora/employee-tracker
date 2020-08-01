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

        // case "Add a role":
          // empByDept();
          // break;

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


  function addDept() {
    inquirer
    .prompt([
      {
        name: "dept_name",
        type: "input",
        message: "What department would you like to add? "
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

  