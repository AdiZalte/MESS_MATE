package aditya_zalte.Mess_Mate_backend.config;

import aditya_zalte.Mess_Mate_backend.model.Admin;
import aditya_zalte.Mess_Mate_backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String email;

    @Value("${admin.password}")
    private String password;

    @Override
    public void run(String... args) {

        if (adminRepository.findByEmail(email).isEmpty()) {

            Admin admin = new Admin();

            admin.setEmail(email);
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setActive(true);

            adminRepository.save(admin);
        }
    }
}