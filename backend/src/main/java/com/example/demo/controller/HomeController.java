package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")  // 主页路径映射到根路径
public class HomeController {

    @GetMapping
    public String home() {
        return "Hello, World!";
    }
}