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

-- 插入测试用户（如果不存在）
INSERT INTO users (username, password, role)
SELECT 'test1', '123456', 'USER'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'test1'
);

INSERT INTO users (username, password, role)
SELECT 'test2', '123456', 'USER'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'test2'
);


-- 插入管理员用户（如果不存在）
INSERT INTO users (username, password, role)
SELECT 'admin', '2023101', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id bigint NOT NULL,
    name varchar(255) NOT NULL,
    template varchar(255) NOT NULL,
    is_public boolean DEFAULT true,
    created_at timestamp,
    updated_at timestamp,
    creator_id bigint NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- 添加项目表的序列
CREATE SEQUENCE IF NOT EXISTS projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 设置项目表的 id 默认使用序列
ALTER TABLE projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'); 