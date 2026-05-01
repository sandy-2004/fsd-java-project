import java.nio.file.*;
import java.util.stream.*;

public class print2 {
    public static void main(String... a) throws Exception {
        Files.readAllLines(Paths.get("compile_out.txt"))
             .stream()
             .filter(line -> line.contains("[ERROR]"))
             .forEach(System.out::println);
    }
}
