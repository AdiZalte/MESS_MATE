package aditya_zalte.Mess_Mate_backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class WeeklyMenuUpsertDto {

    @NotEmpty(message = "Weekly menu cannot be empty")
    @Valid
    private List<WeeklyMenuDayDto> days;
}