package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.model.RegisterRequest;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
// import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

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
        log.info("Attempting to verify user: {}", username);
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            log.warn("User not found: {}", username);
            return null;
        }
        
        // 直接比较密码
        if (user.getPassword().equals(password)) {
            log.info("Login successful for user: {}", username);
            return user;
        }
        
        log.warn("Password mismatch for user: {}", username);
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
        user.setPassword(request.getPassword());  // 直接设置密码，不加密

        return userRepository.save(user);
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

        user.setPassword(newPassword);  // 直接设置新密码，不加密
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
