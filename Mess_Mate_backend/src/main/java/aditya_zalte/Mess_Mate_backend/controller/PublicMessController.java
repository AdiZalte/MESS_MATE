package aditya_zalte.Mess_Mate_backend.controller;

import aditya_zalte.Mess_Mate_backend.dto.MessDetailsResponseDto;
import aditya_zalte.Mess_Mate_backend.dto.MessResponseDto;
import aditya_zalte.Mess_Mate_backend.service.MessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messes")
@RequiredArgsConstructor
public class PublicMessController {

    private final MessService messService;

    @GetMapping
    public ResponseEntity<List<MessResponseDto>> getVerifiedMesses() {
        return ResponseEntity.ok(messService.getVerifiedMesses());
    }

    @GetMapping("/{messId}")
    public ResponseEntity<MessDetailsResponseDto> getMessDetails(
            @PathVariable String messId
    ) {
        return ResponseEntity.ok(
                messService.getMessDetails(messId)
        );
    }
}