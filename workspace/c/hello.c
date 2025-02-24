#include <stdio.h>

int main() {
    printf("=== C Environment Test ===\n");
    printf("Hello from C in Docker!\n");
    
    // 测试基本数据类型
    int number = 42;
    float pi = 3.14159;
    printf("\nNumber: %d\n", number);
    printf("Pi: %.2f\n", pi);
    
    return 0;
}