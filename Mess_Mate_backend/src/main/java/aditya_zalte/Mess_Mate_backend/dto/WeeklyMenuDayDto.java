package aditya_zalte.Mess_Mate_backend.dto;

import aditya_zalte.Mess_Mate_backend.model.enums.DayOfWeek;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class WeeklyMenuDayDto {

    @NotNull(message = "Day is required")
    private DayOfWeek dayOfWeek;

    @NotEmpty(message = "At least one menu item is required")
    @Valid
    private List<WeeklyMenuItemDto> items;
}