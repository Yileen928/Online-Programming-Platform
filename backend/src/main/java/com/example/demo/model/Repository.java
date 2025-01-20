package com.example.demo.model;

import lombok.Data;

@Data
public class Repository {
    private String id;
    private String name;
    private String description;
    private String url;
    private boolean isPrivate;
    private String owner;
    private boolean isFork;
    private boolean isStarred;
    private boolean isWatched;
    private String type;

    public boolean isFork() {
        return isFork;
    }

    public void setFork(boolean fork) {
        isFork = fork;
    }

    public boolean isStarred() {
        return isStarred;
    }

    public void setStarred(boolean starred) {
        isStarred = starred;
    }

    public boolean isWatched() {
        return isWatched;
    }

    public void setWatched(boolean watched) {
        isWatched = watched;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
} 