package com.example.model;

import lombok.Data;

@Data
public class CreateRepoRequest {
    private String name;
    private String description;
} 