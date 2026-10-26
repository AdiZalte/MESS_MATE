package aditya_zalte.Mess_Mate_backend.service;

import aditya_zalte.Mess_Mate_backend.dto.AuthResponseDto;
import aditya_zalte.Mess_Mate_backend.dto.LoginDto;
import aditya_zalte.Mess_Mate_backend.dto.RegisterMessOwnerDto;
import aditya_zalte.Mess_Mate_backend.exception.EmailAlreadyExistsException;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.repository.MessOwnerRepository;
import aditya_zalte.Mess_Mate_backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MessOwnerRepository messOwnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterMessOwnerDto dto) {
        if (messOwnerRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("An account with this email already exists");
        }

        MessOwner owner = new MessOwner();
        owner.setName(dto.getName());
        owner.setEmail(dto.getEmail());
        owner.setPhoneNumber(dto.getPhoneNumber());
        owner.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        owner.setIsActive(true);

        messOwnerRepository.save(owner);
    }

    public AuthResponseDto login(LoginDto dto) {
        MessOwner owner = messOwnerRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), owner.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(owner.getId(), "ROLE_OWNER");

        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setMessOwnerId(owner.getId());
        response.setName(owner.getName());
        response.setEmail(owner.getEmail());

        return response;
    }
}