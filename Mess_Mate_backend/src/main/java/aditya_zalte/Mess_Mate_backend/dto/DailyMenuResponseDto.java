package aditya_zalte.Mess_Mate_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DailyMenuResponseDto {
    private String id;
    private LocalDate date;
    private String status;
    private List<MenuItemDto> items;
}