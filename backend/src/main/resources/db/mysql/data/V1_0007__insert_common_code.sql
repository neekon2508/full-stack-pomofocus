INSERT INTO common_group_code (common_group_code, common_group_name) VALUES 
('LANG_CD', 'System Language'),
('UI_BTN', 'UI Button');

INSERT INTO common_code (common_group_code, common_code, common_code_name, message_key, sort_order) VALUES 
('LANG_CD', 'vi', 'Vietnamese', 'lang.vietnamese', 1),
('LANG_CD', 'en', 'English', 'lang.english', 2);

INSERT INTO common_code (common_group_code, common_code, common_code_name, message_key, sort_order, optional_value_key1) VALUES 
('UI_BTN', 'SAVE', 'Save', 'btn.common.save', 1, 'blue'),
('UI_BTN', 'EDIT', 'Edit', 'btn.common.edit', 2, 'orange');