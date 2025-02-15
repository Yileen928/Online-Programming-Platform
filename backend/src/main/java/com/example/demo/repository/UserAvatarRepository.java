package com.example.demo.repository;

import com.example.demo.entity.UserAvatar;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserAvatarRepository extends MongoRepository<UserAvatar, String> {
    Optional<UserAvatar> findByUserId(Long userId);
    void deleteByUserId(Long userId);
} 