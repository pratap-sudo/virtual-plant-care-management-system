package com.plantcare;

import org.junit.jupiter.api.Test;
import java.lang.reflect.Method;

public class TestRunner {
    public static void main(String[] args) {
        System.out.println("============================================================");
        System.out.println("🌿 VIRTUAL PLANT CARE - OOP DEMONSTRATION TESTS");
        System.out.println("============================================================");

        int passed = 0;
        int failed = 0;
        OopDemonstrationTest test = new OopDemonstrationTest();

        for (Method m : OopDemonstrationTest.class.getDeclaredMethods()) {
            if (m.isAnnotationPresent(Test.class)) {
                try {
                    System.out.println("\n[RUNNING] " + m.getName());
                    m.setAccessible(true);
                    m.invoke(test);
                    System.out.println("[RESULT] -> SUCCESS");
                    passed++;
                } catch (Throwable t) {
                    System.err.println("[RESULT] -> FAILED");
                    Throwable cause = t.getCause() != null ? t.getCause() : t;
                    cause.printStackTrace();
                    failed++;
                }
            }
        }

        System.out.println("\n============================================================");
        System.out.println("SUMMARY: " + passed + " PASSED, " + failed + " FAILED");
        System.out.println("============================================================");

        if (failed > 0) {
            System.exit(1);
        }
    }
}

