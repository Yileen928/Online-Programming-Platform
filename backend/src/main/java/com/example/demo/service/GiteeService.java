package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.demo.model.Repository;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;
import org.springframework.core.ParameterizedTypeReference;
import java.util.stream.Collectors;

@Service
@Component
public class GiteeService {
    private static final Logger log = LoggerFactory.getLogger(GiteeService.class);
    private static final String GITEE_API_URL = "https://gitee.com/api/v5";
    private String token;
    private final RestTemplate restTemplate;

    public GiteeService() {
        this.restTemplate = new RestTemplate();
    }

    public void saveToken(String token) {
        log.info("Saving Gitee token");
        this.token = token;
        // 验证token
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                GITEE_API_URL + "/user",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {}
            );
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Token验证失败");
            }
            log.info("Gitee token validated successfully");
        } catch (Exception e) {
            log.error("Failed to validate Gitee token: {}", e.getMessage());
            throw new RuntimeException("Gitee token验证失败: " + e.getMessage());
        }
    }

    public List<Repository> listRepositories(int page, int perPage) {
        try {
            log.info("Fetching Gitee repositories. Page: {}, Per page: {}", page, perPage);
            if (token == null) {
                throw new RuntimeException("请先连接Gitee");
            }

            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            String url = String.format("%s/user/repos?page=%d&per_page=%d&sort=full_name", 
                GITEE_API_URL, page, perPage);
            
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            List<Map<String, Object>> repoList = response.getBody();
            if (repoList == null) {
                return new ArrayList<>();
            }

            @SuppressWarnings("unchecked")
            List<Repository> repositories = repoList.stream().map(repo -> {
                Repository repository = new Repository();
                repository.setId(String.valueOf(repo.get("id")));
                repository.setName((String) repo.get("full_name"));
                repository.setDescription((String) repo.get("description"));
                repository.setUrl((String) repo.get("html_url"));
                repository.setPrivate((Boolean) repo.get("private"));
                Map<String, Object> owner = (Map<String, Object>) repo.get("owner");
                repository.setOwner((String) owner.get("login"));
                repository.setFork((Boolean) repo.get("fork"));
                return repository;
            }).collect(Collectors.toList());

            return repositories;
        } catch (Exception e) {
            log.error("Failed to list Gitee repositories: {}", e.getMessage());
            throw new RuntimeException("获取Gitee仓库列表失败: " + e.getMessage());
        }
    }

    public void importRepository(String repoId) {
        try {
            if (token == null) {
                throw new RuntimeException("请先连接Gitee");
            }
            
            // 获取仓库详情
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            String url = String.format("%s/repositories/%s", GITEE_API_URL, repoId);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            Map<String, Object> repoInfo = response.getBody();
            if (repoInfo == null) {
                throw new RuntimeException("无法获取仓库信息");
            }
            String cloneUrl = (String) repoInfo.get("clone_url");
            
            // TODO: 实现克隆仓库的逻辑
            log.info("Importing Gitee repository: {} ({})", repoInfo.get("full_name"), cloneUrl);
            
        } catch (Exception e) {
            log.error("Failed to import Gitee repository: {}", e.getMessage());
            throw new RuntimeException("导入Gitee仓库失败: " + e.getMessage());
        }
    }

    public int getTotalRepositoryCount() {
        try {
            if (token == null) {
                throw new RuntimeException("请先连接Gitee");
            }

            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // 获取用户所有仓库数量
            String url = String.format("%s/user/repos?per_page=1", GITEE_API_URL);
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            
            // 从响应头中获取总数
            String totalCount = response.getHeaders().getFirst("total_count");
            return totalCount != null ? Integer.parseInt(totalCount) : 0;
            
        } catch (Exception e) {
            log.error("Failed to get total repository count: {}", e.getMessage());
            throw new RuntimeException("获取仓库总数失败: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "token " + token);
        return headers;
    }
} 