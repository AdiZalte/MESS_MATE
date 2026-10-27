package aditya_zalte.Mess_Mate_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminAuthResponseDto {
    private String token;
    private String email;
}