USE employee_trackerDB;

INSERT INTO
    department (name)
VALUES
    ('Engineer'),
    ('Sales'),
    ('Finance'),
    ('Legal');


    

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 2),
    ('Salesperson', 80000, 2),
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4);



INSERT INTO
    employee (first_name, last_name)
VALUES
    ("Johnnie", 'Simpson'),
    ("Amir", 'Ashtiany'),
    ("Gabe", 'Johnson'),
    ("Rachael", 'Wanke');