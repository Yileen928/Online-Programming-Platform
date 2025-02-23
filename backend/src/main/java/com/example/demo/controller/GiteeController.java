package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.ApiResponse;
import com.example.demo.service.GiteeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import com.example.demo.model.Repository;
import com.example.demo.model.CreateRepoRequest;

@RestController
@RequestMapping("/api/gitee")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GiteeController {
    private static final Logger log = LoggerFactory.getLogger(GiteeController.class);

    @Autowired
    private GiteeService giteeService;

    @PostMapping("/connect")
    public ResponseEntity<?> connectGitee(@RequestBody Map<String, String> request) {
        try {
            log.info("Received Gitee connect request");
            giteeService.saveToken(request.get("token"));
            log.info("Successfully connected to Gitee");
            return ResponseEntity.ok(new ApiResponse(true, "Gitee连接成功"));
        } catch (Exception e) {
            log.error("Failed to connect to Gitee: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/repos")
    public ResponseEntity<?> listRepositories(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "30") int per_page
    ) {
        try {
            List<Repository> repos = giteeService.listRepositories(page, per_page);
            int total = giteeService.getTotalRepositoryCount();
            
            HttpHeaders headers = new HttpHeaders();
            headers.add("X-Total-Count", String.valueOf(total));
            headers.add("Access-Control-Expose-Headers", "X-Total-Count");
            
            log.info("Successfully fetched {}/{} repositories", repos.size(), total);
            return ResponseEntity.ok()
                .headers(headers)
                .body(repos);
        } catch (Exception e) {
            log.error("Failed to list repositories: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/import/{repoId}")
    public ResponseEntity<?> importRepository(@PathVariable String repoId) {
        try {
            log.info("Importing Gitee repository: {}", repoId);
            giteeService.importRepository(repoId);
            return ResponseEntity.ok(new ApiResponse(true, "仓库导入成功"));
        } catch (Exception e) {
            log.error("Failed to import Gitee repository: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/repos")
    public ResponseEntity<?> createRepository(@RequestBody CreateRepoRequest request) {
        try {
            log.info("Creating Gitee repository: {}", request.getName());
            Repository repo = giteeService.createRepository(request);
            log.info("Successfully created Gitee repository: {}", repo.getName());
            return ResponseEntity.ok(repo);
        } catch (Exception e) {
            log.error("Failed to create Gitee repository: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
} 