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
-- 4. NHÓM i18n
-- ==========================================================


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
-- 1. Bảng language
CREATE TABLE language (
    lang_cd       VARCHAR(10)   NOT NULL COMMENT 'Mã ngôn ngữ (vi, en)',
    lang_nm       VARCHAR(100)  NOT NULL COMMENT 'Tên ngôn ngữ hiển thị',
    is_active     TINYINT(1)    NOT NULL DEFAULT 1,
    sort_order    INT           NOT NULL DEFAULT 0,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lang_cd)
);

INSERT INTO language (lang_cd, lang_nm, sort_order) VALUES
    ('vi',  'VN',   1),
    ('en',  'English',  2),

-- 2. Bảng message_key
CREATE TABLE message_key (
    msg_key_id    BIGINT        NOT NULL AUTO_INCREMENT COMMENT 'Surrogate PK',
    msg_ctn       VARCHAR(200)  NOT NULL COMMENT 'i18n key (vd: common.button.save)',
    module_nm     VARCHAR(100)  NULL     COMMENT 'Module sở hữu key (common, area-region...)',
    description   VARCHAR(500)  NULL     COMMENT 'Ghi chú cho translator',
    is_active     TINYINT(1)    NOT NULL DEFAULT 1,
    frst_rgst_id  VARCHAR(50)   NULL,
    frst_rgst_dt  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_mdfy_id  VARCHAR(50)   NULL,
    last_mdfy_dt  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (msg_key_id),
    UNIQUE KEY uq_msg_ctn (msg_ctn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Master table cho tất cả i18n key';


-- 3. Bảng message_translation
CREATE TABLE message_translation (
    msg_key_id    BIGINT        NOT NULL COMMENT 'FK -> message_key',
    lang_cd       VARCHAR(10)   NOT NULL COMMENT 'FK -> language',
    msg_txt_ctn   TEXT          NOT NULL COMMENT 'Nội dung đã dịch',
    frst_rgst_id  VARCHAR(50)   NULL,
    frst_rgst_dt  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_mdfy_id  VARCHAR(50)   NULL,
    last_mdfy_dt  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (msg_key_id, lang_cd),
    CONSTRAINT fk_mt_key  FOREIGN KEY (msg_key_id) REFERENCES message_key (msg_key_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_mt_lang FOREIGN KEY (lang_cd)    REFERENCES language (lang_cd)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_mt_lang (lang_cd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Nội dung dịch theo ngôn ngữ';


-- 4. View tiện lợi cho Service layer
CREATE OR REPLACE VIEW v_message AS
SELECT
    mk.msg_key_id,
    mk.msg_ctn,
    mk.module_nm,
    mt.lang_cd,
    mt.msg_txt_ctn,
    mt.frst_rgst_id,
    mt.frst_rgst_dt,
    mt.last_mdfy_id,
    mt.last_mdfy_dt
FROM message_key mk
INNER JOIN message_translation mt ON mk.msg_key_id = mt.msg_key_id
WHERE mk.is_active = 1;