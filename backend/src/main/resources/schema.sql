-- 创建用户表（如果不存在）
CREATE TABLE IF NOT EXISTS public.users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    email character varying(255),
    role character varying(255),
    PRIMARY KEY (id)
);

-- 添加序列生成器（如果不存在）
CREATE SEQUENCE IF NOT EXISTS users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 设置 id 默认使用序列
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

-- 插入管理员用户（如果不存在）
INSERT INTO users (username, password, role)
SELECT 'admin', '2023101', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
); 