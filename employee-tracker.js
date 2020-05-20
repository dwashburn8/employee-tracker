const mysql = require("mysql");
const cTable = require("console.table")
const inquirer = require("inquirer")
let departmentArray = ["Web Development"];
let roleArray = ["Manager"];
let managerArray = ["Dallas Washburn"];
let employeeArray = ["Ashlyn Washburn"];

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
                    break;

                case "Delete Department":
                    break;

                case "Delete Role":
                    break;

                case "Delete Employee":
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
                name: answer.department
            };
            let arr = answer.department;
            departmentArray.push(arr);
            connection.query(sqlQuery, params, (err, res) => {
                if (err) throw err;
                // console.log(res);
            })
        }).then(() => {

            askQuestions()
        })

};

const createRole = () => {
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
                choices: departmentArray
            }
            ]).then((answer) => {
                const sqlQuery = "INSERT INTO role SET ?";
                const params = {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id
                };
                let arr = answer.title;
                roleArray.push(arr);

                connection.query(sqlQuery, params, (err, res) => {
                    if (err) throw err;
                    // console.log(res);
                })
            }).then(() => {

                askQuestions()
            })
};

const createEmployee = () => {
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
                choices: roleArray
            },
            {
                name: "manager_id",
                type: "list",
                message: "Who is the employees manager",
                choices: ["None"]
            }

        ]).then((answer) => {
            const sqlQuery = "INSERT INTO employee SET ?";

            if(answer.manager_id === "None"){
                let id = 0
                return id;
            }
            const params = {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: id
            };
            let arr = answer.first_name + " " + answer.last_name;
            employeeArray.push(arr);
            connection.query(sqlQuery, params, (err, res) => {
                if (err) throw err;
                // console.log(res);
            })
        }).then(() => {

            askQuestions()
        })

};

const viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res)
        console.log(table);
    })

    askQuestions()


}

const viewRoles = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res)
        console.log(table);
    })

    askQuestions();

}

const viewEmployees = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res)
        console.log(table);
    })

    askQuestions();

}

const updateRole = () => {
    inquirer
        .prompt([
            {
            name: "employeeList",
            type: "list",
            message: "What employee would you like to update?",
            choices: employeeArray
        },
            {
                name: "roleList",
                type: "list",
                message: "What role would you like to give to this employee?",
                choices: roleArray
            }
            ]).then((answer) => {
                const sqlQuery = "UPDATE employee SET ? WHERE ?";
                const params = [{ role: answer.roleList }, { first_name: answer.employeeList }];

                connection.query(sqlQuery, params, (err, res) => {
                    if (err) throw err;
                    console.log(res);
                })
            }).then(() => {

                askQuestions()
            })

}

askQuestions()