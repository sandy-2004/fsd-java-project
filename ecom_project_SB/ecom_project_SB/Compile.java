import java.nio.file.*;
import java.nio.charset.*;
import java.util.*;

public class Compile {
    public static void main(String[] args) throws Exception {
        ProcessBuilder pb = new ProcessBuilder("cmd", "/c", ".\\mvnw.cmd", "clean", "compile");
        pb.directory(new java.io.File("."));
        pb.redirectErrorStream(true);
        Process p = pb.start();
        byte[] out = p.getInputStream().readAllBytes();
        p.waitFor();
        String output = new String(out, Charset.defaultCharset());
        for (String line : output.split("\\r?\\n")) {
            if (line.contains("[ERROR]") || line.contains("error:") || line.contains("cannot find symbol")) {
                System.out.println(line);
            }
        }
        System.out.println("EXIT CODE: " + p.exitValue());
    }
}
