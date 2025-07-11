-- 创建用户表（如果不存在）
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(255),
    avatar VARCHAR(255),  -- 存储头像URL或路径
    avatar_updated_at TIMESTAMP  -- 记录头像更新时间
);

-- 创建项目表（如果不存在）
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    creator_id BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT fk_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

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

-- 添加项目表的序列
CREATE SEQUENCE IF NOT EXISTS projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 设置项目表的 id 默认使用序列
ALTER TABLE projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq');

CREATE TABLE IF NOT EXISTS project_files (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(50),
    content TEXT,
    project_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 确保users表有avatar和avatar_updated_at字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_updated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS avatar_file_id VARCHAR(255); 