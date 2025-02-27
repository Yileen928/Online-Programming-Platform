FROM python:3.9

WORKDIR /app

# 设置中文支持
ENV LANG C.UTF-8

# 配置 pip，使用 HTTP 而不是 HTTPS
RUN pip config set global.index-url http://mirrors.aliyun.com/pypi/simple/ \
    && pip config set global.trusted-host mirrors.aliyun.com \
    && pip config set global.timeout 1000 \
    && pip config set global.disable-pip-version-check true

# 先升级 pip（禁用 SSL 验证）
RUN pip install --trusted-host mirrors.aliyun.com --no-cache-dir --upgrade pip

# 安装基本包（禁用 SSL 验证）
RUN pip install --trusted-host mirrors.aliyun.com --no-cache-dir numpy \
    && pip install --trusted-host mirrors.aliyun.com --no-cache-dir pandas \
    && pip install --trusted-host mirrors.aliyun.com --no-cache-dir requests \
    && pip install --trusted-host mirrors.aliyun.com --no-cache-dir flask

# 清理缓存
RUN pip cache purge 