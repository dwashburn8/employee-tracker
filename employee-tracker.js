const mysql = require("mysql");
const cTable = require("console.table")
const inquirer = require("inquirer")


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Dash8118",
    database: "employee_summary"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");

});

const logConsole= () => {
    console.log(` 
    .########.##.....##.########..##........#######..##....##.########.########....##.....##....###....##....##....###.....######...########.########.
    .##.......###...###.##.....##.##.......##.....##..##..##..##.......##..........###...###...##.##...###...##...##.##...##....##..##.......##.....##
    .##.......####.####.##.....##.##.......##.....##...####...##.......##..........####.####..##...##..####..##..##...##..##........##.......##.....##
    .######...##.###.##.########..##.......##.....##....##....######...######......##.###.##.##.....##.##.##.##.##.....##.##...####.######...########.
    .##.......##.....##.##........##.......##.....##....##....##.......##..........##.....##.#########.##..####.#########.##....##..##.......##...##..
    .##.......##.....##.##........##.......##.....##....##....##.......##..........##.....##.##.....##.##...###.##.....##.##....##..##.......##....##.
    .########.##.....##.##........########..#######.....##....########.########....##.....##.##.....##.##....##.##.....##..######...########.##.....##`);
    
}

const askQuestions = () => {
    inquirer
        .prompt({
            name: "firstQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Role", "Update Manager", "View Employee By Manager", "Delete Department", "Delete Role", "Delete Employee", "View Budget for Each Department"]
        }).then((answer) => {
            switch (answer.firstQuestion) {
                case "Add Department":
                    createDepartment();
                    break;

                case "Add Role":
                    createRole();
                    break;

                case "Add Employee":
                    createEmployee();
                    break;

                case "View Departments":
                    viewDepartments();
                    break;

                case "View Roles":
                    viewRoles();
                    break;

                case "View Employees":
                    viewEmployees();
                    break;

                case "Update Employee Role":
                    updateRole();
                    break;

                case "Update Manager":
                    break;

                case "View Employee By Manager":
                    viewEmployeeByManager()
                    break;

                case "Delete Department":
                    break;

                case "Delete Role":
                    break;

                case "Delete Employee":
                    deleteEmployee()
                    break;

                case "View Budget for Each Department":
                    break;
            }
        })
}

const createDepartment = () => {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What is the name of the department you would you like to add?"
            }
        ]).then((answer) => {
            const sqlQuery = "INSERT INTO department SET ?";
            const params = {
                department_name: answer.department
            };

            connection.query(sqlQuery, params, (err, res) => {
                if (err) throw err;
                // console.log(res);
                askQuestions()
            })
        })

};

const createRole = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
       const myDepartments= res.map(function(dep){
           return ({name:dep.department_name, value:dep.id})
       })
    
    inquirer
        .prompt([
            {
            name: "title",
            type: "input",
            message: "What is the title of the roll you would like to add?"
        },
            {
                name: "salary",
                type: "input",
                message: "What is the salary?"
            },
            {
                name: "department_id",
                type: "list",
                message: "What department does this role belong to?",
                choices: myDepartments
            }
            ]).then((answer) => {
                const sqlQuery = "INSERT INTO role SET ?";
                const params = {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id
                };


                connection.query(sqlQuery, params, (err, res) => {
                    if (err) throw err;
                    // console.log(res);
                    askQuestions()
                })
            })
        })  
};

const createEmployee = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
       const myRoles= res.map(function(itm){
           return ({name:itm.title, value:itm.id})
       })
       connection.query("SELECT * FROM employee", (error, result) => {
        if (error) throw error;
       const myEmployees= result.map(function(emp){
           return ({name:`${emp.first_name} ${emp.last_name}`, value:emp.id})
       })
       myEmployees.unshift({
           name:"None",

           value: null
       })
    //    console.log(myEmployees);
       
   
    inquirer
        .prompt([
            {
            name: "first_name",
            type: "input",
            message: "What is the employees first name?"
        },
            {
                name: "last_name",
                type: "input",
                message: "What is the employees last name?"
            },
            {
                name: "role_id",
                type: "list",
                message: "What role does this employee have?",
                choices: myRoles
            },
            {
                name: "manager_id",
                type: "list",
                message: "Who is the employees manager",
                choices: myEmployees
            }

        ]).then((answer) => {
            const sqlQuery = "INSERT INTO employee SET ?";

            // if(answer.manager_id === "None"){
                
            //     return null;
            // }
            const params = {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id
            };

            connection.query(sqlQuery, params, (err, res) => {
                if (err) throw err;
                // console.log(res);
                askQuestions()
            })
        })
    })
})

};

const viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res)
        console.log(table);
        askQuestions()
    })



}

const viewRoles = () => {
    connection.query("SELECT * FROM role INNER JOIN department ON role.department_id = department.id", (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res)
        console.log(table);
        askQuestions();
    })


}

const viewEmployees = () => {
    connection.query(`SELECT first_name, last_name, title, salary, department_name FROM employee, role, department WHERE employee.role_id = role.id AND role.department_id = department.id`, (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res)
        console.log(table);
        askQuestions();
    })


}

const updateRole = () => {
    connection.query("SELECT * FROM employee", (error, result) => {
        if (error) throw error;
       const myEmployees= result.map(function(emp){
           return ({name:`${emp.first_name} ${emp.last_name}`, value:emp.id})
       })
       connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
       const myRoles= res.map(function(itm){
           return ({name:itm.title, value:itm.id})
       })

    inquirer
        .prompt([
            {
            name: "employeeList",
            type: "list",
            message: "What employee would you like to update?",
            choices: myEmployees
        },
            {
                name: "roleList",
                type: "list",
                message: "What role would you like to give to this employee?",
                choices: myRoles
            }
            ]).then((answer) => {
                const sqlQuery = "UPDATE employee SET ? WHERE ?";
                const params = [{ role_id: answer.roleList }, { first_name: answer.employeeList }];

                connection.query(sqlQuery, params, (err, res) => {
                    if (err) throw err;
                    console.log(res);
                    askQuestions()
                })
            })
    
        }) 
    })
}


const viewEmployeeByManager = () => {
    connection.query(`SELECT manager_id, first_name, last_name, title, salary, department_name FROM employee, role, department WHERE employee.role_id = role.id AND role.department_id = department.id ORDER BY manager_id DESC`, (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res)
        console.log(table);
        askQuestions();
    })
}

const deleteEmployee = () => {
    connection.query("SELECT * FROM employee", (error, result) => {
        if (error) throw error;
       const myEmployees= result.map(function(emp){
           return ({name:`${emp.first_name} ${emp.last_name}`, value:emp.id})
       })
       inquirer
        .prompt([
            {
            name: "erasedEmployee",
            type: "list",
            message: "What employee would you like to delete?",
            choices: myEmployees
        }
            ]).then((answer) => {
                const sqlQuery = `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = ${answer.erasedEmployee}`;

                connection.query(sqlQuery, (err, res) => {
                    if (err) throw err;
                    console.log(res);
                    askQuestions()
                })
            })
        })
}

logConsole()
askQuestions()


