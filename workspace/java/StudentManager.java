import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class StudentManager {
    private List<Student> students;
    private static final String FILE_PATH = "students.txt";

    public StudentManager() {
        this.students = new ArrayList<>();
    }

    // 添加学生
    public void addStudent(Student student) {
        students.add(student);
    }

    // 根据ID查找学生
    public Student findById(String id) {
        return students.stream()
                      .filter(s -> s.getId().equals(id))
                      .findFirst()
                      .orElse(null);
    }

    // 保存到文件
    public void saveToFile() {
        try (PrintWriter writer = new PrintWriter(new FileWriter(FILE_PATH))) {
            for (Student student : students) {
                writer.println(String.format("%s,%d,%s", 
                    student.getName(), 
                    student.getAge(), 
                    student.getId()));
            }
            System.out.println("Students saved to file successfully!");
        } catch (IOException e) {
            System.out.println("Error saving to file: " + e.getMessage());
        }
    }

    // 从文件加载
    public void loadFromFile() {
        students.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 3) {
                    students.add(new Student(
                        parts[0], 
                        Integer.parseInt(parts[1]), 
                        parts[2]));
                }
            }
            System.out.println("Students loaded from file successfully!");
        } catch (IOException e) {
            System.out.println("Error loading from file: " + e.getMessage());
        }
    }

    // 显示所有学生
    public void displayAllStudents() {
        if (students.isEmpty()) {
            System.out.println("No students found.");
            return;
        }
        System.out.println("\n=== All Students ===");
        students.forEach(System.out::println);
    }
}