package com.aditi.journal.utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import java.util.Base64;

public class EncryptionUtil {

    private static final String ALGORITHM = "AES";

    // 🔒 Encrypt plain text
    public static String encrypt(String plainText, SecretKey key) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed");
        }
    }

    // 🔓 Decrypt cipher text
    public static String decrypt(String encryptedText, SecretKey key) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
            return new String(cipher.doFinal(decodedBytes));
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed");
        }
    }
}
