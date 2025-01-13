package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    
    @PostMapping("/update-passwords")
    public ResponseEntity<?> updatePasswords() {
        log.info("Password update process skipped - no encryption needed");
        return ResponseEntity.ok().build();
    }
} 