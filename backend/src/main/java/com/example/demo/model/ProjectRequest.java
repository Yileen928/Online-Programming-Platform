package com.example.demo.model;

import lombok.Data;

@Data
public class ProjectRequest {
    private String name;
    private String template;
    private boolean isPublic;
} 