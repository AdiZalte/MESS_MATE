package aditya_zalte.Mess_Mate_backend.controller;

import aditya_zalte.Mess_Mate_backend.dto.AdminMessDto;
import aditya_zalte.Mess_Mate_backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/messes")
    public ResponseEntity<List<AdminMessDto>> getMesses(
            @RequestParam(defaultValue = "pending") String status
    ) {
        return ResponseEntity.ok(adminService.getMesses(status));
    }

    @PutMapping("/messes/{messId}/verify")
    public ResponseEntity<AdminMessDto> verify(@PathVariable String messId) {
        return ResponseEntity.ok(adminService.setVerified(messId, true));
    }

    @PutMapping("/messes/{messId}/unverify")
    public ResponseEntity<AdminMessDto> unverify(@PathVariable String messId) {
        return ResponseEntity.ok(adminService.setVerified(messId, false));
    }

    @DeleteMapping("/messes/{messId}")
    public ResponseEntity<Void> delete(@PathVariable String messId) {
        adminService.deleteMess(messId);
        return ResponseEntity.noContent().build();
    }
}