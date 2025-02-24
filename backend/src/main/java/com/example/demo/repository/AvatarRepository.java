package com.example.demo.repository;

import com.example.demo.entity.Avatar;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AvatarRepository extends MongoRepository<Avatar, String> {
    Optional<Avatar> findByUserId(Long userId);
    void deleteByUserId(Long userId);
} 