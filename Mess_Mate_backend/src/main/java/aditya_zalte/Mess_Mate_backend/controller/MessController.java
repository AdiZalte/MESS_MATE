package aditya_zalte.Mess_Mate_backend.controller;

import aditya_zalte.Mess_Mate_backend.dto.CreateMessDto;
import aditya_zalte.Mess_Mate_backend.dto.MessResponseDto;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.service.MessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner/mess")
@RequiredArgsConstructor
public class MessController {

    private final MessService messService;

    @PostMapping
    public ResponseEntity<Void> createMess(
            @Valid @RequestBody CreateMessDto dto,
            @AuthenticationPrincipal MessOwner owner
    ) {
        messService.createMess(dto, owner);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<MessResponseDto> getMyMess(@AuthenticationPrincipal MessOwner owner) {
        return ResponseEntity.ok(messService.getMyMess(owner));
    }
}