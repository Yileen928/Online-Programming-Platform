public class StudentManagerTest {
    public static void main(String[] args) {
        StudentManager manager = new StudentManager();

        // 添加学生
        manager.addStudent(new Student("Alice", 20, "001"));
        manager.addStudent(new Student("Bob", 21, "002"));
        manager.addStudent(new Student("Charlie", 19, "003"));

        // 显示所有学生
        System.out.println("Initial students:");
        manager.displayAllStudents();

        // 保存到文件
        manager.saveToFile();

        // 清空并从文件加载
        manager = new StudentManager();
        manager.loadFromFile();

        // 显示加载的学生
        System.out.println("\nStudents loaded from file:");
        manager.displayAllStudents();

        // 查找学生
        String searchId = "002";
        Student found = manager.findById(searchId);
        System.out.println("\nSearching for student with ID " + searchId + ":");
        System.out.println(found != null ? found : "Student not found");
    }
}