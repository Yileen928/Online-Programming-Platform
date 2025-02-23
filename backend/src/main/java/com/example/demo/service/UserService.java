package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.model.RegisterRequest;
import com.example.demo.model.ChangePasswordRequest;
import com.example.demo.model.UserProfileRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.FileRepository;
import com.example.demo.repository.UserAvatarRepository;
import com.example.demo.entity.UserAvatar;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
// import java.util.List;
import java.util.UUID;
import java.io.IOException;

@Service
@Transactional
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserAvatarRepository userAvatarRepository;

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
        emailService.sendResetPasswordEmail(email, token);
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

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public String login(String username, String password) {
        User user = verifyUser(username, password);
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        return jwtUtil.generateToken(user.getId(), user.getUsername());
    }

    public User getUserById(String id) {
        User user = userRepository.findById(Long.parseLong(id))
            .orElseThrow(() -> new RuntimeException("用户不存在"));
            
        // 如果有头像ID，检查文件是否存在
        if (user.getAvatarId() != null) {
            boolean fileExists = fileRepository.existsById(user.getAvatarId());
            if (!fileExists) {
                // 如果文件不存在，清除头像ID
                user.setAvatarId(null);
                userRepository.save(user);
            }
        }
        
        return user;
    }

    private void validatePassword(String password) {
        // 密码长度检查
        if (password.length() < 8 || password.length() > 16) {
            throw new RuntimeException("密码长度必须在8-16位之间");
        }
        
        // 使用正则表达式检查密码复杂度
        String pattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$";
        if (!password.matches(pattern)) {
            throw new RuntimeException("密码必须包含字母、数字和特殊字符");
        }
    }

    @Transactional
    public boolean changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUserById(userId.toString());
        
        // 验证旧密码
        if (!user.getPassword().equals(request.getOldPassword())) {
            throw new RuntimeException("当前密码错误");
        }
        
        // 验证新密码
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("两次输入的新密码不一致");
        }
        
        // 验证密码复杂度
        validatePassword(request.getNewPassword());
        
        // 更新密码
        user.setPassword(request.getNewPassword());
        userRepository.save(user);
        
        // 记录日志
        log.info("用户 {} 修改了密码", user.getUsername());
        
        return true;
    }

    @Transactional
    public void updateProfile(Long userId, UserProfileRequest request) {
        User user = getUserById(userId.toString());
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 检查新邮箱是否为空
        if (request.getEmail() == null) {
            throw new RuntimeException("邮箱不能为空");
        }

        // 如果新邮箱与当前邮箱不同，检查是否已被使用
        String currentEmail = user.getEmail();
        if (currentEmail == null || !currentEmail.equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("该邮箱已被使用");
            }
        }

        user.setEmail(request.getEmail());
        userRepository.save(user);
    }

    @Transactional
    public User updateAvatar(Long userId, MultipartFile file) throws IOException {
        log.info("开始更新用户头像: userId={}", userId);
        
        // 验证文件
        validateFile(file);
        
        // 获取用户
        User user = getUserById(userId.toString());
        
        try {
            // 删除旧头像
            userAvatarRepository.deleteByUserId(userId);
            
            // 创建新头像
            UserAvatar avatar = new UserAvatar();
            avatar.setUserId(userId);
            avatar.setFilename(file.getOriginalFilename());
            avatar.setContentType(file.getContentType());
            avatar.setData(file.getBytes());
            avatar.setFileSize(file.getSize());
            avatar.setUploadTime(LocalDateTime.now());
            
            // 保存到MongoDB
            UserAvatar savedAvatar = userAvatarRepository.save(avatar);
            log.info("头像已保存: avatarId={}, userId={}, size={}", 
                savedAvatar.getId(), userId, savedAvatar.getFileSize());
            
            return user;
        } catch (Exception e) {
            log.error("头像更新失败: userId={}, error={}", userId, e.getMessage());
            throw new RuntimeException("头像更新失败: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("只支持图片文件");
        }
        
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new RuntimeException("图片大小不能超过2MB");
        }
    }
}
