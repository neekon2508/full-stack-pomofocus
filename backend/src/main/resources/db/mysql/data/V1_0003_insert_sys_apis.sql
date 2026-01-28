INSERT INTO sys_api (api_name, api_url, api_method, api_code) 
VALUES
('View Task List', '/api/tasks', 'GET', 'TASK_VIEW'),
('Create Task', '/api/tasks', 'POST', 'TASK_CREATE'),
('Delete Task', '/api/tasks/*', 'DELETE', 'TASK_DELETE');