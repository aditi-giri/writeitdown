package com.aditi.journal.utils;

import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class KeyDerivationUtil {

    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;

    public static SecretKey deriveKey(String password, String base64Salt) {
        try {
            byte[] salt = Base64.getDecoder().decode(base64Salt);

            PBEKeySpec spec = new PBEKeySpec(
                    password.toCharArray(),
                    salt,
                    ITERATIONS,
                    KEY_LENGTH
            );

            SecretKeyFactory factory =
                    SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

            byte[] keyBytes = factory.generateSecret(spec).getEncoded();

            return new SecretKeySpec(keyBytes, "AES");

        } catch (Exception e) {
            throw new RuntimeException("Key derivation failed");
        }
    }
}
