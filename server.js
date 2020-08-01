var mysql = require("mysql");
var inquirer = require("inquirer");

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
          "Update an employee manager"
                   
        ]
      })
      
  }