package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // 对应数据库表名
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自增主键
    private Long id;

    @Column(nullable = false, unique = true) // 用户名不能为空，唯一
    private String username;

    @Column(nullable = false) // 密码不能为空
    private String password;

    @Column(nullable = true) // 邮箱可以为空
    private String email;

    @Column(nullable = true) // 用户的角色或权限字段
    private String role;

    // 默认构造函数
    public User() {
    }

    // 带参数的构造函数
    public User(String username, String password, String email, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}