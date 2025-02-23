package com.example.demo.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class CreateRepoRequest {
    private String name;
    private String description;
    
    @JsonProperty("private")
    private boolean isPrivate;
} 