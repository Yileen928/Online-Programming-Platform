package com.example.demo.dto;

import lombok.Data;

@Data
public class ProjectCreateRequest {
    private String name;
    private String description;
    private String template;
    private boolean isPublic;
} 