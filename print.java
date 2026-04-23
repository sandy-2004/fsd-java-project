import java.nio.file.*;
public class print {
    public static void main(String... a) throws Exception {
        Files.readAllLines(Paths.get("compile_out.txt")).forEach(System.out::println);
    }
}
