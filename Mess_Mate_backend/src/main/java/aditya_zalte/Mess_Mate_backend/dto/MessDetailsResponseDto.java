package aditya_zalte.Mess_Mate_backend.dto;

import lombok.Data;

@Data
public class MessDetailsResponseDto {

    private MessResponseDto mess;
    private WeeklyMenuResponseDto weeklyMenu;
}