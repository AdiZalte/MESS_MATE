package aditya_zalte.Mess_Mate_backend.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private String messOwnerId;
    private String name;
    private String email;
}