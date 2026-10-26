package aditya_zalte.Mess_Mate_backend.controller;

import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuResponseDto;
import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuUpsertDto;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.service.WeeklyMenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner/menu")
@RequiredArgsConstructor
public class WeeklyMenuController {

    private final WeeklyMenuService weeklyMenuService;

    @PostMapping("/week")
    public ResponseEntity<Void> saveWeeklyMenu(
            @Valid @RequestBody WeeklyMenuUpsertDto dto,
            @AuthenticationPrincipal MessOwner owner
    ) {
        weeklyMenuService.saveWeeklyMenu(dto.getDays(), owner);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/week")
    public ResponseEntity<WeeklyMenuResponseDto> getWeeklyMenu(
            @AuthenticationPrincipal MessOwner owner
    ) {
        return ResponseEntity.ok(
                weeklyMenuService.getWeeklyMenu(owner)
        );
    }
}