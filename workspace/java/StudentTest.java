import java.util.ArrayList;
import java.util.List;

public class StudentTest {
    public static void main(String[] args) {
        // 创建学生列表
        List<Student> students = new ArrayList<>();
        
        // 添加一些学生
        students.add(new Student("Alice", 20, "001"));
        students.add(new Student("Bob", 21, "002"));
        students.add(new Student("Charlie", 19, "003"));

        // 打印所有学生信息
        System.out.println("=== Student List ===");
        for (Student student : students) {
            System.out.println(student);
        }

        // 查找年龄大于20的学生
        System.out.println("\n=== Students over 20 ===");
        students.stream()
               .filter(s -> s.getAge() > 20)
               .forEach(System.out::println);
    }
}