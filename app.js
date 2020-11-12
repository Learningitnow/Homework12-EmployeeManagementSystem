const inquirer = require("inquirer");
const mysql= require("mysql");
const cTable = require('console.table');

// use this wrapper to create promise around mysql
class Database {
    constructor(config) {
      this.connection = mysql.createConnection(config);
    }
    query(sql, args = []) {
      return new Promise((resolve, reject) => {
        this.connection.query(sql, args, (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
    }
    close() {
      return new Promise((resolve, reject) => {
        this.connection.end((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  }



const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "Teamdb"
  });


async function main() {

    // Main menu selection for different options
    mainMenu = await inquirer.prompt([
        {
            name: 'options',
            type: 'list',
            message: 'Welcome to the Employee Management System',
            choices: [ 
                "View departments",
                "View roles", 
                "View employees",
                "Add a department",
                "Add a role",
                "Add an employee", 
                "Remove department",
                "Remove role", 
                "Remove employee"              
                 
            ]
        }
    ])
    choice = mainMenu.options;

    if(choice == "View departments") {

        // Getting all departments from database to show user
        const showDepartments = await db.query('SELECT department FROM departments')
        console.table(showDepartments)
    }


////////////////////////////    
    if(choice == "View roles") {

        // Getting role info and the departments they belongs in for all roles to show user
        const showRoles = await db.query(
            'SELECT roles.title, roles.salary, departments.department FROM roles, departments WHERE roles.department_id = departments.id ORDER BY departments.department'
            )
        console.table(showRoles)
    }

////////////////////////////////
    if(choice == "View employees") {

    // Getting all employees with their role info to show user
    const showEmployees = await db.query(
        'SELECT employees.first_name, employees.last_name, roles.title, roles.salary FROM employees, roles WHERE employees.role_id = roles.id ORDER BY roles.title'
        )
    console.table(showEmployees)
    }

    if(choice == "Add a department") {
        promptAnswers = await inquirer.prompt([
            {
                name: 'department',
                message: 'What is the name of the new department?'
            }
        ])

        // Inserting new department into database
        await db.query('INSERT INTO departments (department) VALUES (?)', [promptAnswers.department])

        // Feedback to user
        console.log(`\n Added the new department called: ${promptAnswers.department} \n`)
    }

    if(choice == "Add a role") {
        const showDepartments = await db.query('SELECT department FROM departments')
        
        promptAnswers = await inquirer.prompt([
            {
                name: 'role',
                message: 'What is the new role called?'
            },
            {
                name: 'salary',
                message: 'What is the starting salary of the new role?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'What department does the new role belong in?',
                choices: showDepartments.map(departments => departments.department)
            }
        ])
        // Getting correct department id from database 
        const departmentId = await db.query('SELECT id FROM departments WHERE department = ?', [promptAnswers.department])

        // Inserting new role into database
        await db.query('INSERT INTO roles (title, salary, id) VALUES (?,?,?)', [promptAnswers.role, promptAnswers.salary, departmentId[0].department_id])

        // Feedback to user
        console.log(`\n Added the new role with these values: \n Role name: ${promptAnswers.role} \n Salary: ${promptAnswers.salary} \n Department: ${promptAnswers.department} \n`)
    }

    if(choice == "Add an employee") {

        // Selecting manager names and role titles from database for the user to make a choice
 
        const showRoles = await db.query('SELECT title FROM roles ')

        promptAnswers = await inquirer.prompt([
            {
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            {
                name: 'lastName',
                message: "What is the employee's last name"
            },
            {
                name: 'role',
                type: 'list',
                message: "What will be the employee's role?",
                choices: showRoles.map(roles => roles.title)
            },
          
        ])

        // Getting correct role id and manager id from database
        const roleId = await db.query('SELECT id FROM roles WHERE title = ?', [promptAnswers.role])
        
        // Inserting new employee into database
        await db.query( 
            'INSERT INTO employees (first_name, last_name, role_id) VALUES (?,?,?)', [promptAnswers.firstName, promptAnswers.lastName, roleId[0].role_id]
        )
        
        // Feedback to user
        console.log(`\n Added ${promptAnswers.firstName} ${promptAnswers.lastName} to employee list. \n`)
    }

    if(choice == "Remove department") {

        // Getting department names for user selection
        const showDepartments = await db.query('SELECT department FROM departments')

        promptAnswers = await inquirer.prompt([
            {
                name: 'department',
                type: 'list',
                message: 'Which department do you want to remove?',
                choices: showDepartments.map(department => department.department)
            }
        ])

        // Deleting selected department from database
        await db.query('DELETE FROM departments WHERE department = ?', [promptAnswers.department])

        // Feedback to user
        console.log(`\n Removed department: ${promptAnswers.department} \n`)
    }

    if(choice == "Remove role") {

        // Getting employee names for user selection
        const showRoles = await db.query('SELECT title FROM roles ')

        promptAnswers = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                message: 'What role are you removing?',
                choices: showRoles.map(roles => roles.title)
            }
        ])
        role = promptAnswers.role

        // Deleting role from database
        await db.query('DELETE FROM roles WHERE title = ?', [role])

        // Feedback to user
        console.log(`\n Removed role: ${role}. \n`)
    }

    if(choice == "Remove employee") {

        // Getting employee names for user selection
        const showEmployees = await db.query('SELECT first_name FROM employees')

        promptAnswers = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to fire?',
                choices: showEmployees.map(employees => employees.first_name)
            }
        ])

        // Deleting selected employee from database
        await db.query('DELETE FROM employees WHERE first_name = ?', [promptAnswers.employee])

        // Feedback to user
        console.log(`\n  ${promptAnswers.employee} has been removed. \n`)
    }

   
    main()

}

main();