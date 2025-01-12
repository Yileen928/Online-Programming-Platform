package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.model.RegisterRequest;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 注入 EmailService，用于发送邮件
    @Autowired
    private EmailService emailService;

    /**
     * 验证用户的用户名和密码。
     *
     * @param username 用户名
     * @param password 密码
     * @return 如果验证通过，返回对应的用户对象；否则返回 null
     */
    public User verifyUser(String username, String password) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {  // 使用 PasswordEncoder 的 matches 方法
            return user;
        }
        return null;
    }

    /**
     * 注册用户逻辑（创建新用户）。
     *
     * @param request 注册请求对象，包含用户名、邮箱和密码
     * @return 创建的用户
     */
    public User registerUser(RegisterRequest request) {
        // 检查用户名和邮箱是否已存在
        if (existsByUsername(request.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        if (existsByEmail(request.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // 根据需要设置其他字段，如角色、创建时间等

        return userRepository.save(user); // 保存用户到数据库
    }

    /**
     * 根据用户名查询用户。
     *
     * @param username 用户名
     * @return 对应的用户
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);  // 如果用户不存在返回 null
    }

    /**
     * 更新用户信息。
     *
     * @param user 用户对象（带有更新后的数据）
     * @return 更新后的用户信息
     */
    public User updateUser(User user) {
        return userRepository.save(user); // 使用 JPA 的 save 方法
    }

    /**
     * 检查用户名是否存在。
     *
     * @param username 用户名
     * @return 如果用户名存在，返回 true；否则返回 false
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * 检查邮箱是否存在。
     *
     * @param email 邮箱
     * @return 如果邮箱存在，返回 true；否则返回 false
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * 创建用户逻辑（基于 RegisterRequest）。
     *
     * @param request 注册请求对象，包含用户名、邮箱和密码
     */
    public void createUser(RegisterRequest request) {
        // 使用 registerUser 方法来避免重复代码
        registerUser(request);
    }

    /**
     * 发送密码重置邮件。
     *
     * @param email 用户的邮箱
     */
    public void sendPasswordResetEmail(String email) {
        // 生成重置令牌
        String token = generateResetToken();

        // 查找用户
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 保存令牌到数据库
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // 发送重置邮件
        emailService.sendPasswordResetEmail(email, token);
    }

    /**
     * 生成密码重置令牌。
     *
     * @return 重置令牌
     */
    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    /**
     * 重置用户密码。
     *
     * @param token       重置令牌
     * @param newPassword 新密码
     */
    public void resetPassword(String token, String newPassword) {
        // 查找用户
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("无效的重置令牌"));

        // 检查令牌是否过期
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("重置令牌已过期");
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null); // 清除令牌
        user.setResetTokenExpiry(null); // 清除过期时间
        userRepository.save(user);
    }
}
