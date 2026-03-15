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

-- ==========================================================
-- 4. NHÓM i18n
-- ==========================================================

CREATE TABLE common_group_code (
    common_group_code VARCHAR(20) NOT NULL COMMENT 'Ma nhom: LANG_CD',
    common_group_name VARCHAR(200) NOT NULL COMMENT 'Ten nhom',
    use_yn CHAR(1) DEFAULT 'Y' COMMENT 'Trang thai su dung (Y/N)',
    PRIMARY KEY (common_group_code)
);

CREATE TABLE common_code (
    common_group_code VARCHAR(20) NOT NULL COMMENT 'FK tu bang nhom ma',
    common_code VARCHAR(20) NOT NULL COMMENT 'Ma chi tiet (vi,en)',
    common_code_name VARCHAR(100) NOT NULL COMMENT 'Ten hien thi mac dinh',
    message_key VARCHAR(200) NOT NULL COMMENT 'i18n key',
    common_code_description VARCHAR (500) NULL COMMENT 'Mo ta chi tiet ma',
    upper_common_code VARCHAR(20) NULL COMMENT 'Ma cha (neu co phan cap)',
    sort_order INT DEFAULT 0 COMMENT 'Thu tu sap xep',
    use_yn CHAR(1) DEFAULT 'Y',
    optional_value_key1 VARCHAR(500),
    optional_value_key2 VARCHAR(500),
    optional_value_key3 VARCHAR(500),
    PRIMARY KEY (common_group_code, common_code),
    CONSTRAINT fk_common_group FOREIGN KEY (common_group_code) REFERENCES common_group_code (common_group_code) ON DELETE CASCADE
);

CREATE TABLE message_translation (
    message_key   VARCHAR(200)        NOT NULL COMMENT 'FK -> message_key',
    lang_code       VARCHAR(10)   NOT NULL COMMENT 'FK -> language',
    message_text   TEXT          NOT NULL COMMENT 'Nội dung đã dịch',
    optional_value_key1 VARCHAR(500),
    optional_value_key2 VARCHAR(500),
    optional_value_key3 VARCHAR(500),
    PRIMARY KEY (message_key, lang_code),
    INDEX idx_message_lang (lang_code)
);
-- 4. View tiện lợi cho Service layer
-- CREATE OR REPLACE VIEW v_message AS
-- SELECT
--     mk.msg_key_id,
--     mk.msg_ctn,
--     mk.module_nm,
--     mt.lang_cd,
--     mt.msg_txt_ctn,
--     mt.frst_rgst_id,
--     mt.frst_rgst_dt,
--     mt.last_mdfy_id,
--     mt.last_mdfy_dt
-- FROM message_key mk
-- INNER JOIN message_translation mt ON mk.msg_key_id = mt.msg_key_id
-- WHERE mk.is_active = 1;