package aditya_zalte.Mess_Mate_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminLoginDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}