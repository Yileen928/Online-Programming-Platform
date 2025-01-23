package com.example.demo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.GitHubTokenRequest;
import com.example.demo.model.ApiResponse;
import com.example.demo.service.GitHubService;
import com.example.demo.model.Repository;
import java.util.List;
import com.example.demo.model.CreateRepoRequest;

@RestController
@RequestMapping("/api/github")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GitHubController {
    private static final Logger log = LoggerFactory.getLogger(GitHubController.class);

    @Autowired
    private GitHubService gitHubService;

    @PostMapping("/connect")
    public ResponseEntity<?> connectGitHub(@RequestBody GitHubTokenRequest request) {
        try {
            log.info("Received GitHub connect request");
            gitHubService.saveToken(request.getToken());
            log.info("Successfully connected to GitHub");
            return ResponseEntity.ok(new ApiResponse(true, "GitHub连接成功"));
        } catch (Exception e) {
            log.error("Failed to connect to GitHub: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/repos")
    public ResponseEntity<?> listRepositories(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "30") int per_page
    ) {
        try {
            log.info("Received request to fetch GitHub repositories. Page: {}, Per page: {}", page, per_page);
            List<Repository> repos = gitHubService.listRepositories(page, per_page);
            int total = gitHubService.getTotalRepositoryCount();
            
            HttpHeaders headers = new HttpHeaders();
            headers.add("X-Total-Count", String.valueOf(total));
            headers.add("Access-Control-Expose-Headers", "X-Total-Count");
            
            log.info("Successfully fetched {}/{} repositories", repos.size(), total);
            return ResponseEntity.ok()
                .headers(headers)
                .body(repos);
        } catch (Exception e) {
            log.error("Failed to list repositories: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/repos")
    public ResponseEntity<?> createRepository(@RequestBody CreateRepoRequest request) {
        try {
            log.info("Creating GitHub repository: {}", request.getName());
            Repository repo = gitHubService.createRepository(request);
            log.info("Successfully created GitHub repository: {}", repo.getName());
            return ResponseEntity.ok(repo);
        } catch (Exception e) {
            log.error("Failed to create GitHub repository: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
} 