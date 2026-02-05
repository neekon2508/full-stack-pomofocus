CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 1 COMMENT '1: Active, 0: Locked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id BIGINT PRIMARY KEY,
    pomo_duration INT DEFAULT 25,
    short_break_duration INT DEFAULT 5,
    long_break_duration INT DEFAULT 15,
    auto_start_breaks BOOLEAN DEFAULT FALSE,
    alarm_sound VARCHAR(50) DEFAULT 'bell.mp3',
    theme_color VARCHAR(20) DEFAULT 'red',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
-- 2. NHÓM BUSINESS: TASKS & SESSIONS
-- ==========================================================

CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    note TEXT,
    est_pomodoros INT DEFAULT 1 COMMENT 'Số lượng pomo dự kiến',
    act_pomodoros INT DEFAULT 0 COMMENT 'Số lượng pomo đã làm',
    is_completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_task_status (user_id, is_completed) 
);

CREATE TABLE IF NOT EXISTS pomo_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    session_type ENUM('WORK', 'SHORT_BREAK', 'LONG_BREAK') NOT NULL,
    duration_seconds INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
-- 3. NHÓM SECURITY (RBAC)
-- ==========================================================

CREATE TABLE IF NOT EXISTS sys_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_code VARCHAR(20) NOT NULL UNIQUE COMMENT 'ADMIN, USER, PREMIUM',
    role_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES sys_roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sys_apis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    api_name VARCHAR(100),
    api_url VARCHAR(255) NOT NULL,
    api_method ENUM('GET', 'POST', 'PUT', 'DELETE') NOT NULL,
    api_code VARCHAR(50) UNIQUE -- VD: TASK_DELETE
);

CREATE TABLE IF NOT EXISTS sys_role_api (
    role_id BIGINT NOT NULL,
    api_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, api_id),
    FOREIGN KEY (role_id) REFERENCES sys_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (api_id) REFERENCES sys_apis(id) ON DELETE CASCADE
);

-- ==========================================================
-- 4. NHÓM UI: DYNAMIC MENU
-- ==========================================================

-- CREATE TABLE IF NOT EXISTS sys_menus (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     parent_id BIGINT NULL,
--     title VARCHAR(50) NOT NULL,
--     path VARCHAR(100),
--     icon VARCHAR(50),
--     sort_order INT DEFAULT 0,
--     is_hidden BOOLEAN DEFAULT FALSE,
--     FOREIGN KEY (parent_id) REFERENCES sys_menus(id) ON DELETE SET NULL
-- );

-- CREATE TABLE IF NOT EXISTS sys_menu_role (
--     menu_id BIGINT NOT NULL,
--     role_id BIGINT NOT NULL,
--     PRIMARY KEY (menu_id, role_id),
--     FOREIGN KEY (menu_id) REFERENCES sys_menus(id) ON DELETE CASCADE,
--     FOREIGN KEY (role_id) REFERENCES sys_roles(id) ON DELETE CASCADE
-- );