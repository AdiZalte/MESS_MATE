package aditya_zalte.Mess_Mate_backend.controller;

import aditya_zalte.Mess_Mate_backend.dto.AdminLoginDto;
import aditya_zalte.Mess_Mate_backend.service.AdminAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @Valid @RequestBody AdminLoginDto dto
    ) {
        return ResponseEntity.ok(
                adminAuthService.login(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );
    }
}