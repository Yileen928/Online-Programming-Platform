package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 验证用户的用户名和密码。
     *
     * @param username 用户名
     * @param password 密码
     * @return 如果验证通过，返回对应的用户对象；否则返回 null
     */
    public User verifyUser(String username, String password) {
        User user = userRepository.findByUsername(username)
            .orElse(null);
        if (user != null && user.getPassword().equals(password)) {  // 暂时直接比较密码
            return user;
        }
        return null;
    }

    /**
     * 注册用户逻辑（创建新用户）。
     *
     * @param user 用户对象
     * @return 创建的用户
     */
    public User registerUser(User user) {
        // 对用户的密码进行加密
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user); // 保存用户到数据库
    }

    /**
     * 根据用户名查询用户。
     *
     * @param username 用户名
     * @return 对应的用户
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElse(null);  // 如果用户不存在返回 null
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
}
