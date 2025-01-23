package com.example.demo.service;

import org.kohsuke.github.*;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import com.example.demo.model.Repository;
import com.example.demo.model.CreateRepoRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
// import java.util.Map;
import java.util.LinkedHashSet;
// import org.kohsuke.github.GHMyself.RepositoryListFilter;
// import org.kohsuke.github.GHPermissionType;

@Service
@Component
public class GitHubService {
    private static final Logger log = LoggerFactory.getLogger(GitHubService.class);
    private GitHub github;
    private String token;

    public void saveToken(String token) {
        try {
            log.info("Saving GitHub token");
            this.token = token;
            github = new GitHubBuilder().withOAuthToken(token).build();
            github.checkApiUrlValidity();
            log.info("GitHub token validated successfully");
        } catch (IOException e) {
            log.error("Failed to validate GitHub token: {}", e.getMessage(), e);
            throw new RuntimeException("GitHub token 验证失败: " + e.getMessage());
        }
    }

    public List<Repository> listRepositories(int page, int perPage) {
        try {
            log.info("=== Start fetching repositories ===");
            if (github == null && token != null) {
                github = new GitHubBuilder().withOAuthToken(token).build();
            }
            if (github == null) {
                throw new RuntimeException("请先连接GitHub");
            }

            // 获取用户信息
            GHMyself myself = github.getMyself();
            log.info("Current user: {}", myself.getLogin());

            // 获取所有仓库
            List<GHRepository> allRepos = new ArrayList<>();
            
            // 1. 获取所有可访问的仓库（包括私有的和协作的）
            log.info("Fetching all accessible repositories...");
            PagedIterable<GHRepository> repos = myself.listRepositories()
                .withPageSize(100);
            allRepos.addAll(repos.toList());
            
            // 2. 获取组织的仓库
            log.info("Fetching organization repositories...");
            for (GHOrganization org : myself.getAllOrganizations()) {
                log.info("Fetching repositories for organization: {}", org.getLogin());
                allRepos.addAll(org.listRepositories().toList());
            }

            // 去重
            allRepos = new ArrayList<>(new LinkedHashSet<>(allRepos));
            
            log.info("=== Repository Details ===");
            for (GHRepository repo : allRepos) {
                String repoType = repo.getOwnerName().equals(myself.getLogin()) ? "owner" : 
                                "collaborator";
                
                log.info("Found repo: {} ({}) [{}]",
                    repo.getFullName(),
                    repo.isPrivate() ? "private" : "public",
                    repoType);
            }
            
            // 转换所有仓库为 Repository 对象
            List<Repository> allRepositories = allRepos.stream()
                .map(ghRepo -> {
                    try {
                        Repository repo = convertToRepository(ghRepo);
                        return repo;
                    } catch (IOException e) {
                        log.error("Failed to convert repository: {}", ghRepo.getFullName(), e);
                        return null;
                    }
                })
                .filter(repo -> repo != null)
                .collect(Collectors.toList());

            // 手动进行分页
            int totalCount = allRepositories.size();
            int start = (page - 1) * perPage;
            int end = Math.min(start + perPage, totalCount);

            log.info("Pagination: total={}, page={}, perPage={}, start={}, end={}", 
                totalCount, page, perPage, start, end);

            List<Repository> pagedResult = start < totalCount ?
                allRepositories.subList(start, end) :
                new ArrayList<>();

            log.info("Returning {} repositories for page {} (total: {})", 
                pagedResult.size(), page, totalCount);
            return pagedResult;

        } catch (IOException e) {
            log.error("Failed to list repositories: {}", e.getMessage(), e);
            throw new RuntimeException("获取仓库列表失败: " + e.getMessage());
        }
    }

    public Repository createRepository(CreateRepoRequest request) {
        try {
            if (github == null) {
                throw new RuntimeException("请先连接GitHub");
            }

            log.info("Creating repository with params: name={}, description={}, private={}", 
                request.getName(), request.getDescription(), request.isPrivate());

            GHCreateRepositoryBuilder builder = github.createRepository(request.getName());
            
            // 设置描述（如果有）
            if (request.getDescription() != null) {
                builder.description(request.getDescription());
            }
            
            // 明确设置可见性
            builder.private_(request.isPrivate());
            
            // 创建仓库
            GHRepository ghRepo = builder.create();
            
            log.info("Repository created: {} (private: {})", 
                ghRepo.getFullName(), ghRepo.isPrivate());

            // 转换为响应对象
            Repository repo = new Repository();
            repo.setId(String.valueOf(ghRepo.getId()));
            repo.setName(ghRepo.getFullName());
            repo.setDescription(ghRepo.getDescription());
            repo.setUrl(ghRepo.getHtmlUrl().toString());
            repo.setPrivate(ghRepo.isPrivate());
            repo.setOwner(ghRepo.getOwnerName());
            repo.setFork(false);
            
            return repo;
        } catch (IOException e) {
            log.error("Failed to create repository: {}", e.getMessage(), e);
            throw new RuntimeException("创建仓库失败: " + e.getMessage());
        }
    }

    public void importRepository(String repoId) {
        try {
            if (github == null) {
                throw new RuntimeException("请先连接GitHub");
            }
            // TODO: 实现导入逻辑
            log.info("Importing repository: {}", repoId);
        } catch (Exception e) {
            log.error("Failed to import repository", e);
            throw new RuntimeException("导入仓库失败: " + e.getMessage());
        }
    }

    private Repository convertToRepository(GHRepository ghRepo) throws IOException {
        Repository repo = new Repository();
        repo.setId(String.valueOf(ghRepo.getId()));
        repo.setName(ghRepo.getFullName());
        repo.setDescription(ghRepo.getDescription());
        repo.setUrl(ghRepo.getHtmlUrl().toString());
        repo.setPrivate(ghRepo.isPrivate());
        repo.setOwner(ghRepo.getOwnerName());
        repo.setFork(ghRepo.isFork());
        repo.setType(ghRepo.getOwnerName().equals(github.getMyself().getLogin()) ? "owner" : "collaborator");
        return repo;
    }

    public int getTotalRepositoryCount() throws IOException {
        if (github == null) {
            throw new RuntimeException("请先连接GitHub");
        }
        
        // 获取用户信息
        GHMyself myself = github.getMyself();
        
        // 获取所有仓库（包括个人仓库、组织仓库和协作仓库）
        List<GHRepository> allRepos = new ArrayList<>();
        
        // 1. 获取个人仓库
        allRepos.addAll(myself.listRepositories().toList());
        
        // 2. 获取组织仓库
        for (GHOrganization org : myself.getAllOrganizations()) {
            allRepos.addAll(org.listRepositories().toList());
        }
        
        // 3. 获取协作仓库
        allRepos.addAll(myself.getRepositories().values());
        
        // 去重并返回总数
        return new LinkedHashSet<>(allRepos).size();
    }
} 