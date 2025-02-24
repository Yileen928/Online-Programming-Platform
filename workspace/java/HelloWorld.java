// 一个简单的测试程序
public class HelloWorld {
    public static void main(String[] args) {
        // 打印基本信息
        System.out.println("=== Java Environment Test ===");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Java Home: " + System.getProperty("java.home"));
        
        // 测试计算
        testCalculation();
        
        // 测试数组
        testArray();
    }
    
    private static void testCalculation() {
        System.out.println("\n=== Calculation Test ===");
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum of 1 to 10: " + sum);
    }
    
    private static void testArray() {
        System.out.println("\n=== Array Test ===");
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Array elements:");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}