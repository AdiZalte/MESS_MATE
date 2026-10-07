package aditya_zalte.Mess_Mate_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DailyMenuUpsertDto {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "At least one item is required")
    private List<MenuItemDto> items;
}