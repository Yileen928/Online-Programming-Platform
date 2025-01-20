package com.example.demo.model;

import lombok.Data;

@Data
public class CreateRepoRequest {
    private String name;
    private String description;
} 