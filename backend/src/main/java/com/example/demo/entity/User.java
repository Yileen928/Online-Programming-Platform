package com.example.demo.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String role;
    private String resetToken;
    private LocalDateTime resetTokenExpiry;
    
    // 头像相关字段
    @Column(name = "avatar_id")
    private String avatarId;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "avatar_updated_at")
    private LocalDateTime avatarUpdatedAt;
} 