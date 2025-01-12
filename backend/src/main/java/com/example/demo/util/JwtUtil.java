package com.example.demo.util;

import com.example.demo.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "your_secret_key_your_secret_key_your_secret_key"; // 最少256位 (32字符以上)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10小时

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 生成 JWT Token
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        return createToken(claims, user.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims) // 设置自定义字段
                .setSubject(subject) // 设置主体，比如用户名
                .setIssuedAt(new Date()) // 签发时间
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 设置过期时间
                .signWith(key, SignatureAlgorithm.HS256) // 设置密钥和签名算法
                .compact();
    }

    // 验证和解析 JWT Token
    public Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key) // 设置密钥
                    .build()
                    .parseClaimsJws(token) // 解析 Token
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("JWT Token 无效或已过期");
        }
    }

    // 从 Token 中提取用户名
    public String extractUsername(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }

    // 检查 Token 是否过期
    public boolean isTokenExpired(String token) {
        Claims claims = validateToken(token);
        return claims.getExpiration().before(new Date());
    }
}