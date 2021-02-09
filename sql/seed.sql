USE employee_trackerDB;

INSERT INTO
    department (department)
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
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Johnnie", 'Simpson',1, 3),
    ("Amir", 'Ashtiany',2, 1),
    ("Gabe", 'Johnson', 3, null),
    ("Rachael", 'Wanke', 4, 3),
    ("Michael", "Brown", 1, null),
    ("Bobby", "Jackson", 2, null);

