package aditya_zalte.Mess_Mate_backend.controller;

import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/messes/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Optional<Mess>> getPendingMesses() {
        return ResponseEntity.ok(adminService.getPendingMesses());
    }

    @PutMapping("/messes/{messId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> verifyMess(
            @PathVariable String messId
    ) {
        adminService.verifyMess(messId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/messes/{messId}/unverify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unverifyMess(
            @PathVariable String messId
    ) {
        adminService.unverifyMess(messId);
        return ResponseEntity.ok().build();
    }
}

