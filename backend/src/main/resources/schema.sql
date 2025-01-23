-- 创建用户表（如果不存在）
CREATE TABLE IF NOT EXISTS public.users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    email character varying(255),
    role character varying(255),
    created_at timestamp,
    reset_token character varying(255),
    reset_token_expiry timestamp,
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
DELETE FROM users WHERE username = 'admin';
INSERT INTO users (username, password, role)
VALUES ('admin', '2023101', 'ADMIN');

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id bigint NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255),
    template varchar(255) NOT NULL,
    is_public boolean DEFAULT false,
    user_id bigint NOT NULL,
    created_at timestamp,
    CONSTRAINT pk_projects PRIMARY KEY (id),
    CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 添加项目ID序列
CREATE SEQUENCE IF NOT EXISTS projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 设置项目ID默认使用序列
ALTER TABLE projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq');