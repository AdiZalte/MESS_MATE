package aditya_zalte.Mess_Mate_backend.controller;

import aditya_zalte.Mess_Mate_backend.dto.DailyMenuResponseDto;
import aditya_zalte.Mess_Mate_backend.dto.DailyMenuUpsertDto;
import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.repository.MessRepository;
import aditya_zalte.Mess_Mate_backend.service.DailyMenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/menu")
@RequiredArgsConstructor
public class DailyMenuController {

    private final DailyMenuService dailyMenuService;
    private final MessRepository messRepository;

    @PutMapping("/day")
    public ResponseEntity<Void> upsertOneDay(
            @Valid @RequestBody DailyMenuUpsertDto dto,
            @AuthenticationPrincipal MessOwner owner
    ) {
        Mess mess = messRepository.findByOwnerId(owner.getId())
                .orElseThrow(() -> new IllegalStateException("No mess registered"));

        dailyMenuService.upsertOneDay(dto, mess);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/days")
    public ResponseEntity<List<DailyMenuResponseDto>> getWeek(
            @AuthenticationPrincipal MessOwner owner
    ) {
        return ResponseEntity.ok(dailyMenuService.getWeek(owner));
    }
}