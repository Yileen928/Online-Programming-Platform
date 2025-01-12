package com.example.demo.service;

import com.example.demo.model.User;
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
        // 从数据库通过用户名获取用户
        User user = getUserByUsername(username);
        if (user == null) {
            return null; // 用户不存在
        }

        // 验证密码
        boolean isPasswordValid = passwordEncoder.matches(password, user.getPassword());
        return isPasswordValid ? user : null; // 如果密码正确，返回用户，否则返回 null
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
        return userRepository.findByUsername(username);
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
