DROP DATABASE IF EXISTS Teamdb;
CREATE DATABASE Teamdb;
USE Teamdb;


CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    department VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(8),
    department_id INT, 
    PRIMARY KEY(id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT NULL, 
    PRIMARY KEY(id)
);

INSERT INTO departments (department) values ('Human Resources'); -- 1
INSERT INTO departments (department) values ('Production'); --  2
INSERT INTO departments (department) values ('Finances'); --  3

INSERT INTO roles (title, salary, department_id) values ('Property Manager',70000.00,1); -- 1
INSERT INTO roles (title, salary, department_id) values ('Human Resource Manager',60000.00,1); -- 2
INSERT INTO roles (title, salary, department_id) values ('Security',35000.00,1); -- 3
INSERT INTO roles (title, salary, department_id) values ('Reception',35000.00,1); -- 4
INSERT INTO roles (title, salary, department_id) values ('Business Lawyer',70000.00,1); -- 5
INSERT INTO roles (title, salary, department_id) values ('Editor',45000.00,2); -- 6
INSERT INTO roles (title, salary, department_id) values ('Accountant',65000.00,3); -- 7

INSERT INTO employees (first_name, last_name, role_id) values ('Rachel','Levy',1); -- no manager
INSERT INTO employees (first_name, last_name, role_id) values ('Alex','Bailon',2); -- no manager
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ('Jessica','Ripes',3,1); -- manager is property manager 
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ('Michael','Bevente',3,1); -- manager is property manager 
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ('Christian','Kendler',4,2); -- manager is human resource manager 
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ('Joe','Rangel',5,2); -- manager is human resources 
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ('Bianca','Marinescu',6,2); -- manager is human resources 
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ('Kale','Stark',6,2); -- manager is human resources 
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ('Mack','Friday',7,2); -- manager is human resources 