//src/main/java/com/example/demo/
//├── DemoApplication.java                # 主类，位于顶层包
//├── config/
//│   └── SecurityConfig.java             # 配置类，定义了 PasswordEncoder Bean
//│   └──WebConfig.java
//├── controller/
//│   └── login/
//│       └── LoginControl.java           # 控制器，处理用户登录
//├── model/
//│   └── User.java                       # 实体类，映射数据库表
//├── repository/
//│   └── UserRepository.java             # JPA 仓库，用于数据库操作
//├── service/
//│   └── UserService.java                # 服务层，包含用户注册和验证逻辑
//└── util/
//    └── JwtUtil.java                    # JWT 工具类，用于生成和验证 Token