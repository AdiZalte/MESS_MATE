package aditya_zalte.Mess_Mate_backend.service;


import aditya_zalte.Mess_Mate_backend.model.Admin;
import aditya_zalte.Mess_Mate_backend.repository.AdminRepository;
import aditya_zalte.Mess_Mate_backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String login(String email, String password) {

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!admin.isEnabled()) {
            throw new BadCredentialsException("Admin account is disabled");
        }

        return jwtUtil.generateToken(
                admin.getId(),
                "ROLE_ADMIN"
        );
    }
}