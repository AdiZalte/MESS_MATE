package aditya_zalte.Mess_Mate_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class WeeklyMenuResponseDto {

    private List<WeeklyMenuDayDto> days;
}