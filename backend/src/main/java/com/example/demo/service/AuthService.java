package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public String login(String username, String password) {
        log.debug("Looking up user: {}", username);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 直接比较明文密码
        if (!password.equals(user.getPassword())) {
            log.debug("Password mismatch for user: {}", username);
            throw new RuntimeException("密码错误");
        }

        log.debug("Generating token for user: {}", username);
        String token = jwtTokenProvider.createToken(user);
        log.debug("Token generated successfully");
        return token;
    }
} 