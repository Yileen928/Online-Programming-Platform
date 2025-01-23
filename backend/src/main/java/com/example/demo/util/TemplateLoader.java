package com.example.demo.util;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class TemplateLoader {
    private final Map<String, String> templates = new HashMap<>();

    public TemplateLoader() {
        // 初始化模板
        templates.put("python", "def main():\n    print('Hello, World!')\n\nif __name__ == '__main__':\n    main()");
        templates.put("java", "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}");
        templates.put("c", "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}");
    }

    public String loadTemplate(String templateName) {
        return templates.getOrDefault(templateName, "// Start coding here");
    }
} 