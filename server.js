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
          "exit"        
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View all employees":
          showAll();
          break;
  
        // case "View employees by department":
          // deptSearch();
          // break;
  
        case "View all roles":
          allRoles();
          break;
  
        // case "Search for a specific song":
        //   songSearch();
        //   break;
  
        case "exit":
          connection.end();
          break;
        }
      });
  }
  
  function showAll() {
    console.log("Searching for all employees...")
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;
      console.table(results)
      startPrompts();
  });
  }

  function allRoles() {
    console.log("Grabbing all the roles...")
    connection.query('SELECT id AS "ID", title AS "Title", salary AS "Salary" FROM role', function(err, results) {
      if (err) throw err;
      console.table(results)
      startPrompts();
  });
  }

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
  //           console.table(results)
  //           initialPrompts()
  //       })
  //   })
  // }

  